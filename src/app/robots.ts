import type { MetadataRoute } from "next";

import { isCanonicalDomain, site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // On a *.vercel.app URL the whole site is disallowed, so a shared preview
  // never gets indexed and cannot later compete with the real domain for the
  // practice's own name. Setting NEXT_PUBLIC_SITE_URL opens it up.
  if (!isCanonicalDomain) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
