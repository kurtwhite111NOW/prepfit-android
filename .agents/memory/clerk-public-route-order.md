---
name: Clerk public route ordering
description: Public crawler and asset routes must be mounted before Clerk middleware to avoid browser-triggered handshake redirects.
---

# Clerk public route ordering

Public routes used by browsers, crawlers, or unauthenticated external callers must be mounted before `clerkMiddleware`.

**Why:** Clerk can start a handshake based on browser-style request headers before a later authorization allowlist runs. This caused valid sitemap requests to redirect through Clerk and made Google Search Console report “Couldn’t fetch.”

**How to apply:** Mount sitemap, robots, public downloads, and similar routes before Clerk. A later `requireAuth` bypass alone is insufficient.