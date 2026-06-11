import { rcGet, rcPost, rcPostIgnoreDuplicate, rcPatch } from "./revenueCatClient";

// ── PrepFit config ────────────────────────────────────────────────────────────
const PROJECT_NAME = "PrepFit";
const PLAY_STORE_PACKAGE_NAME = "prepfit.com";
const APP_STORE_BUNDLE_ID = "prepfit.com";

const ENTITLEMENT_IDENTIFIER = "pro";
const ENTITLEMENT_DISPLAY_NAME = "PrepFit Pro";

const OFFERING_IDENTIFIER = "default";
const OFFERING_DISPLAY_NAME = "Default Offering";

// ── Types ─────────────────────────────────────────────────────────────────────
type Project = { id: string; name: string; object: string };
type App = { id: string; name: string; type: string; object: string };
type Product = { id: string; store_identifier: string; app_id: string };
type Entitlement = { id: string; lookup_key: string };
type Offering = { id: string; lookup_key: string; is_current: boolean };
type Package = { id: string; lookup_key: string };
type ListResponse<T> = { items: T[]; object: string };
type ApiKey = { key: string };

// ── Helpers ───────────────────────────────────────────────────────────────────
async function findOrCreateProject(): Promise<Project> {
  const { items } = await rcGet<ListResponse<Project>>("/v2/projects?limit=20");
  const existing = items.find((p) => p.name === PROJECT_NAME);
  if (existing) {
    console.log("Project already exists:", existing.id);
    return existing;
  }
  const created = await rcPost<Project>("/v2/projects", { name: PROJECT_NAME });
  console.log("Created project:", created.id);
  return created;
}

async function findOrCreateApp(
  projectId: string,
  apps: App[],
  type: "test_store" | "app_store" | "play_store",
  name: string,
  config?: Record<string, unknown>,
): Promise<App> {
  const existing = apps.find((a) => a.type === type);
  if (existing) {
    console.log(`${type} app found:`, existing.id);
    return existing;
  }
  const body: Record<string, unknown> = { name, type, ...config };
  const created = await rcPost<App>(`/v2/projects/${projectId}/apps`, body);
  console.log(`Created ${type} app:`, created.id);
  return created;
}

async function findOrCreateProduct(
  projectId: string,
  existingProducts: Product[],
  appId: string,
  storeId: string,
  displayName: string,
  isTestStore: boolean,
  duration?: string,
  title?: string,
): Promise<Product> {
  const existing = existingProducts.find(
    (p) => p.store_identifier === storeId && p.app_id === appId,
  );
  if (existing) {
    console.log(`Product ${storeId} already exists:`, existing.id);
    return existing;
  }
  const body: Record<string, unknown> = {
    store_identifier: storeId,
    app_id: appId,
    type: "subscription",
    display_name: displayName,
  };
  if (isTestStore && duration && title) {
    body.subscription = { duration };
    body.title = title;
  }
  const created = await rcPost<Product>(
    `/v2/projects/${projectId}/products`,
    body,
  );
  console.log(`Created product ${storeId}:`, created.id);
  return created;
}

