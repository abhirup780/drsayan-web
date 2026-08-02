"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type TocEntry = { id: string; text: string; depth: 2 | 3 };

/**
 * Sticky contents list that highlights the section currently being read.
 *
 * Uses a scroll listener rather than IntersectionObserver on purpose: the
 * active entry is "the last heading whose top has passed the reading line",
 * which stays correct even when a heading is jumped past, when a section is
 * taller than the viewport, or when the page opens at a deep anchor.
 */
export function TableOfContents({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (entries.length === 0) return;

    // The notional line across the viewport where reading happens.
    const READING_LINE = 140;

    const update = () => {
      const headings = entries
        .map((entry) => ({ id: entry.id, el: document.getElementById(entry.id) }))
        .filter((h): h is { id: string; el: HTMLElement } => h.el !== null);

      if (headings.length === 0) return;

      // At the very bottom of the page the last heading always wins, or a
      // short trailing section could never become active.
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;

      const passed = headings.filter((h) => h.el.getBoundingClientRect().top <= READING_LINE);
      const next = atBottom
        ? headings[headings.length - 1]
        : (passed[passed.length - 1] ?? headings[0]);

      setActiveId((prev) => (prev === next.id ? prev : next.id));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [entries]);

  if (entries.length < 3) return null;

  return (
    <nav aria-labelledby="toc-heading" className="hidden lg:block">
      <h2 id="toc-heading" className="label">
        Contents
      </h2>
      <ul className="mt-5 space-y-0.5 border-l border-line">
        {entries.map((entry) => {
          const active = entry.id === activeId;
          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "-ml-px block border-l py-1.5 text-[0.8125rem] leading-snug transition-colors duration-300",
                  entry.depth === 3 ? "pl-7" : "pl-4",
                  active
                    ? "border-marigold text-marigold"
                    : "border-transparent text-ink-faint hover:text-ink"
                )}
              >
                {entry.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
