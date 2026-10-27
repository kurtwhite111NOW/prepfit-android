import { useEffect } from "react";

const SITE = "PrepFit";
const PUBLIC_PATHS = new Set([
  "/", "/meal-prep-app-guide", "/android", "/ios", "/privacy", "/fasting", "/windows",
]);

export function usePageTitle(title: string, description?: string) {
  useEffect(() => {
    const pageTitle = title.includes(SITE) ? title : `${title} | ${SITE}`;
    document.title = pageTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && description) {
      metaDesc.setAttribute("content", description);
    }
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    const isPublic = PUBLIC_PATHS.has(path);
    const url = `https://prepfit.fit${path}`;
    const robots = document.querySelector('meta[name="robots"]');
    robots?.setAttribute("content", isPublic ? "index, follow" : "noindex, follow");
    const canonical = document.querySelector('link[rel="canonical"]');
    if (isPublic) {
      if (canonical) canonical.setAttribute("href", url);
      else {
        const link = document.createElement("link");
        link.rel = "canonical";
        link.href = url;
        document.head.appendChild(link);
      }
    } else {
      canonical?.remove();
    }
    for (const [selector, value] of [
      ['meta[property="og:url"]', url],
      ['meta[property="og:title"]', pageTitle],
      ['meta[name="twitter:url"]', url],
      ['meta[name="twitter:title"]', pageTitle],
    ]) {
      document.querySelector(selector)?.setAttribute("content", value);
    }
    if (description) {
      for (const selector of ['meta[property="og:description"]', 'meta[name="twitter:description"]']) {
        document.querySelector(selector)?.setAttribute("content", description);
      }
    }
  }, [title, description]);
}
