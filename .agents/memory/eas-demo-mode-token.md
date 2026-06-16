---
name: EAS native build — demo mode auth token registration
description: setAuthTokenGetter must be registered unconditionally; gating it on clerkLoaded blocks demo mode when Clerk never loads.
---

In `_layout.tsx` AuthGuard, `setAuthTokenGetter` was originally wrapped in `useEffect(() => { if (!clerkLoaded) return; ... })`. When Clerk times out on a real device, `clerkLoaded` stays `false` forever, so the getter is never registered and every API call goes out with no token → 401.

**Fix:** Remove the `if (!clerkLoaded) return` guard from the effect. Move the Clerk-loaded check *inside* the getter function itself:

```typescript
useEffect(() => {
  setAuthTokenGetter(async () => {
    if (isDemoMode) return "demo-mode-prepfit";
    if (!clerkLoaded) return null;
    try { return (await getToken()) ?? null; } catch { return null; }
  });
}, [getToken, clerkLoaded, isDemoMode]);
```

**Why:** The getter needs to be registered on mount so demo users get a token immediately. Signed-in users still get their Clerk JWT once Clerk loads because `clerkLoaded` is in the deps array and triggers a re-registration.

**Server side:** The API server `requireAuth` middleware must accept `Authorization: Bearer demo-mode-prepfit` and set `req.userId = "demo-user"` for isolated demo data.
