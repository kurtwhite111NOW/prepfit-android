import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { WebhookHandlers } from "./webhookHandlers";

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
      res.status(200).json({ received: true });
    } catch (error: any) {
      logger.error({ err: error }, 'Webhook error');
      res.status(400).json({ error: 'Webhook processing error' });
    }
  }
);

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

app.use("/api", router);

app.get("/sitemap.xml", (req, res) => {
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
</urlset>`);
});

app.get("/robots.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send("User-agent: *\nAllow: /\n\nSitemap: https://prepfit.fit/sitemap.xml\n");
});

export default app;
