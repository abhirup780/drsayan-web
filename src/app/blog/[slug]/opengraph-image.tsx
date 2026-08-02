import { getCategory, getPost, getPostSlugs } from "@/lib/blog";
import { OG_SIZE, renderOgImage } from "@/lib/og";
import { formatDate } from "@/lib/utils";

export const alt = "Article from the Blog";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export default async function Image(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = getPost(slug);

  if (!post) {
    return renderOgImage({ eyebrow: "The Blog", title: "Article not found" });
  }

  return renderOgImage({
    eyebrow: getCategory(post.category)?.name ?? "The Blog",
    title: post.title,
    meta: `${formatDate(post.date)} · ${post.readingTime}`,
  });
}
