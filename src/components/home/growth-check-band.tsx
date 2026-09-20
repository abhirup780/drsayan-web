import Link from "next/link";

import { HeightChecker } from "@/components/growth/height-checker";
import { GrowthCurve } from "@/components/motif/growth-curve";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const points = [
  "Height only, which is the measurement that matters most for growth",
  "Tells you which chart it used, and why",
];

/**
 * The height checker, sitting high on the landing page.
 *
 * This is the one thing the practice asks families to come back to, so it is
 * live on the page rather than behind a link: a parent who has to click
 * before they can see what the tool does mostly does not click.
 *
 * Layout note. The DOM order is headline → tool → supporting copy, which is
 * exactly how it should read on a phone: the tool arrives one thumb-flick
 * after the question it answers, not below two screens of preamble. On `lg`
 * the same three children are placed onto an explicit 2×2 grid so the left
 * column reads as one continuous block beside a tool that spans both rows.
 */
export function GrowthCheckBand() {
  return (
    <section
      id="height-check"
      className="grain relative isolate scroll-mt-24 overflow-hidden border-y border-line bg-paper-sunk py-14 sm:py-20 lg:py-24"
    >
      <GrowthCurve
        className="absolute inset-x-0 bottom-0 -z-10 h-2/3 w-full text-ink opacity-[0.07]
          [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_40%,black_92%)]"
        grid={false}
        highlightIndex={2}
      />

      <Container width="wide" className="relative">
        <div
          className="grid gap-8 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-16
            lg:gap-y-7"
        >
          {/* ── Headline ─────────────────────────────────────── */}
          <Reveal className="lg:col-span-5 lg:row-start-1 lg:self-start">
            {/* No index number: this is a tool sitting ahead of the numbered
                editorial run, not a step within it. */}
            <div className="flex items-center gap-2.5">
              <span aria-hidden="true" className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-marigold opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-marigold" />
              </span>
              <span className="label text-marigold">Height check</span>
            </div>

            <h2 className="font-display mt-5 text-(length:--text-display) leading-[0.98]">
              Is my child
              <br />
              growing <span className="italic text-marigold">well</span>?
            </h2>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-muted sm:mt-6 sm:text-lg">
              Enter a date of birth and a height. This plots it on the same chart a paediatric
              endocrinologist would use.
            </p>
          </Reveal>

          {/* ── The tool ─────────────────────────────────────── */}
          <Reveal delay={0.08} className="lg:col-span-7 lg:row-span-2 lg:row-start-1 lg:self-start">
            <HeightChecker compact />
          </Reveal>

          {/* ── Supporting copy ──────────────────────────────── */}
          <Reveal
            delay={0.04}
            className="lg:col-span-5 lg:row-start-2 lg:self-start"
          >
            <p className="max-w-lg text-[0.95rem] leading-relaxed text-ink-muted">
              It uses the WHO Child Growth Standards up to 5 years and the Indian IAP 2015 charts
              from 5 to 18, switching between them at the age each one is built for.
            </p>

            <ul className="mt-6 flex flex-col gap-3">
              {points.map((point) => (
                <li
                  key={point}
                  className="flex items-baseline gap-3 text-[0.92rem] leading-snug text-ink-muted"
                >
                  <span aria-hidden="true" className="mt-2 block h-px w-3 shrink-0 bg-marigold" />
                  {point}
                </li>
              ))}
            </ul>

            <Link
              href="/growth-check"
              className="link-underline mt-7 inline-block text-[0.95rem] text-marigold"
            >
              How to measure, and what the centile means
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
