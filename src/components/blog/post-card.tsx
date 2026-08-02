import Link from "next/link";

import { getCategory, type PostSummary } from "@/lib/blog-schema";
import { cn, formatDateShort } from "@/lib/utils";

export function CategoryPill({ slug, className }: { slug: string; className?: string }) {
  const category = getCategory(slug);
  if (!category) return null;
  return (
    <span
      className={cn(
        "label rounded-full border border-line px-2.5 py-1 text-[0.6rem] text-ink-muted",
        className
      )}
    >
      {category.name}
    </span>
  );
}

/** Compact card, used in grids of three on the home page and in listings. */
export function PostCard({ post, priorityIndex }: { post: PostSummary; priorityIndex?: number }) {
  return (
    <article className="group relative flex h-full flex-col">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <span className="absolute inset-0 z-10" aria-hidden="true" />

        <div className="flex items-center gap-3">
          {typeof priorityIndex === "number" && (
            <span className="label text-marigold">
              {String(priorityIndex + 1).padStart(2, "0")}
            </span>
          )}
          <CategoryPill slug={post.category} />
        </div>

        <h3 className="font-display mt-5 text-2xl leading-[1.12] transition-colors duration-300 group-hover:text-marigold">
          {post.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-[0.9375rem] leading-relaxed text-ink-muted">
          {post.description}
        </p>

        <div className="mt-auto flex items-center gap-3 pt-6">
          <time dateTime={post.date} className="label">
            {formatDateShort(post.date)}
          </time>
          <span aria-hidden="true" className="h-px w-4 bg-line" />
          <span className="label">{post.readingTime}</span>
        </div>
      </Link>
    </article>
  );
}

/** Full-width editorial row, used for the main Blog listing. */
export function PostRow({ post }: { post: PostSummary }) {
  return (
    <article className="group relative border-b border-line">
      <Link
        href={`/blog/${post.slug}`}
        className="grid items-baseline gap-x-8 gap-y-3 py-8 md:grid-cols-12"
      >
        <div className="flex items-center gap-3 md:col-span-3">
          <time dateTime={post.date} className="label">
            {formatDateShort(post.date)}
          </time>
          <CategoryPill slug={post.category} />
        </div>

        <div className="md:col-span-7">
          <h3 className="font-display text-2xl leading-[1.12] transition-colors duration-300 group-hover:text-marigold sm:text-[1.7rem]">
            {post.title}
          </h3>
          <p className="mt-2.5 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-muted">
            {post.description}
          </p>
        </div>

        <div className="flex items-center gap-3 md:col-span-2 md:justify-end">
          <span className="label">{post.readingTime}</span>
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="size-3.5 shrink-0 text-marigold opacity-0 transition-all duration-300 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-1 group-hover:opacity-100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
          </svg>
        </div>
      </Link>
    </article>
  );
}
