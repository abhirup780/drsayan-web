/**
 * Types and taxonomy for the blog.
 *
 * Deliberately free of `node:fs` so that client components (search, filters,
 * cards) can share the same definitions as the server-side loader without
 * dragging the filesystem into the browser bundle.
 */

export const CATEGORIES = [
  {
    slug: "growth",
    name: "Growth & Height",
    description:
      "Centiles, growth charts, short stature and the long view on how children get taller.",
  },
  {
    slug: "diabetes",
    name: "Diabetes",
    description:
      "Living well with type 1 and type 2 diabetes in childhood: insulin, technology, school and sport.",
  },
  {
    slug: "thyroid",
    name: "Thyroid",
    description: "From newborn screening to the adolescent goitre, and everything in between.",
  },
  {
    slug: "puberty",
    name: "Puberty & Adolescence",
    description: "Early, late, and simply confusing, plus PCOS and adolescent hormone health.",
  },
  {
    slug: "bone-nutrition",
    name: "Bone & Nutrition",
    description: "Vitamin D, calcium, rickets and the everyday nutrition questions behind them.",
  },
  {
    slug: "parents",
    name: "For Parents",
    description:
      "Navigating tests, appointments, school and the emotional weight of a long-term condition.",
  },
] as const;

export type Category = (typeof CATEGORIES)[number];
export type CategorySlug = Category["slug"];

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  updated?: string;
  category: CategorySlug;
  tags: string[];
  hero?: string;
  heroAlt?: string;
  featured?: boolean;
  draft?: boolean;
};

export type Post = PostFrontmatter & {
  slug: string;
  content: string;
  readingTime: string;
  readingMinutes: number;
  wordCount: number;
};

export type PostSummary = Omit<Post, "content">;

/** Lightweight index shipped to the client for instant fuzzy search. */
export type SearchDoc = {
  slug: string;
  title: string;
  description: string;
  category: CategorySlug;
  categoryName: string;
  tags: string[];
  date: string;
  readingTime: string;
  excerpt: string;
};

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function tagSlug(tag: string) {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}
