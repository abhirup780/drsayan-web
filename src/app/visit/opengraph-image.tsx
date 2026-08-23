import { OG_SIZE, renderOgImage } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `Your first visit · ${site.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage({
    eyebrow: "Your first visit",
    title: "Bring the old reports. Bring the questions too.",
    meta: "What to expect, what to bring, and what happens after",
  });
}
