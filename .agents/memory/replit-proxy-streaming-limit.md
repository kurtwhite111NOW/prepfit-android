---
name: Replit proxy streaming limit
description: Replit autoscale deployment proxy times out streaming responses at ~1 second — large files must use signed URL redirects, not server-side piping.
---

# Replit Proxy Streaming Limit

## The Rule
Never stream large files (>~10MB) through an Express route in a Replit autoscale deployment. The proxy cuts the connection after ~1 second, returning 500 to the browser even though the server logged 200.

**Why:** The Replit autoscale proxy has a hard ~1 second timeout on response streaming. Small files (≤10MB) complete within the window; larger ones get aborted mid-stream and the proxy converts the broken pipe to a 500.

**How to apply:** For any file-serving route (video, audio, large images, downloads), generate a signed GCS URL and `res.redirect(302, signedUrl)` instead of piping the stream through Express. The browser then fetches directly from GCS with no proxy in the way.

## Implementation
`ObjectStorageService.getSignedPublicUrl(file, ttlSec)` generates a time-limited signed GET URL via the sidecar endpoint (`http://127.0.0.1:1106/object-storage/signed-object-url`). Use this in any public asset route.

The early-mount handler in `artifacts/api-server/src/app.ts` (before `clerkMiddleware`) does:
1. `searchPublicObject(filePath)` — finds the GCS file
2. `getSignedPublicUrl(file, 3600)` — gets a 1-hour signed URL
3. `res.redirect(302, signedUrl)` — browser downloads directly from GCS
