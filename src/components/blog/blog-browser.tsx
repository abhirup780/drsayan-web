"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { PostRow } from "@/components/blog/post-card";
import { tagSlug, type SearchDoc } from "@/lib/blog-schema";
import { cn, tagHref } from "@/lib/utils";

type Category = { slug: string; name: string; count: number };
type Tag = { tag: string; slug: string; count: number };

/**
 * Client-side search, category filter and tag filter over a pre-built index.
 * The whole corpus is a handful of kilobytes, so results are instant and no
 * request leaves the browser — which also means no reader's health searches
 * are logged anywhere.
 */
export function BlogBrowser({
  docs,
  categories,
  tags,
  initialCategory,
  initialQuery,
}: {
  docs: SearchDoc[];
  categories: Category[];
  tags: Tag[];
  initialCategory?: string;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [category, setCategory] = useState<string | null>(initialCategory ?? null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();

  const deferredQuery = useDeferredValue(query);

  const fuse = useMemo(
    () =>
      new Fuse(docs, {
        keys: [
          { name: "title", weight: 3 },
          { name: "description", weight: 2 },
          { name: "tags", weight: 2 },
          { name: "categoryName", weight: 1 },
          { name: "excerpt", weight: 0.6 },
        ],
        threshold: 0.34,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [docs]
  );

  const results = useMemo(() => {
    let list = deferredQuery.trim().length > 1 ? fuse.search(deferredQuery).map((r) => r.item) : docs;
    if (category) list = list.filter((d) => d.category === category);
    if (activeTag) list = list.filter((d) => d.tags.some((t) => tagSlug(t) === activeTag));
    return list;
  }, [deferredQuery, fuse, docs, category, activeTag]);

  // "/" focuses search, Escape clears it — a small courtesy for regular readers.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && typing) {
        setQuery("");
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = Boolean(category || activeTag || query.trim());
  const visibleTags = showAllTags ? tags : tags.slice(0, 12);

  return (
    <div>
      {/* ── Controls ───────────────────────────────────────────── */}
      <div className="border-y border-line py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <label className="group relative flex w-full items-center gap-3 lg:max-w-md">
            <span className="sr-only">Search articles</span>
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="size-4 shrink-0 text-ink-faint transition-colors group-focus-within:text-marigold"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <circle cx="8.75" cy="8.75" r="5.75" />
              <path d="m13 13 4 4" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the Blog…"
              className="w-full bg-transparent py-1 text-[0.95rem] text-ink placeholder:text-ink-faint focus:outline-none"
            />
            <kbd className="label hidden shrink-0 rounded border border-line px-1.5 py-0.5 sm:block">
              /
            </kbd>
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <FilterChip active={category === null} onClick={() => setCategory(null)}>
              All
            </FilterChip>
            {categories.map((c) => (
              <FilterChip
                key={c.slug}
                active={category === c.slug}
                onClick={() => setCategory(category === c.slug ? null : c.slug)}
              >
                {c.name}
                <span className="ml-1.5 text-ink-faint">{c.count}</span>
              </FilterChip>
            ))}
          </div>
        </div>

        {/* ── Tags ─────────────────────────────────────────────── */}
        <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-line-soft pt-5">
          <span className="label mr-1">Tags</span>
          {visibleTags.map((t) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => setActiveTag(activeTag === t.slug ? null : t.slug)}
              aria-pressed={activeTag === t.slug}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[0.75rem] transition-colors",
                activeTag === t.slug
                  ? "border-marigold bg-marigold text-white dark:text-paper"
                  : "border-line text-ink-muted hover:border-marigold hover:text-marigold"
              )}
            >
              {t.tag}
            </button>
          ))}
          {tags.length > 12 && (
            <button
              type="button"
              onClick={() => setShowAllTags((v) => !v)}
              className="label ml-1 transition-colors hover:text-marigold"
            >
              {showAllTags ? "Fewer" : `+${tags.length - 12} more`}
            </button>
          )}
        </div>
      </div>

      {/* ── Result count ───────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-5">
        <p aria-live="polite" className="label">
          {results.length === 0
            ? "No articles match"
            : `${results.length} article${results.length === 1 ? "" : "s"}`}
          {filtered && " · filtered"}
        </p>
        {filtered && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory(null);
              setActiveTag(null);
            }}
            className="label transition-colors hover:text-marigold"
          >
            Clear all
          </button>
        )}
      </div>

      {/* ── Results ────────────────────────────────────────────── */}
      <div className="border-t border-line">
        <AnimatePresence mode="popLayout" initial={false}>
          {results.map((doc) => (
            <motion.div
              key={doc.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <PostRow
                post={{
                  slug: doc.slug,
                  title: doc.title,
                  description: doc.description,
                  date: doc.date,
                  category: doc.category,
                  tags: doc.tags,
                  readingTime: doc.readingTime,
                  readingMinutes: 0,
                  wordCount: 0,
                  featured: false,
                  draft: false,
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {results.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-display text-2xl">Nothing here yet.</p>
            <p className="mx-auto mt-3 max-w-md text-[0.95rem] text-ink-muted">
              Try a broader word like <em>growth</em>, <em>thyroid</em> or <em>puberty</em>, or{" "}
              <Link href="/contact" className="link-underline text-marigold">
                ask the clinic directly
              </Link>
              . Questions from parents are where most of these articles start.
            </p>
          </div>
        )}
      </div>

      {activeTag && (
        <p className="mt-8 text-sm text-ink-faint">
          Looking for a permanent link to this tag?{" "}
          <Link href={tagHref(activeTag)} className="link-underline text-marigold">
            Open the tag page
          </Link>
          .
        </p>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-[0.8125rem] transition-colors duration-300",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line text-ink-muted hover:border-marigold hover:text-marigold"
      )}
    >
      {children}
    </button>
  );
}
