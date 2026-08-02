import Link from "next/link";

import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";
type Size = "sm" | "md";

const base =
  "group relative inline-flex items-center justify-center gap-2.5 rounded-full font-medium transition-all duration-300 [transition-timing-function:var(--ease-out-expo)] whitespace-nowrap";

const variants: Record<Variant, string> = {
  solid:
    "bg-ink text-paper hover:bg-marigold hover:text-white dark:hover:text-ink shadow-[0_1px_0_rgba(255,255,255,0.12)_inset]",
  outline: "border border-line text-ink hover:border-marigold hover:text-marigold",
  ghost: "text-ink-muted hover:text-marigold",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.8125rem]",
  md: "h-12 px-6 text-[0.9375rem]",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
  withArrow?: boolean;
  "aria-label"?: string;
};

export function Cta({
  href,
  children,
  variant = "solid",
  size = "md",
  className,
  external,
  withArrow = true,
  ...rest
}: Props) {
  const content = (
    <>
      <span>{children}</span>
      {withArrow && (
        <svg
          viewBox="0 0 16 16"
          className="size-3.5 shrink-0 transition-transform duration-300 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-1"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
        </svg>
      )}
    </>
  );

  const classes = cn(base, variants[variant], sizes[size], className);

  if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={classes}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}
