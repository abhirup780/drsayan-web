import { OG_SIZE, renderOgImage } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `The Blog · ${site.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage({
    eyebrow: "The Blog",
    title: "Written between clinics.",
    meta: "Long-form notes for parents on the questions that come up most often",
  });
}
