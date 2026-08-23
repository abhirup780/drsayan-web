import { OG_SIZE, renderOgImage } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `Contact & appointments · ${site.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage({
    eyebrow: "Contact & appointments",
    title: "Let’s find a time.",
    meta: "New Town, Kolkata, and seven monthly OPD clinics across West Bengal",
  });
}
