---
name: API server Clerk key — use env var directly
description: publishableKeyFromHost derives the wrong Clerk key from the Replit proxy host, causing all real-device JWTs to fail with 401.
---

The `clerkMiddleware` in `app.ts` was configured as:

```typescript
clerkMiddleware((req) => ({
  publishableKey: publishableKeyFromHost(
    getClerkProxyHost(req) ?? "",
    process.env.CLERK_PUBLISHABLE_KEY,
  ),
}))
```

`publishableKeyFromHost` derives a Clerk publishable key from the incoming request host. In the Replit browser preview (web), the host is the Replit dev domain and this resolves to the Replit-managed Clerk key. But when a real Android device hits the same server through the Replit proxy, the derived key differs from the external Clerk account key — so every JWT the app sends fails verification → blanket 401.

**Fix:** Always pass the key directly from the env var:

```typescript
clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
})
```

**Why:** `publishableKeyFromHost` is designed for multi-tenant Clerk setups where the key is inferred per-request. PrepFit uses a single external Clerk account — the key should be static, not host-derived.

**How to apply:** Any time `clerkMiddleware` is configured in `app.ts`, use the direct env var form. Do not use `publishableKeyFromHost` unless intentionally supporting multi-tenant Clerk.
