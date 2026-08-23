import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Callout } from "@/components/blog/callout";
import { MdxContent } from "@/components/blog/mdx-content";
import { CategoryPill, PostCard } from "@/components/blog/post-card";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { ShareRow } from "@/components/blog/share-row";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { Cta } from "@/components/ui/cta";
import {
  getCategory,
  getPost,
  getPostSlugs,
  getRelatedPosts,
  tagSlug,
} from "@/lib/blog";
import { contact, site } from "@/lib/site";
import { extractToc } from "@/lib/toc";
import { formatDate } from "@/lib/utils";
import { ogDefaults } from "@/lib/metadata";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};

  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
    ...ogDefaults,
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [site.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function ArticlePage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const category = getCategory(post.category);
  const toc = extractToc(post.content);
  const related = getRelatedPosts(post.slug);

  return (
    <>
      <article>
        {/* ── Article masthead ─────────────────────────────────── */}
        <header className="grain relative isolate overflow-hidden pt-28 pb-12 sm:pt-36">
          <Container width="text" className="relative">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="label flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/blog" className="transition-colors hover:text-marigold">
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true" className="text-line">/</li>
                <li>
                  <Link
                    href={`/blog/category/${post.category}`}
                    className="transition-colors hover:text-marigold"
                  >
                    {category?.name}
                  </Link>
                </li>
              </ol>
            </nav>

            <h1 className="font-display text-(length:--text-display) leading-[0.98]">
              {post.title}
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-ink-muted">{post.description}</p>

            <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-3 border-y border-line py-4">
              <CategoryPill slug={post.category} />
              <time dateTime={post.date} className="label">
                {formatDate(post.date)}
              </time>
              <span aria-hidden="true" className="h-px w-4 bg-line" />
              <span className="label">{post.readingTime}</span>
              {post.updated && (
                <span className="label text-marigold">
                  Revised {formatDate(post.updated)}
                </span>
              )}
            </div>
          </Container>
        </header>

        {/* ── Body ─────────────────────────────────────────────── */}
        <Container width="wide" className="pb-16">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <aside className="lg:col-span-3 lg:col-start-1">
              <div className="lg:sticky lg:top-28">
                <TableOfContents entries={toc} />
              </div>
            </aside>

            <div className="lg:col-span-8 lg:col-start-4 xl:col-span-7">
              <ReadingProgress minutes={post.readingMinutes}>
                <MdxContent source={post.content} />
              </ReadingProgress>

              {/* ── Tags ───────────────────────────────────────── */}
              {post.tags.length > 0 && (
                <div className="mt-14 flex max-w-[44rem] flex-wrap items-center gap-2 border-t border-line pt-8">
                  <span className="label mr-2">Filed under</span>
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${tagSlug(tag)}`}
                      className="rounded-full border border-line px-3 py-1 text-[0.78rem] text-ink-muted transition-colors hover:border-marigold hover:text-marigold"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-8 max-w-[44rem]">
                <ShareRow title={post.title} slug={post.slug} />
              </div>

              {/* ── Medical disclaimer ─────────────────────────── */}
              <div className="mt-10 max-w-[44rem]">
                <Callout type="warn" title="This is information, not advice">
                  <p>
                    Everything here is general and cannot account for your child. It is not a
                    substitute for an assessment by a doctor who has examined them. If something
                    in this article worries you, please book a consultation rather than acting on
                    it alone.
                  </p>
                </Callout>
              </div>

              {/* ── Author card ────────────────────────────────── */}
              <aside className="mt-12 flex max-w-[44rem] flex-col gap-6 rounded-2xl border border-line bg-paper-raised p-7 sm:flex-row sm:items-start sm:p-8">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-full bg-paper-sunk">
                  <Image
                    src="/portraits/portrait-hero.jpg"
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <p className="label">Written and reviewed by</p>
                  <p className="font-display mt-2 text-xl">{site.name}</p>
                  <p className="mt-1 text-[0.85rem] text-ink-faint">{site.qualifications}</p>
                  <p className="mt-4 text-[0.92rem] leading-relaxed text-ink-muted">
                    Paediatric and adolescent endocrinologist in {site.city}, trained at PGIMER
                    Chandigarh. Writes here about the questions parents actually ask.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Cta href="/contact#book" size="sm">
                      Book a consultation
                    </Cta>
                    <Cta href={contact.phoneHref} size="sm" variant="outline" withArrow={false}>
                      {contact.phoneDisplay}
                    </Cta>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </Container>
      </article>

      {/* ── Related ──────────────────────────────────────────── */}
      {related.length > 0 && (
        <section
          aria-labelledby="related-heading"
          className="border-t border-line bg-paper-raised py-14 sm:py-20 lg:py-24"
        >
          <Container width="wide">
            <div className="flex items-baseline gap-4">
              <span className="label text-marigold">Next</span>
              <span className="rule mt-auto mb-1.5 hidden flex-1 sm:block" />
            </div>
            <h2 id="related-heading" className="font-display mt-5 text-(length:--text-title)">
              Read next
            </h2>

            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
              {related.map((item, i) => (
                <div key={item.slug} className="bg-paper-raised p-7 sm:p-8">
                  <PostCard post={item} priorityIndex={i} />
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Cta href="/blog" variant="outline">
                Back to the Blog
              </Cta>
            </div>
          </Container>
        </section>
      )}

      <ArticleJsonLd
        title={post.title}
        description={post.description}
        slug={post.slug}
        date={post.date}
        updated={post.updated}
        image={post.hero}
        tags={post.tags}
        readingTime={`PT${post.readingMinutes}M`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: category?.name ?? "Article", href: `/blog/category/${post.category}` },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />
    </>
  );
}
