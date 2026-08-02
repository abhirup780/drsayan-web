import "server-only";

import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import readingTime from "reading-time";

import {
  CATEGORIES,
  tagSlug,
  type CategorySlug,
  type Post,
  type PostFrontmatter,
  type PostSummary,
  type SearchDoc,
} from "./blog-schema";

/**
 * ── The Blog ──────────────────────────────────────────────────────
 *  Content lives as plain MDX files in /content/blog. To publish an
 *  article you add one file and commit it — no CMS login, no database.
 *  Frontmatter is validated loudly at build time so a typo can never
 *  ship as a silently broken page.
 *
 *  Taxonomy and types live in ./blog-schema so client components can
 *  share them without pulling `node:fs` into the browser bundle.
 */

export * from "./blog-schema";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[blog] ${message}`);
}

function readPost(fileName: string): Post {
  const slug = fileName.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(CONTENT_DIR, fileName), "utf8");
  const { data, content } = matter(raw);
  const fm = data as Partial<PostFrontmatter>;

  assert(typeof fm.title === "string" && fm.title.length > 0, `${fileName}: "title" is required`);
  assert(
    typeof fm.description === "string" && fm.description.length > 0,
    `${fileName}: "description" is required`
  );
  assert(
    typeof fm.date === "string" && !Number.isNaN(Date.parse(fm.date)),
    `${fileName}: "date" must be an ISO date (YYYY-MM-DD)`
  );
  assert(
    CATEGORIES.some((c) => c.slug === fm.category),
    `${fileName}: "category" must be one of ${CATEGORIES.map((c) => c.slug).join(", ")}`
  );

  const stats = readingTime(content);

  return {
    slug,
    title: fm.title,
    description: fm.description,
    date: fm.date,
    updated: fm.updated,
    category: fm.category as CategorySlug,
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    hero: fm.hero,
    heroAlt: fm.heroAlt,
    featured: fm.featured ?? false,
    draft: fm.draft ?? false,
    content,
    readingTime: `${Math.max(1, Math.round(stats.minutes))} min read`,
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
    wordCount: stats.words,
  };
}

let cache: Post[] | null = null;

function loadAll(): Post[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const posts = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(readPost)
    // Drafts are visible while writing locally, never in production.
    .filter((p) => !p.draft || process.env.NODE_ENV !== "production")
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

  cache = posts;
  return posts;
}

/** Drops the article body so listings never ship a whole essay they cannot show. */
function strip(post: Post): PostSummary {
  const summary: Partial<Post> = { ...post };
  delete summary.content;
  return summary as PostSummary;
}

export function getAllPosts(): PostSummary[] {
  return loadAll().map(strip);
}

export function getPost(slug: string): Post | undefined {
  return loadAll().find((p) => p.slug === slug);
}

export function getPostSlugs(): string[] {
  return loadAll().map((p) => p.slug);
}

export function getFeaturedPost(): PostSummary | undefined {
  const all = loadAll();
  const pick = all.find((p) => p.featured) ?? all[0];
  return pick ? strip(pick) : undefined;
}

export function getCategoriesWithCounts() {
  const all = loadAll();
  return CATEGORIES.map((category) => ({
    ...category,
    count: all.filter((p) => p.category === category.slug).length,
  })).filter((c) => c.count > 0);
}

export function getPostsByCategory(slug: string): PostSummary[] {
  return loadAll()
    .filter((p) => p.category === slug)
    .map(strip);
}

export function getAllTags(): { tag: string; slug: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of loadAll()) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, slug: tagSlug(tag), count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPostsByTag(slug: string): PostSummary[] {
  return loadAll()
    .filter((p) => p.tags.some((t) => tagSlug(t) === slug))
    .map(strip);
}

/**
 * Related articles, scored by shared tags then shared category. Deterministic,
 * so the same article always leads to the same neighbours.
 */
export function getRelatedPosts(slug: string, limit = 3): PostSummary[] {
  const current = getPost(slug);
  if (!current) return [];

  return loadAll()
    .filter((p) => p.slug !== slug)
    .map((p) => {
      const sharedTags = p.tags.filter((t) => current.tags.includes(t)).length;
      const sameCategory = p.category === current.category ? 1 : 0;
      return { post: p, score: sharedTags * 2 + sameCategory };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || Date.parse(b.post.date) - Date.parse(a.post.date))
    .slice(0, limit)
    .map((entry) => strip(entry.post));
}

export function getSearchIndex(): SearchDoc[] {
  return loadAll().map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    category: post.category,
    categoryName: CATEGORIES.find((c) => c.slug === post.category)?.name ?? post.category,
    tags: post.tags,
    date: post.date,
    readingTime: post.readingTime,
    // Enough plain text to make search meaningful without shipping the essay.
    excerpt: post.content
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/[#>*_`[\]()!-]/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 900),
  }));
}
