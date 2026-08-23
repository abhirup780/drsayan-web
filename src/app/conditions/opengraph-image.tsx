import { OG_SIZE, renderOgImage } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `Conditions treated · ${site.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage({
    eyebrow: "Conditions treated",
    title: "Fifty conditions, eight systems, one childhood.",
    meta: "Growth · Diabetes · Thyroid · Puberty · Bone · Adrenal",
  });
}
