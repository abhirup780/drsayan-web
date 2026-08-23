import { OG_SIZE, renderOgImage } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `Media & press · ${site.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage({
    eyebrow: "Media & press",
    title: "Said once, carefully, and written down.",
    meta: "Recorded talks, and comment in The Telegraph and News18 Bengali",
  });
}
