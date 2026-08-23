import { site } from "@/lib/site";

/**
 * Open Graph fields every page should carry.
 *
 * Next replaces the whole `openGraph` object when a page declares one rather
 * than merging it with the layout's, so `siteName` and `locale` silently
 * vanished from every page that set its own title and description. Facebook
 * and LinkedIn use `og:site_name` for the attribution line above the preview,
 * so losing it costs the practice its name on every shared inner page.
 *
 * Spread this first in any page's `openGraph`, then override what differs:
 *
 *   openGraph: { ...ogDefaults, title: "…", url: "/…" }
 *
 * The Bengali page overrides `locale` to `bn_IN`.
 */
export const ogDefaults = {
  siteName: site.name,
  locale: site.locale,
} as const;
