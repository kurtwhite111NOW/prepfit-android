---
name: EAS native build — Replit-managed Clerk unreachable
description: Replit-managed Clerk frontend API URL is not publicly accessible from real devices; breaks auth in standalone APKs.
---

The Replit-managed Clerk key is derived from the Replit dev domain (e.g. `picard.replit.dev`). The Clerk Frontend API URL that key resolves to (`clerk.{replit-dev-domain}`) is **not reachable from outside Replit's network** — curl returns exit code 60 (SSL/connection failure). Any standalone EAS build using this key will have `clerkLoaded` stuck at `false` forever on a real device.

**Why:** Replit-managed Clerk is provisioned only for the Replit browser preview environment, not for arbitrary external HTTPS clients.

**How to apply:** For any EAS/native build, the app needs a real external Clerk account (clerk.com free tier). Update `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` in all `eas.json` profiles and update `CLERK_PUBLISHABLE_KEY` / `VITE_CLERK_PUBLISHABLE_KEY` secrets in Replit for the API server. Also update `_layout.tsx` to use the key directly (`process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`) instead of `publishableKeyFromHost`.
