---
name: Expo + Replit Clerk publishable key
description: How to get the Clerk publishable key in an Expo app when Replit-managed Clerk is active (no static env var).
---

# Expo + Replit Clerk Publishable Key

Replit-managed Clerk does not expose a static `CLERK_PUBLISHABLE_KEY` env var. The publishable key is derived dynamically from the Replit hostname.

**Rule:** In Expo apps, import `publishableKeyFromHost` from `@clerk/shared/keys` (must add `@clerk/shared` as a dependency) and call it with `process.env.EXPO_PUBLIC_DOMAIN`:

```tsx
import { publishableKeyFromHost } from "@clerk/shared/keys";

const CLERK_KEY =
  publishableKeyFromHost(
    process.env.EXPO_PUBLIC_DOMAIN ?? "",
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  ) ?? "";
```

**Why:** The Expo workflow injects `EXPO_PUBLIC_DOMAIN=$REPLIT_DEV_DOMAIN`, which is the same Replit domain `publishableKeyFromHost` uses in the web app (`window.location.hostname`). The function constructs a `pk_test_XXX` key from the Replit subdomain.

**How to apply:** Any new Expo artifact that uses Replit-managed Clerk needs this pattern in its root `_layout.tsx`. Also install `@clerk/shared` as a direct dependency in the Expo package.
