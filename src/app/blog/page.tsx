import type { Metadata } from "next";
import Link from "next/link";

import { BlogBrowser } from "@/components/blog/blog-browser";
import { CategoryPill } from "@/components/blog/post-card";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import {
  getAllTags,
  getCategoriesWithCounts,
  getFeaturedPost,
  getSearchIndex,
} from "@/lib/blog";
import { formatDate } from "@/lib/utils";
import { ogDefaults } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "The Blog",
  description:
    "Long-form notes on childhood growth, diabetes, thyroid, puberty and bone health, written for parents by a paediatric endocrinologist in Kolkata.",
  alternates: { canonical: "/blog" },
  openGraph: {
    ...ogDefaults,
    title: "The Blog · Dr. Sayan Banerjee",
    description:
      "Long-form notes on childhood growth, diabetes, thyroid, puberty and bone health, written for parents.",
    url: "/blog",
    type: "website",
  },
};

export default async function BlogPage(props: PageProps<"/blog">) {
  const { q } = await props.searchParams;
  const docs = getSearchIndex();
  const categories = getCategoriesWithCounts();
  const tags = getAllTags();
  const featured = getFeaturedPost();

  return (
    <>
      <PageHeader
        eyebrow="The Blog"
        title={
          <>
            Notes written
            <br />
            between clinics.
          </>
        }
        lede="Everything here began as a question a parent asked in a consulting room. Articles are dated, revised when the evidence moves, and always written for the person holding the worry, not for other doctors."
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />

      <Container width="wide" className="pb-24 sm:pb-32">
        {featured && (
          <article className="group relative mb-16 grid gap-8 rounded-2xl border border-line bg-paper-raised p-8 sm:p-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="label text-marigold">Start here</span>
                <CategoryPill slug={featured.category} />
              </div>
              <h2 className="font-display mt-5 text-(length:--text-title) leading-[1.02]">
                <Link href={`/blog/${featured.slug}`}>
                  <span className="absolute inset-0" aria-hidden="true" />
                  <span className="transition-colors duration-300 group-hover:text-marigold">
                    {featured.title}
                  </span>
                </Link>
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
                {featured.description}
              </p>
            </div>
            <div className="label flex items-center gap-3 lg:col-span-4 lg:justify-end">
              <time dateTime={featured.date}>{formatDate(featured.date)}</time>
              <span aria-hidden="true" className="h-px w-4 bg-line" />
              <span>{featured.readingTime}</span>
            </div>
          </article>
        )}

        <BlogBrowser
          docs={docs}
          categories={categories}
          tags={tags}
          initialQuery={typeof q === "string" ? q : undefined}
        />
      </Container>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
        ]}
      />
    </>
  );
}
