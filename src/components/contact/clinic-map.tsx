import type { Clinic } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The clinic on a map, framed like everything else on the site.
 *
 * Two deliberate choices:
 *
 * `loading="lazy"` — the iframe is not requested until the visitor scrolls it
 * into view. Someone who reads the phone number at the top and leaves never
 * touches Google at all, and the map never competes with the page's own LCP.
 *
 * No API key — this is the keyless `output=embed` form. The Maps Embed API
 * would need a key shipped in the client bundle, where it would be public and
 * billable by anyone who copied it.
 *
 * Loading this does set Google cookies, which is why the privacy page names
 * it explicitly rather than claiming the site embeds nothing.
 */
export function ClinicMap({ clinic, className }: { clinic: Clinic; className?: string }) {
  if (!clinic.geo) return null;

  const { lat, lng } = clinic.geo;
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=16&hl=en&output=embed`;

  return (
    <figure className={cn("flex flex-col overflow-hidden rounded-2xl border border-line", className)}>
      {/* `flex-1` lets the map stretch to whatever height its neighbour sets,
          so the two never leave a gap between them. */}
      <iframe
        src={src}
        title={`Map showing ${clinic.name}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block w-full flex-1 border-0 min-h-[320px]"
      />
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-line bg-paper-raised px-5 py-4">
        <span className="text-[0.9rem] text-ink-muted">
          {clinic.area}
        </span>
        <a
          href={clinic.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline text-[0.9rem] text-marigold"
        >
          Get directions
        </a>
      </figcaption>
    </figure>
  );
}