async function seedRevenueCat() {
  // ── Project ──────────────────────────────────────────────────────────────
  const project = await findOrCreateProject();
  const projectId = project.id;

  // ── Apps ─────────────────────────────────────────────────────────────────
  const { items: apps } = await rcGet<ListResponse<App>>(
    `/v2/projects/${projectId}/apps?limit=20`,
  );

  const testStoreApp = await findOrCreateApp(
    projectId,
    apps,
    "test_store",
    "PrepFit Test Store",
  );
  const appStoreApp = await findOrCreateApp(
    projectId,
    apps,
    "app_store",
    "PrepFit iOS",
    { app_store: { bundle_id: APP_STORE_BUNDLE_ID } },
  );
  const playStoreApp = await findOrCreateApp(
    projectId,
    apps,
    "play_store",
    "PrepFit Android",
    { play_store: { package_name: PLAY_STORE_PACKAGE_NAME } },
  );

  // ── Products ──────────────────────────────────────────────────────────────
  const { items: existingProducts } = await rcGet<ListResponse<Product>>(
    `/v2/projects/${projectId}/products?limit=100`,
  );

  const testMonthly = await findOrCreateProduct(
    projectId,
    existingProducts,
    testStoreApp.id,
    "prepfit_pro_monthly",
    "PrepFit Pro Monthly",
    true,
    "P1M",
    "PrepFit Pro Monthly",
  );
  const appStoreMonthly = await findOrCreateProduct(
    projectId,
    existingProducts,
    appStoreApp.id,
    "prepfit_pro_monthly",
    "PrepFit Pro Monthly",
    false,
  );
  const playStoreMonthly = await findOrCreateProduct(
    projectId,
    existingProducts,
    playStoreApp.id,
    "prepfit_pro_monthly:monthly",
    "PrepFit Pro Monthly",
    false,
  );

  const testAnnual = await findOrCreateProduct(
    projectId,
    existingProducts,
    testStoreApp.id,
    "prepfit_pro_annual",
    "PrepFit Pro Annual",
    true,
    "P1Y",
    "PrepFit Pro Annual",
  );
  const appStoreAnnual = await findOrCreateProduct(
    projectId,
    existingProducts,
    appStoreApp.id,
    "prepfit_pro_annual",
    "PrepFit Pro Annual",
    false,
  );
  const playStoreAnnual = await findOrCreateProduct(
    projectId,
    existingProducts,
    playStoreApp.id,
    "prepfit_pro_annual:annual",
    "PrepFit Pro Annual",
    false,
  );

  // Test store prices
  const addTestPrice = async (
    productId: string,
    priceMicros: number,
    label: string,
  ) => {
    const result = await rcPostIgnoreDuplicate(
      `/v2/projects/${projectId}/products/${productId}/test_store_prices`,
      { prices: [{ amount_micros: priceMicros, currency: "USD" }] },
    );
    if (result === null) console.log(`${label} test store price already exists`);
    else console.log(`Added ${label} test store price`);
  };

  await addTestPrice(testMonthly.id, 14_000_000, "Monthly");
  await addTestPrice(testAnnual.id, 168_000_000, "Annual");

  // ── Entitlement ───────────────────────────────────────────────────────────
  const { items: existingEntitlements } = await rcGet<ListResponse<Entitlement>>(
    `/v2/projects/${projectId}/entitlements?limit=20`,
  );
  let entitlement = existingEntitlements.find(
    (e) => e.lookup_key === ENTITLEMENT_IDENTIFIER,
  );
  if (entitlement) {
    console.log("Entitlement already exists:", entitlement.id);
  } else {
    entitlement = await rcPost<Entitlement>(
      `/v2/projects/${projectId}/entitlements`,
      {
        lookup_key: ENTITLEMENT_IDENTIFIER,
        display_name: ENTITLEMENT_DISPLAY_NAME,
      },
    );
    console.log("Created entitlement:", entitlement.id);
  }

  const attachEntResult = await rcPostIgnoreDuplicate(
    `/v2/projects/${projectId}/entitlements/${entitlement.id}/actions/attach_products`,
    {
      product_ids: [
        testMonthly.id,
        testAnnual.id,
        appStoreMonthly.id,
        appStoreAnnual.id,
        playStoreMonthly.id,
        playStoreAnnual.id,
      ],
    },
  );
  if (attachEntResult === null)
    console.log("Products already attached to entitlement");
  else console.log("Attached all products to entitlement");

  // ── Offering ──────────────────────────────────────────────────────────────
  const { items: existingOfferings } = await rcGet<ListResponse<Offering>>(
    `/v2/projects/${projectId}/offerings?limit=20`,
  );
  let offering = existingOfferings.find(
    (o) => o.lookup_key === OFFERING_IDENTIFIER,
  );
  if (offering) {
    console.log("Offering already exists:", offering.id);
  } else {
    offering = await rcPost<Offering>(
      `/v2/projects/${projectId}/offerings`,
      { lookup_key: OFFERING_IDENTIFIER, display_name: OFFERING_DISPLAY_NAME },
    );
    console.log("Created offering:", offering.id);
  }

  if (!offering.is_current) {
    await rcPatch(`/v2/projects/${projectId}/offerings/${offering.id}`, {
      is_current: true,
    });
    console.log("Set offering as current");
  }

  // ── Packages ──────────────────────────────────────────────────────────────
  const { items: existingPackages } = await rcGet<ListResponse<Package>>(
    `/v2/projects/${projectId}/offerings/${offering.id}/packages?limit=20`,
  );

  const findOrCreatePkg = async (
    lookupKey: string,
    displayName: string,
  ): Promise<Package> => {
    const existing = existingPackages.find((p) => p.lookup_key === lookupKey);
    if (existing) {
      console.log(`Package ${lookupKey} already exists:`, existing.id);
      return existing;
    }
    const created = await rcPost<Package>(
      `/v2/projects/${projectId}/offerings/${offering!.id}/packages`,
      { lookup_key: lookupKey, display_name: displayName },
    );
    console.log(`Created package ${lookupKey}:`, created.id);
    return created;
  };

  const monthlyPkg = await findOrCreatePkg("$rc_monthly", "Monthly");
  const annualPkg = await findOrCreatePkg("$rc_annual", "Annual");

  const attachProducts = async (
    pkgId: string,
    products: Product[],
    label: string,
  ) => {
    const result = await rcPostIgnoreDuplicate(
      `/v2/projects/${projectId}/packages/${pkgId}/actions/attach_products`,
      {
        products: products.map((p) => ({
          product_id: p.id,
          eligibility_criteria: "all",
        })),
      },
    );
    if (result === null)
      console.log(`${label} package products already attached`);
    else console.log(`Attached products to ${label} package`);
  };

  await attachProducts(
    monthlyPkg.id,
    [testMonthly, appStoreMonthly, playStoreMonthly],
    "Monthly",
  );
  await attachProducts(
    annualPkg.id,
    [testAnnual, appStoreAnnual, playStoreAnnual],
    "Annual",
  );

  // ── API Keys ──────────────────────────────────────────────────────────────
  const { items: testKeys } = await rcGet<{ items: ApiKey[] }>(
    `/v2/projects/${projectId}/apps/${testStoreApp.id}/public_api_keys`,
  );
  const { items: iosKeys } = await rcGet<{ items: ApiKey[] }>(
    `/v2/projects/${projectId}/apps/${appStoreApp.id}/public_api_keys`,
  );
  const { items: androidKeys } = await rcGet<{ items: ApiKey[] }>(
    `/v2/projects/${projectId}/apps/${playStoreApp.id}/public_api_keys`,
  );

  console.log("\n====================");
  console.log("RevenueCat setup complete!");
  console.log("Project ID:", projectId);
  console.log("Test Store App ID:", testStoreApp.id);
  console.log("App Store App ID:", appStoreApp.id);
  console.log("Play Store App ID:", playStoreApp.id);
  console.log("Entitlement:", ENTITLEMENT_IDENTIFIER);
  console.log(
    "Test Store API Key:",
    testKeys.map((k) => k.key).join(", ") || "N/A",
  );
  console.log(
    "iOS API Key:",
    iosKeys.map((k) => k.key).join(", ") || "N/A",
  );
  console.log(
    "Android API Key:",
    androidKeys.map((k) => k.key).join(", ") || "N/A",
  );
  console.log("====================\n");
}

seedRevenueCat().catch(console.error);
