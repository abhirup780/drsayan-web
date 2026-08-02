import { OG_SIZE, renderOgImage } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name} · ${site.role}, ${site.city}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage({
    eyebrow: `Paediatric endocrinology · ${site.city}`,
    title: "Every child grows on their own curve.",
    meta: "Growth · Diabetes · Thyroid · Puberty · Bone & metabolic health",
  });
}
