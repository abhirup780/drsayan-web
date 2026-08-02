import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Cta } from "@/components/ui/cta";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { resources } from "@/lib/site";

export function ResourceShelf({ index = "07", limit }: { index?: string; limit?: number }) {
  const items = typeof limit === "number" ? resources.slice(0, limit) : resources;

  return (
    <section id="resources" className="scroll-mt-24 border-y border-line bg-paper-raised py-24 sm:py-32">
      <Container width="wide">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHead
            index={index}
            eyebrow="For parents"
            title="Things worth having before you need them."
            lede="Guides, checklists and one-page templates you can print, sign and hand to a school or a lab."
            className="max-w-2xl"
          />
          <Cta href="/resources" variant="outline" className="mb-2">
            The whole shelf
          </Cta>
        </div>

        <RevealGroup as="ul" className="mt-14 border-t border-line">
          {items.map((resource) => (
            <RevealItem key={resource.title} as="li" className="group border-b border-line">
              <Link
                href={resource.href}
                className="grid items-baseline gap-x-8 gap-y-2 py-6 md:grid-cols-12"
              >
                <span className="label md:col-span-2">{resource.kind}</span>

                <h3 className="font-display text-xl leading-snug transition-colors duration-300 group-hover:text-marigold md:col-span-4 md:text-2xl">
                  {resource.title}
                </h3>

                <p className="text-[0.9rem] leading-relaxed text-ink-muted md:col-span-5">
                  {resource.body}
                </p>

                <span
                  aria-hidden="true"
                  className="hidden text-marigold opacity-0 transition-all duration-300 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-1 group-hover:opacity-100 md:col-span-1 md:flex md:justify-end"
                >
                  <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
                  </svg>
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
