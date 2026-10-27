---
name: Public navigation reliability
description: Why signed-out PrepFit pages use direct browser navigation instead of client-side routing.
---

Public homepage and guide links should use standard anchors for navigation to public, sign-in, and sign-up routes rather than client-side router links.

**Why:** The client router passes through the Clerk provider and could update the URL without promptly mounting the destination. Users then had to refresh. Direct navigation was confirmed to resolve quickly in production.

**How to apply:** Keep header, hero, mobile-menu, and footer navigation on signed-out public pages as direct anchors. Reserve client-side routing for authenticated dashboard interactions.