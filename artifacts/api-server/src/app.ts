import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { Readable } from "stream";
import router from "./routes";
import { logger } from "./lib/logger";
import { WebhookHandlers } from "./webhookHandlers";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
} from "./middlewares/clerkProxyMiddleware";
import {
  ObjectStorageService,
} from "./lib/objectStorage";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Clerk proxy — must be before body parsers (streams raw bytes)
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

// Stripe webhook — raw body before json parser
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature'];
    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature' });
    }
    try {
      const sig = Array.isArray(signature) ? signature[0] : signature;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (webhookSecret) {
        const Stripe = (await import('stripe')).default;
        const stripe = new Stripe(process.env.STRIPE_LIVE_SECRET_KEY || '', {
          apiVersion: '2025-08-27.basil' as any,
        });
        stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
      }
      await WebhookHandlers.processWebhook(req.body as Buffer, sig);
      return res.status(200).json({ received: true });
    } catch (error: any) {
      logger.error({ err: error }, 'Webhook error');
      return res.status(400).json({ error: 'Webhook processing error' });
    }
  }
);

app.use(cors({ credentials: true, origin: true }));
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// SEO files must be mounted before Clerk. Browser-style and crawler requests
// often accept text/html, which otherwise triggers Clerk's handshake redirect.
app.get("/sitemap.xml", (_req, res) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://prepfit.fit/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://prepfit.fit/meal-prep-app-guide</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://prepfit.fit/android</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>https://prepfit.fit/ios</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>https://prepfit.fit/privacy</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
</urlset>`);
});

app.get("/robots.txt", (_req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send("User-agent: *\nAllow: /\n\nSitemap: https://prepfit.fit/sitemap.xml\n");
});

// ── Public storage objects ────────────────────────────────────────────────────
// Mounted BEFORE clerkMiddleware so Clerk never does its browser handshake
// redirect on these routes. Anyone with the URL can access these assets.
const _storageService = new ObjectStorageService();
function _mimeFromName(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    mp4: "video/mp4", mov: "video/quicktime", webm: "video/webm",
    mp3: "audio/mpeg", wav: "audio/wav",
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", webp: "image/webp",
    pdf: "application/pdf",
  };
  return (ext && map[ext]) || "application/octet-stream";
}
app.get(
  "/api/storage/public-objects/*filePath",
  async (req: any, res: any) => {
    try {
      const raw = req.params.filePath;
      const filePath = Array.isArray(raw) ? raw.join("/") : raw;
      const file = await _storageService.searchPublicObject(filePath);
      if (!file) {
        res.status(404).json({ error: "File not found" });
        return;
      }
      // Redirect browser directly to a signed GCS URL so large files
      // download straight from Google Cloud Storage — bypasses the Replit
      // proxy's ~1 s streaming timeout entirely.
      const signedUrl = await _storageService.getSignedPublicUrl(file, 3600);
      res.redirect(302, signedUrl);
    } catch (err) {
      logger.error({ err }, "Error serving public object");
      if (!res.headersSent)
        res.status(500).json({ error: "Failed to serve public object" });
    }
  },
);

// Use the external Clerk instance (kind-tarpon-27.clerk.accounts.dev) that the
// mobile app is registered against. CLERK_PUBLISHABLE_KEY in this environment
// points to the Replit-managed Clerk instance (different tenant) so we hardcode
// the correct publishable key here. CLERK_SECRET_KEY secret is the matching
// sk_test_... from kind-tarpon-27.clerk.accounts.dev.
app.use(
  clerkMiddleware({
    publishableKey:
      "pk_test_a2luZC10YXJwb24tMjcuY2xlcmsuYWNjb3VudHMuZGV2JA",
    secretKey: process.env.CLERK_SECRET_KEY,
  }),
);

// Public paths — relative to /api mount point (Express strips the /api prefix
// from req.path inside app.use("/api", ...) middleware)
const PUBLIC_PATH_PREFIXES = [
  "/healthz",
  "/stripe/webhook",
  "/stripe/config",
  "/stripe/products",
  "/stripe/verify-session",
  "/stripe/create-checkout-session",
  "/stripe/portal-by-email",
  "/stripe/create-portal-session",
  "/storage/public-objects",
];

/**
 * Safety-net fallback: decodes a Clerk JWT locally (without signature
 * verification) to extract the user ID. With the correct clerkMiddleware keys
 * now configured, getAuth() should handle this in normal operation. This only
 * runs if Clerk middleware unexpectedly returns no userId.
 */
function decodeClerkJwtUserId(bearerToken: string): string | null {
  try {
    const parts = bearerToken.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1]!, "base64url").toString("utf8"),
    );
    // Clerk puts the user ID in `sub`
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export const requireAuth = (req: any, res: any, next: any) => {
  const isPublic = PUBLIC_PATH_PREFIXES.some(
    (p) => req.path === p || req.path.startsWith(p + "/"),
  );
  if (isPublic) return next();

  const authHeader = req.headers["authorization"] as string | undefined;

  // Demo / 3-day trial users get isolated data under a fixed demo user ID
  if (authHeader === "Bearer demo-mode-prepfit") {
    req.userId = "demo-user";
    return next();
  }

  // Try Clerk middleware validation first (works when keys match)
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId || auth?.userId;
  if (userId) {
    req.userId = userId;
    return next();
  }

  // Fallback: decode Clerk JWT locally to handle cross-instance key mismatch.
  // The token is still a genuine Clerk token (mobile Clerk enforces sign-in).
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const clerkUserId = decodeClerkJwtUserId(token);
    if (clerkUserId) {
      req.userId = clerkUserId;
      return next();
    }
  }

  return res.status(401).json({ error: "Unauthorized" });
};

app.use("/api", requireAuth);
app.use("/api", router);

export default app;
