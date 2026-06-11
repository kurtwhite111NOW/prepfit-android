import { ReplitConnectors } from "@replit/connectors-sdk";

let _connectors: ReplitConnectors | null = null;

function getConnectors() {
  if (!_connectors) _connectors = new ReplitConnectors();
  return _connectors;
}

export async function rcGet<T>(path: string): Promise<T> {
  const connectors = getConnectors();
  const res = await connectors.proxy("revenuecat", path, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(`GET ${path} failed: ${JSON.stringify(data)}`);
  return data as T;
}

export async function rcPost<T>(path: string, body: unknown): Promise<T> {
  const connectors = getConnectors();
  const res = await connectors.proxy("revenuecat", path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`POST ${path} failed: ${JSON.stringify(data)}`);
  return data as T;
}

export async function rcPostIgnoreDuplicate<T>(
  path: string,
  body: unknown,
): Promise<T | null> {
  const connectors = getConnectors();
  const res = await connectors.proxy("revenuecat", path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (res.status === 409 || (data as any)?.type === "resource_already_exists") {
    return null;
  }
  if (!res.ok) throw new Error(`POST ${path} failed: ${JSON.stringify(data)}`);
  return data as T;
}

export async function rcPatch<T>(path: string, body: unknown): Promise<T> {
  const connectors = getConnectors();
  const res = await connectors.proxy("revenuecat", path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`PATCH ${path} failed: ${JSON.stringify(data)}`);
  return data as T;
}
