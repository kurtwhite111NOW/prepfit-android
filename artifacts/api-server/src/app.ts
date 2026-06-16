import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import router from "./routes";
import { logger } from "./lib/logger";
import { WebhookHandlers } from "./webhookHandlers";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";

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

app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

// Public paths — relative to /api mount point (Express strips the /api prefix
// from req.path inside app.use("/api", ...) middleware)
const PUBLIC_PATH_PREFIXES = [
  "/healthz",
  "/stripe/webhook",
  "/stripe/config",
  "/stripe/products",
  "/stripe/create-checkout-session",
  "/stripe/portal-by-email",
  "/stripe/create-portal-session",
];

export const requireAuth = (req: any, res: any, next: any) => {
  const isPublic = PUBLIC_PATH_PREFIXES.some(
    (p) => req.path === p || req.path.startsWith(p + "/"),
  );
  if (isPublic) return next();

  // Demo / 3-day trial users get isolated data under a fixed demo user ID
  const authHeader = req.headers["authorization"] as string | undefined;
  if (authHeader === "Bearer demo-mode-prepfit") {
    req.userId = "demo-user";
    return next();
  }

  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId || auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.userId = userId;
  next();
};

app.use("/api", requireAuth);
app.use("/api", router);

app.get("/sitemap.xml", (_req, res) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://prepfit.fit/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://prepfit.fit/planner</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://prepfit.fit/scan</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://prepfit.fit/shopping</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://prepfit.fit/meals</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://prepfit.fit/weight</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://prepfit.fit/water</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://prepfit.fit/plans</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://prepfit.fit/guide</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
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

export default app;
