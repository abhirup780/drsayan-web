import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { stats } from "@/lib/site";

export function PracticeIntro() {
  return (
    <section id="practice" className="scroll-mt-24 py-24 sm:py-32">
      <Container width="wide">
        <SectionHead
          index="01"
          eyebrow="The practice"
          title={
            <>
              Endocrinology is the
              <br className="hidden sm:block" /> speciality of{" "}
              <span className="italic text-marigold">time</span>.
            </>
          }
          lede="Most of medicine asks what is wrong today. Hormones ask what has been happening for years, and what will happen for years more. That changes how a consultation should feel."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5" delay={0.05}>
            <div className="relative">
              <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-paper-sunk sm:aspect-square lg:aspect-4/5">
                <Image
                  src="/portraits/portrait-clinic.jpg"
                  alt="Dr. Sayan Banerjee at his consulting desk with a stethoscope, beside a window."
                  fill
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover"
                />
              </div>
              <p className="label mt-4">In the consulting room · Kolkata</p>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal className="space-y-6 text-base leading-relaxed text-ink-muted sm:text-lg">
              <p>
                A child who is not growing well has usually not been growing well for some time.
                The clue is rarely a single number. It is the{" "}
                <em className="not-italic text-ink">shape</em> of the line those numbers make. That
                is why the first thing I ask for is not a blood test but a history: every height
                you have ever recorded, on a wall, in a school diary, on the back of a report.
              </p>
              <p>
                My training was built around exactly this way of thinking. An MD in paediatric
                medicine at R. G. Kar in Kolkata, a fellowship in paediatric endocrinology at
                Regency CDER in Kanpur, then three years of DM at PGIMER Chandigarh. Rare
                conditions, complex ones, and the far more common worry that turns out, after
                careful work, to be entirely normal. Ruling something out properly is a result,
                not a wasted visit.
              </p>
              <p>
                In practice that means longer appointments, charts explained on screen rather than
                described, and a written plan you can carry to your paediatrician, your school and
                your family. Children are spoken to directly. Teenagers get their own time.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-9">
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 text-[0.95rem] text-ink"
              >
                <span className="link-underline">Read the full background</span>
                <svg
                  viewBox="0 0 16 16"
                  className="size-3.5 text-marigold transition-transform duration-300 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
                </svg>
              </Link>
            </Reveal>

            <RevealGroup
              as="dl"
              className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4"
            >
              {stats.map((stat) => (
                <RevealItem key={stat.label} className="bg-paper p-5">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="font-display block text-4xl leading-none">
                      {stat.value}
                      <span className="text-lg text-marigold">{stat.suffix}</span>
                    </span>
                    <span className="mt-3 block text-xs leading-snug text-ink-faint">
                      {stat.label}
                    </span>
                  </dd>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Container>
    </section>
  );
}
