import type { Metadata } from "next";

import { HeightChecker } from "@/components/growth/height-checker";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { ogDefaults } from "@/lib/metadata";
import { emergencyNote } from "@/lib/site";

export const metadata: Metadata = {
  title: "Height check for children",
  description:
    "Check whether a child's height is in the expected range, using the WHO Child Growth Standards from birth to 5 years and the IAP 2015 Indian growth charts from 5 to 18. Instant, and nothing you type leaves your phone.",
  alternates: { canonical: "/growth-check" },
  openGraph: {
    ...ogDefaults,
    title: "Height check for children · Dr. Sayan Banerjee",
    description:
      "WHO and IAP growth references in one tool. Enter a date of birth and a height to see the centile.",
    url: "/growth-check",
    type: "website",
  },
};

const howTo = [
  {
    step: "01",
    title: "Measure properly",
    body: "Under 2, measure lying down: that is what the chart expects, and standing a toddler up reads about 0.7 cm short. From 2, measure standing, heels and back against a wall, shoes off, heels together, looking straight ahead.",
  },
  {
    step: "02",
    title: "Use the real dates",
    body: "Enter the date of birth rather than an age in years. A child's centile moves fast in the first two years, and rounding to the nearest birthday can shift the answer noticeably.",
  },
  {
    step: "03",
    title: "Read it as a prompt, not a verdict",
    body: "One height is a single dot. What a paediatric endocrinologist actually reads is the line those dots make over years, so keep the old records and measure again in six months.",
  },
];

const faqs = [
  {
    q: "Which growth charts does this use?",
    a: "Two, because no single chart covers all of childhood in India. From birth to 5 years it uses the WHO Child Growth Standards (2006), the international standard built from children raised in optimal conditions, including an Indian cohort. From 5 to 18 years it uses the IAP 2015 growth charts (Khadilkar et al, Indian Pediatrics 2015;52:47-55), the reference Indian paediatricians plot on. The tool tells you which one it used.",
  },
  {
    q: "What does the centile actually mean?",
    a: "If a child is on the 25th centile, then out of 100 children of the same age and sex, about 25 would be shorter and 75 taller. It is a position, not a score. Healthy children occupy the whole range, and a child on the 9th centile who has always been on the 9th centile is usually growing perfectly well.",
  },
  {
    q: "When is a height low enough to need review?",
    a: "The conventional cut-off is below the 3rd centile, which is 2 standard deviations under the median. Below the 0.1st centile (3 standard deviations) is further out again and worth reviewing without waiting. But the single most important signal is not the number at all: it is a child crossing downwards through the centile lines over time, and that needs previous measurements to see.",
  },
  {
    q: "Should I use this instead of seeing a doctor?",
    a: "No. This checks one measurement against a reference. It cannot examine your child, look at the growth trajectory, assess puberty, or order the tests that separate a normal short child from one with a treatable condition. Use it to decide whether to raise the subject, and take the number with you when you do.",
  },
  {
    q: "Is my child's information stored?",
    a: "No. Everything is calculated in your own browser. The date of birth, the height and the parents' heights are never sent to this website or anywhere else, and nothing is saved when you close the page.",
  },
];

export default function GrowthCheckPage() {
  return (
    <>
      <PageHeader
        eyebrow="Height check"
        title={
          <>
            Is my child
            <br />
            growing well?
          </>
        }
        lede="Enter a date of birth and a height. This plots it on the growth chart a paediatric endocrinologist would use, and tells you plainly whether it sits in the expected range."
        crumbs={[{ label: "Home", href: "/" }, { label: "Height check" }]}
      />

      <Container width="wide" className="pb-14 sm:pb-20">
        {/* The tool takes two thirds and an aside takes the rest. A form card
            stretched across a 92rem container gives 40rem-wide text inputs and
            a lonely button in an acre of nothing; this keeps the fields at a
            sane measure and puts the two facts a parent needs *while* typing
            right beside the boxes they are typing into. */}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-x-14">
          <Reveal className="lg:col-span-8">
            <HeightChecker />
          </Reveal>

          <Reveal delay={0.08} as="aside" className="lg:col-span-4">
            <p className="label text-marigold">Which chart</p>
            <h2 className="font-display mt-4 text-2xl leading-tight">
              Two references, one tool.
            </h2>
            <p className="mt-4 text-[0.92rem] leading-relaxed text-ink-muted">
              Birth to 5 years uses the WHO Child Growth Standards, built from children raised in
              optimal conditions across six countries, India among them. From 5 to 18 it uses the
              IAP 2015 charts, the reference Indian paediatricians actually plot on. The result
              names the one it used.
            </p>
            <p className="mt-4 text-[0.92rem] leading-relaxed text-ink-muted">
              Under 2, enter a lying-down length: that is what the chart expects, and standing a
              toddler against a wall reads about 0.7 cm short. From 2, measure standing.
            </p>
          </Reveal>
        </div>
      </Container>

      {/* ── How to measure ───────────────────────────────────── */}
      <section className="border-y border-line bg-paper-raised py-14 sm:py-20 lg:py-24">
        <Container width="wide">
          <SectionHead
            index="01"
            eyebrow="Before you measure"
            title="Three things that change the answer."
            lede="A growth chart is only as good as the measurement you put into it. These are the mistakes that most often send a healthy child to clinic, or keep an unwell one at home."
          />

          <RevealGroup
            as="ol"
            className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-3"
          >
            {howTo.map((item) => (
              <RevealItem key={item.step} as="li" className="bg-paper p-7 sm:p-8">
                <div className="flex items-baseline gap-4">
                  <span className="label text-marigold">{item.step}</span>
                  <h3 className="font-display text-lg leading-tight">{item.title}</h3>
                </div>
                <p className="mt-4 text-[0.9rem] leading-relaxed text-ink-muted">{item.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 lg:py-24">
        <Container width="wide">
          <SectionHead
            index="02"
            eyebrow="Questions"
            title="What this does, and what it cannot."
          />

          <RevealGroup as="dl" className="mt-12 divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <RevealItem key={f.q} className="grid gap-x-10 gap-y-3 py-7 lg:grid-cols-12">
                <dt className="font-display text-lg leading-snug lg:col-span-5">{f.q}</dt>
                <dd className="text-[0.92rem] leading-relaxed text-ink-muted lg:col-span-7">
                  {f.a}
                </dd>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-10 rounded-2xl border border-marigold/30 bg-marigold-wash/50 p-6">
            <p className="label text-marigold">In an emergency</p>
            <p className="mt-2 max-w-3xl text-[0.9rem] leading-relaxed text-ink-muted">
              {emergencyNote}
            </p>
          </Reveal>
        </Container>
      </section>

      <FaqJsonLd items={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Height check", href: "/growth-check" },
        ]}
      />
    </>
  );
}
