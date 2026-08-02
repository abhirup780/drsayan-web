import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { clinics, outreachClinics, outreachNote } from "@/lib/site";

/**
 * The monthly circuit.
 *
 * A DM-trained paediatric endocrinologist is a scarce thing outside the metro,
 * and a family in Malda should not have to reach Kolkata to see one. This
 * section exists to make that findable: each town set at display size, each
 * host centre's own number one tap away.
 *
 * Laid out as an index rather than a card grid, so seven entries never leave
 * a ragged empty cell at the end of a row.
 */
export function OutreachClinics({ index = "06" }: { index?: string }) {
  return (
    <section id="outreach" className="scroll-mt-24 py-24 sm:py-32">
      <Container width="wide">
        <SectionHead
          index={index}
          eyebrow="Across West Bengal"
          title={
            <>
              Once a month,
              <br className="hidden sm:block" /> somewhere else in Bengal.
            </>
          }
          lede="Paediatric endocrinology is thin on the ground outside the metro, and a growth problem does not wait for a family to be able to reach Kolkata. So the clinic travels: seven visiting OPDs, every month, at centres that already know their own patients."
        />

        <RevealGroup as="ul" stagger={0.05} className="mt-16 border-t border-line">
          {outreachClinics.map((clinic) => (
            <RevealItem key={clinic.town} as="li" className="group border-b border-line">
              <div className="grid items-baseline gap-x-8 gap-y-1 py-6 md:grid-cols-12">
                <h3 className="flex items-center gap-3 md:col-span-3">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="size-4 shrink-0 text-line transition-colors duration-500 group-hover:text-marigold"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
                    <circle cx="12" cy="10" r="2.4" />
                  </svg>
                  <span className="font-display text-2xl leading-none">{clinic.town}</span>
                </h3>

                <p className="text-[0.95rem] leading-snug text-ink-muted md:col-span-6">
                  {clinic.centre}
                </p>

                <a
                  href={clinic.phoneHref}
                  className="inline-flex w-fit items-center gap-2 font-mono text-[0.82rem] tracking-tight text-ink transition-colors hover:text-marigold md:col-span-3 md:justify-self-end"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-marigold"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 12l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 6.2 2 2 0 0 1 5 4h1.5Z" />
                  </svg>
                  <span className="sr-only">
                    Call {clinic.centre} in {clinic.town} to book:{" "}
                  </span>
                  {clinic.phoneDisplay}
                </a>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-xl text-[0.92rem] leading-relaxed text-ink-muted">
            <span className="text-marigold">Please note.</span>{" "}
            {outreachNote}{" "}
            Each number above belongs to the host centre, which keeps that clinic&rsquo;s diary.
          </p>
          <p className="max-w-xs text-[0.92rem] leading-relaxed text-ink-faint">
            Regular consultations run from{" "}
            <Link href="/contact" className="link-underline text-ink">
              {clinics[0].name}
            </Link>
            .
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
