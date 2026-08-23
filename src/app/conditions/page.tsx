import type { Metadata } from "next";
import Link from "next/link";

import { BookingBand } from "@/components/home/booking-band";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { conditionGroups } from "@/lib/site";
import { ogDefaults } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Conditions treated",
  description:
    "Growth and short stature, type 1 and type 2 diabetes, thyroid disease, early and delayed puberty, obesity, rickets, adrenal and pituitary disorders. The full range of paediatric endocrine conditions treated in Kolkata.",
  alternates: { canonical: "/conditions" },
  openGraph: {
    ...ogDefaults,
    title: "Conditions treated · Dr. Sayan Banerjee",
    description:
      "The full range of childhood and adolescent endocrine conditions seen at the clinic, grouped and explained.",
    url: "/conditions",
    type: "website",
  },
};

const faqs = [
  {
    q: "Which conditions does a paediatric endocrinologist treat?",
    a: "Hormone-related conditions in children and adolescents: growth and short stature, type 1 and type 2 diabetes, thyroid disease, early and delayed puberty, obesity and metabolic disease, rickets and calcium disorders, adrenal and pituitary conditions, and differences of sex development.",
  },
  {
    q: "Do I need a referral to see a paediatric endocrinologist?",
    a: "No. Families can book directly. That said, bringing a summary from your paediatrician, along with all previous reports and growth records, makes the first consultation considerably more useful.",
  },
  {
    q: "At what age should a child be seen for short stature?",
    a: "At any age where growth is a concern, but particularly if the growth rate is under about 4 to 5 centimetres a year in a school-aged child, if the child is crossing downwards through centile bands, or if height is well below the range predicted by the parents' heights.",
  },
  {
    q: "Is early puberty urgent?",
    a: "Pubertal signs in a girl under eight or a boy under nine should be assessed without long delay. Early puberty is easier to manage before the growth plates have advanced, so a few months can matter.",
  },
];

export default function ConditionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Conditions treated"
        title={
          <>
            An index of
            <br />
            the endocrine
            <br />
            childhood.
          </>
        }
        lede="Eight groups, roughly fifty conditions. Some are common enough to see weekly; some arrive once a year. If what brings you here is not listed, it is still worth asking, because much of this speciality begins as a question nobody has answered yet."
        crumbs={[{ label: "Home", href: "/" }, { label: "Conditions" }]}
      />

      <Container width="wide" className="pb-8">
        {/* Quick jump index; this page is long by design. */}
        <Reveal>
          <nav aria-label="Jump to a group" className="flex flex-wrap gap-2 pb-4">
            {conditionGroups.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="rounded-full border border-line px-3.5 py-1.5 text-[0.8125rem] text-ink-muted transition-colors hover:border-marigold hover:text-marigold"
              >
                <span className="mr-2 text-marigold">{group.index}</span>
                {group.title}
              </a>
            ))}
          </nav>
        </Reveal>
      </Container>

      <Container width="wide" className="pb-24 sm:pb-32">
        <div className="border-t border-line">
          {conditionGroups.map((group) => (
            <Reveal key={group.id} className="scroll-mt-28 border-b border-line py-14" as="section">
              <div id={group.id} className="grid gap-x-12 gap-y-8 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <span className="label text-marigold">{group.index}</span>
                  <h2 className="font-display mt-4 text-(length:--text-title) leading-[1.05]">
                    {group.title}
                  </h2>
                  <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-ink-muted">
                    {group.blurb}
                  </p>
                </div>

                <RevealGroup
                  as="ul"
                  stagger={0.04}
                  className="grid gap-x-10 border-t border-line sm:grid-cols-2 lg:col-span-7 lg:border-t-0"
                >
                  {group.items.map((item) => (
                    <RevealItem
                      key={item}
                      as="li"
                      y={8}
                      className="flex items-baseline gap-3 border-b border-line-soft py-3 text-[0.92rem] text-ink-muted"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 block h-px w-3 shrink-0 bg-marigold"
                      />
                      {item}
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── FAQ ────────────────────────────────────────────── */}
        <section aria-labelledby="faq-heading" className="pt-20">
          <Reveal>
            <div className="flex items-baseline gap-4">
              <span className="label text-marigold">FAQ</span>
              <span className="rule mt-auto mb-1.5 hidden flex-1 sm:block" />
            </div>
            <h2 id="faq-heading" className="font-display mt-5 text-(length:--text-display) leading-[1.02]">
              Asked often.
            </h2>
          </Reveal>

          <RevealGroup as="dl" className="mt-12 border-t border-line">
            {faqs.map((faq) => (
              <RevealItem key={faq.q} className="grid gap-x-12 gap-y-2 border-b border-line py-7 md:grid-cols-12">
                <dt className="font-display text-xl leading-snug md:col-span-5">{faq.q}</dt>
                <dd className="text-[0.95rem] leading-relaxed text-ink-muted md:col-span-7">
                  {faq.a}
                </dd>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-10">
            <p className="text-[0.95rem] text-ink-muted">
              More questions are answered at length in{" "}
              <Link href="/blog" className="link-underline text-marigold">
                the Blog
              </Link>
              , and practically in{" "}
              <Link href="/visit" className="link-underline text-marigold">
                Your Visit
              </Link>
              .
            </p>
          </Reveal>
        </section>
      </Container>

      <BookingBand />

      <FaqJsonLd items={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Conditions", href: "/conditions" },
        ]}
      />
    </>
  );
}
