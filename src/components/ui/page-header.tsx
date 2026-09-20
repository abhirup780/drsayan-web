import Link from "next/link";

import { CurveDivider } from "@/components/motif/growth-curve";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

type Crumb = { label: string; href?: string };

/**
 * The masthead every inner page shares. Consistent height, consistent
 * rhythm — so moving between pages feels like turning a page rather than
 * arriving somewhere new.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <header className="grain relative isolate overflow-hidden pt-28 pb-10 sm:pt-36 sm:pb-14">
      <Container width="wide" className="relative">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="label flex flex-wrap items-center gap-2">
              {crumbs.map((crumb, i) => (
                <li key={crumb.label} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true" className="text-line">/</span>}
                  {crumb.href ? (
                    <Link href={crumb.href} className="transition-colors hover:text-marigold">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-ink">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <Reveal>
          <p className="label text-marigold">{eyebrow}</p>
          <h1 className="font-display mt-5 max-w-4xl text-(length:--text-hero) leading-[0.92]">
            {title}
          </h1>
          {lede && (
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
              {lede}
            </p>
          )}
          {children}
        </Reveal>
      </Container>

      <Container width="wide">
        <CurveDivider className="mt-8 opacity-70 sm:mt-12" />
      </Container>
    </header>
  );
}
