---
name: RevenueCat proxy API paths
description: Correct endpoint paths and auth pattern for the RevenueCat Replit integration
---

## Auth approach

The RevenueCat Replit integration does NOT appear in the `/api/v2/connection` connector proxy (unlike Stripe). Use `ReplitConnectors` from `@replit/connectors-sdk` and call `connectors.proxy("revenuecat", path, opts)` directly. The `@replit/revenuecat-sdk`'s `createClient` cannot be used with a custom `fetch` override (returns empty `{}` error). Build raw wrappers (rcGet, rcPost, etc.) around `connectors.proxy` instead.

## Correct action paths (v2 API)

| Operation | Path |
|---|---|
| Attach products to entitlement | `/v2/projects/{pid}/entitlements/{eid}/actions/attach_products` |
| Attach products to package | `/v2/projects/{pid}/packages/{pkgid}/actions/attach_products` |
| List app public API keys | `/v2/projects/{pid}/apps/{appid}/public_api_keys` |
| Add test store prices | `/v2/projects/{pid}/products/{prodid}/test_store_prices` |

**Why:** The proxy blocks some methods on non-action paths (returns 405), while `/actions/attach_products` returns 200. The `/api_keys` path (without `public_`) returns 404; must use `/public_api_keys`.

## API key naming

Public API keys are NOT auto-returned by the seed script — they exist after app creation and must be fetched from `/public_api_keys`. They are named: `test_*` (test store), `appl_*` (App Store), `goog_*` (Play Store).
