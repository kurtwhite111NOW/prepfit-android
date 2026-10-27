---
name: PrepFit SPA canonical strategy
description: Why the shared HTML shell must not include a fixed homepage canonical
---

The single-page app serves the same original HTML shell for multiple public and signed-in routes. Do not set a homepage canonical in that original shared HTML when other routes need their own canonicals. Set a single canonical after the actual public path is known; leave signed-in routes without a canonical and mark them noindex.

**Why:** Google's JavaScript SEO guidance allows a JavaScript-set canonical if the original HTML does not specify a conflicting one. A homepage canonical in the shared shell incorrectly labels the guide and other public URLs as duplicates. A static shell cannot give different raw HTML canonicals per route without changing the delivery architecture.

**How to apply:** When adding public routes, keep their metadata and canonical mapping aligned with their sitemap eligibility. If moving to route-specific server-rendered or prerendered HTML later, prefer canonical tags in the delivered HTML instead.