import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostRow } from "@/components/blog/post-card";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { CATEGORIES, getCategoriesWithCounts, getCategory, getPostsByCategory } from "@/lib/blog";
import { cn } from "@/lib/utils";
import { ogDefaults } from "@/lib/metadata";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/category/[category]">
): Promise<Metadata> {
  const { category: slug } = await props.params;
  const category = getCategory(slug);
  if (!category) return {};

  return {
    title: `${category.name} · Blog`,
    description: category.description,
    alternates: { canonical: `/blog/category/${category.slug}` },
    openGraph: {
    ...ogDefaults,
      title: `${category.name} · The Blog`,
      description: category.description,
      url: `/blog/category/${category.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage(props: PageProps<"/blog/category/[category]">) {
  const { category: slug } = await props.params;
  const category = getCategory(slug);
  if (!category) notFound();

  const posts = getPostsByCategory(slug);
  const all = getCategoriesWithCounts();

  return (
    <>
      <PageHeader
        eyebrow={`Blog · ${posts.length} article${posts.length === 1 ? "" : "s"}`}
        title={category.name}
        lede={category.description}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: category.name },
        ]}
      />

      <Container width="wide" className="pb-24 sm:pb-32">
        <nav aria-label="Categories" className="flex flex-wrap gap-2 border-b border-line pb-6">
          <Link
            href="/blog"
            className="rounded-full border border-line px-3.5 py-1.5 text-[0.8125rem] text-ink-muted transition-colors hover:border-marigold hover:text-marigold"
          >
            All articles
          </Link>
          {all.map((c) => (
            <Link
              key={c.slug}
              href={`/blog/category/${c.slug}`}
              aria-current={c.slug === slug ? "page" : undefined}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-[0.8125rem] transition-colors",
                c.slug === slug
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink-muted hover:border-marigold hover:text-marigold"
              )}
            >
              {c.name}
              <span className="ml-1.5 opacity-60">{c.count}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-4 border-t border-line">
          {posts.map((post) => (
            <PostRow key={post.slug} post={post} />
          ))}
        </div>
      </Container>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: category.name, href: `/blog/category/${category.slug}` },
        ]}
      />
    </>
  );
}
