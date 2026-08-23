import { OG_SIZE, renderOgImage } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `About the practice · ${site.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage({
    eyebrow: "About the practice",
    title: "A doctor who plots the chart with you, not at you.",
    meta: "DM, PGIMER Chandigarh · MD Paediatrics, R. G. Kar",
  });
}
