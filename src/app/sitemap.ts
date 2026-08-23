import type { MetadataRoute } from "next";

import { getAllPosts, getAllTags, getCategoriesWithCounts } from "@/lib/blog";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = ([
    { url: "/", changeFrequency: "monthly", priority: 1 },
    { url: "/about", changeFrequency: "yearly", priority: 0.8 },
    { url: "/conditions", changeFrequency: "yearly", priority: 0.9 },
    { url: "/visit", changeFrequency: "yearly", priority: 0.8 },
    { url: "/resources", changeFrequency: "monthly", priority: 0.7 },
    { url: "/blog", changeFrequency: "weekly", priority: 0.9 },
    { url: "/publications", changeFrequency: "monthly", priority: 0.7 },
    { url: "/media", changeFrequency: "monthly", priority: 0.6 },
    { url: "/bn", changeFrequency: "monthly", priority: 0.8 },
    { url: "/contact", changeFrequency: "yearly", priority: 0.9 },
    { url: "/privacy", changeFrequency: "yearly", priority: 0.2 },
    { url: "/terms", changeFrequency: "yearly", priority: 0.2 },
  ] satisfies MetadataRoute.Sitemap).map((route) => ({
    ...route,
    url: `${site.url}${route.url}`,
    lastModified: now,
  }));

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const categories: MetadataRoute.Sitemap = getCategoriesWithCounts().map((category) => ({
    url: `${site.url}/blog/category/${category.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  // Single-article tags add little for crawlers; they are noindexed in the
  // page's own metadata and excluded here.
  const tags: MetadataRoute.Sitemap = getAllTags()
    .filter((tag) => tag.count > 1)
    .map((tag) => ({
      url: `${site.url}/blog/tag/${tag.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    }));

  return [...staticRoutes, ...posts, ...categories, ...tags];
}
