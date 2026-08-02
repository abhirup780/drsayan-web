import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostRow } from "@/components/blog/post-card";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { getAllTags, getPostsByTag } from "@/lib/blog";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: t.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/tag/[tag]">): Promise<Metadata> {
  const { tag: slug } = await props.params;
  const entry = getAllTags().find((t) => t.slug === slug);
  if (!entry) return {};

  return {
    title: `${entry.tag} · Blog`,
    description: `Articles on ${entry.tag} from the paediatric endocrinology blog of Dr. Sayan Banerjee.`,
    alternates: { canonical: `/blog/tag/${entry.slug}` },
    robots: { index: entry.count > 1, follow: true },
  };
}

export default async function TagPage(props: PageProps<"/blog/tag/[tag]">) {
  const { tag: slug } = await props.params;
  const tags = getAllTags();
  const entry = tags.find((t) => t.slug === slug);
  if (!entry) notFound();

  const posts = getPostsByTag(slug);

  return (
    <>
      <PageHeader
        eyebrow={`Tag · ${posts.length} article${posts.length === 1 ? "" : "s"}`}
        title={entry.tag}
        lede={`Everything in the Blog filed under “${entry.tag}”.`}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: entry.tag },
        ]}
      />

      <Container width="wide" className="pb-24 sm:pb-32">
        <div className="border-t border-line">
          {posts.map((post) => (
            <PostRow key={post.slug} post={post} />
          ))}
        </div>

        <nav aria-label="All tags" className="mt-14">
          <h2 className="label">Every tag</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {tags.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/blog/tag/${t.slug}`}
                  aria-current={t.slug === slug ? "page" : undefined}
                  className={cn(
                    "inline-block rounded-full border px-3 py-1 text-[0.78rem] transition-colors",
                    t.slug === slug
                      ? "border-marigold bg-marigold text-white dark:text-ink"
                      : "border-line text-ink-muted hover:border-marigold hover:text-marigold"
                  )}
                >
                  {t.tag}
                  <span className="ml-1.5 opacity-60">{t.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: entry.tag, href: `/blog/tag/${entry.slug}` },
        ]}
      />
    </>
  );
}
