import { OG_SIZE, renderOgImage } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `Resources for parents · ${site.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage({
    eyebrow: "Resources for parents",
    title: "Things worth having before you need them.",
    meta: "Guides, checklists and a one-page school plan",
  });
}
