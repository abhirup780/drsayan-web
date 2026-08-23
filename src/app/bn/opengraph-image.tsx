import { OG_SIZE, renderOgImage } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name} · Bengali summary`;
export const size = OG_SIZE;
export const contentType = "image/png";

/**
 * Set in Latin, deliberately, even though the page itself is Bengali.
 *
 * satori does no complex text shaping, so Bengali renders with its pre-base
 * vowel signs in the wrong place — legible-looking but misspelt. See the note
 * on `renderOgImage`. A correct Bengali card needs a pre-rendered PNG; until
 * there is one, an accurate English card beats a broken Bengali one.
 */
export default async function Image() {
  return renderOgImage({
    // No Bengali glyphs here either: the Bengali font is not loaded, so they
    // would render as empty boxes.
    eyebrow: "Bengali summary · Kolkata",
    title: "A guide for parents, in Bengali.",
    meta: "Growth · Thyroid · Diabetes · Puberty · Bone",
  });
}
