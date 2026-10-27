---
name: PrepFit auth token race condition
description: Why API calls from the EAS build fire without a token (returning 401) even after Clerk is loaded.
---

## The Problem
React Query fires initial queries immediately on mount. The `setAuthTokenGetter` runs in a `useEffect` (after mount) and `getToken()` itself is async (reads SecureStore + verifies with Clerk). By the time the token is ready, the first batch of queries has already fired without auth headers → 401.

## Fix
In `_layout.tsx` `AuthGuard`, use **refs** + a **wait-loop** instead of a stale closure:

```typescript
const getTokenRef = useRef(getToken);
const clerkLoadedRef = useRef(clerkLoaded);
const isDemoModeRef = useRef(isDemoMode);
// update refs every render (no re-registration needed):
getTokenRef.current = getToken;
clerkLoadedRef.current = clerkLoaded;
isDemoModeRef.current = isDemoMode;

useEffect(() => {
  setAuthTokenGetter(async () => {
    if (isDemoModeRef.current) return "demo-mode-prepfit";
    // Poll until Clerk session hydrates from SecureStore (up to 8s)
    let waited = 0;
    while (!clerkLoadedRef.current && waited < 8_000) {
      await new Promise<void>((r) => setTimeout(r, 150));
      waited += 150;
    }
    if (!clerkLoadedRef.current) return null;
    try { return (await getTokenRef.current()) ?? null; } catch { return null; }
  });
  return () => setAuthTokenGetter(null);
}, []); // register once on mount
```

Also set React Query `retry: 2, retryDelay: attempt => Math.min(1500 * 2**attempt, 15000)` so early-firing queries get retried after Clerk loads.

**Why:** The old closure captured stale `clerkLoaded=false` and immediately returned null. Refs always see the current value; the poll handles the SecureStore async hydration delay.
