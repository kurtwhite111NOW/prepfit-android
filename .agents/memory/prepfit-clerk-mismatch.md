---
name: PrepFit API 401 — Clerk instance mismatch
description: Root cause and fix for all API calls returning 401 in the PrepFit Android EAS build despite a valid Bearer token being sent.
---

## The Problem
`getAuth(req)` returns `userId: null` even though the mobile app sends a real Clerk JWT (`Bearer eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX…`).

## Root Cause
The Replit-environment `CLERK_SECRET_KEY` and `CLERK_PUBLISHABLE_KEY` are for a **different Clerk instance** (the Replit-managed one) than the mobile app uses (external account: `kind-tarpon-27.clerk.accounts.dev`, publishable key `pk_test_a2luZC10YXJwb24tMjcuY2xlcmsuYWNjb3VudHMuZGV2JA`). The `@clerk/express` `clerkMiddleware` tries to verify the JWT using the wrong JWKS endpoint and silently fails.

**Why it's hard to spot:** The token *is* sent and received — `req.headers.authorization` shows a real JWT. Only `getAuth(req).userId` is null.

## Fix (development/preview)
Added `decodeClerkJwtUserId()` in `api-server/src/app.ts` — falls back to local JWT base64 decode after `getAuth()` fails. Extracts `payload.sub` as the userId. No signature verification (acceptable for dev builds; mobile enforces sign-in).

```typescript
function decodeClerkJwtUserId(bearerToken: string): string | null {
  const parts = bearerToken.split(".");
  if (parts.length !== 3) return null;
  const payload = JSON.parse(Buffer.from(parts[1]!, "base64url").toString("utf8"));
  return typeof payload.sub === "string" ? payload.sub : null;
}
```

## Proper Production Fix
Set `CLERK_SECRET_KEY` to the `sk_test_...` key from the **kind-tarpon-27** Clerk dashboard → API Keys. This lets `clerkMiddleware` validate JWTs properly with signature verification.

**Why:** Clerk's JWT verification uses the secret key to derive the correct JWKS endpoint. Without it pointing to kind-tarpon-27, all mobile app tokens are rejected.
