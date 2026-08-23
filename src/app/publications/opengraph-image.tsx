import { OG_SIZE, renderOgImage } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `Publications · ${site.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage({
    eyebrow: "Publications",
    title: "The questions worth writing down.",
    meta: "26 peer-reviewed papers in paediatric endocrinology",
  });
}
