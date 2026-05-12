import { useEffect } from "react";

const SITE = "PrepFit";

export function usePageTitle(title: string, description?: string) {
  useEffect(() => {
    document.title = `${title} | ${SITE}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && description) {
      metaDesc.setAttribute("content", description);
    }
  }, [title, description]);
}
