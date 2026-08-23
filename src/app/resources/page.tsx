import type { Metadata } from "next";
import Link from "next/link";

import { ResourceShelf } from "@/components/home/resource-shelf";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { Cta } from "@/components/ui/cta";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { getCategoriesWithCounts } from "@/lib/blog";
import { contact, emergencyNote } from "@/lib/site";
import { ogDefaults } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Resources for parents",
  description:
    "Guides, checklists and templates for families: growth charts explained, preparing for hormone tests, a type 1 diabetes school plan, puberty timelines and vitamin D guidance.",
  alternates: { canonical: "/resources" },
  openGraph: {
    ...ogDefaults,
    title: "Resources for parents · Dr. Sayan Banerjee",
    description: "Guides, checklists and one-page templates for families under endocrine care.",
    url: "/resources",
    type: "website",
  },
};

const redFlags = [
  {
    t: "Go to an emergency department now",
    tone: "urgent" as const,
    items: [
      "Drowsiness, confusion or difficulty waking a child",
      "Rapid, deep breathing with vomiting in a child with diabetes",
      "A seizure, or a low blood sugar you cannot correct",
      "Severe dehydration, or a child who cannot keep fluids down",
      "Sudden severe headache with vomiting and visual change",
    ],
  },
  {
    t: "Call the clinic within a day or two",
    tone: "soon" as const,
    items: [
      "Blood sugars persistently high or low over several days",
      "A new lump in the neck, or difficulty swallowing",
      "Pubertal signs in a girl under 8 or a boy under 9",
      "A child on hydrocortisone who is unwell or vomiting",
      "Medicine finished, lost, or vomited repeatedly",
    ],
  },
  {
    t: "Raise it at the next appointment",
    tone: "routine" as const,
    items: [
      "Height that seems to have stalled over several months",
      "A new symptom that is stable and not distressing",
      "Questions about school, sport, exams or travel",
      "Anything you meant to ask last time and forgot",
    ],
  },
];

export default function ResourcesPage() {
  const categories = getCategoriesWithCounts();

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title={
          <>
            Things worth
            <br />
            having before
            <br />
            you need them.
          </>
        }
        lede="Written for the parent in the waiting room, the teacher who has just been handed a hypo box, and the fifteen-year-old who would rather read it themselves than be told."
        crumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]}
      />

      <ResourceShelf index="01" />

      {/* ── Red flags ────────────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <Container width="wide">
          <SectionHead
            index="02"
            eyebrow="When to call"
            title="Now, soon, or at the next visit."
            lede="The most useful thing a clinic can give a family is a clear sense of urgency. Print this and put it on the fridge."
          />

          <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-3">
            {redFlags.map((group) => (
              <RevealItem
                key={group.t}
                className={
                  group.tone === "urgent"
                    ? "bg-marigold-wash p-7 sm:p-8"
                    : "bg-paper p-7 sm:p-8"
                }
              >
                <h3
                  className={`font-display text-xl leading-tight ${
                    group.tone === "urgent" ? "text-marigold" : ""
                  }`}
                >
                  {group.t}
                </h3>
                <ul className="mt-5 flex flex-col gap-2.5 border-t border-line pt-5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-3 text-[0.9rem] leading-snug text-ink-muted"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 block h-px w-2.5 shrink-0 bg-marigold"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-10 rounded-2xl border border-marigold/30 bg-marigold-wash/50 p-6">
            <p className="label text-marigold">Please read</p>
            <p className="mt-2 max-w-3xl text-[0.95rem] leading-relaxed text-ink-muted">
              {emergencyNote}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── Browse the blog ───────────────────────────────── */}
      <section className="border-y border-line bg-paper-raised py-24 sm:py-32">
        <Container width="wide">
          <SectionHead
            index="03"
            eyebrow="Read further"
            title="The Blog, by subject."
            lede="Longer pieces on the questions that come up most often, grouped by the part of the body doing the asking."
          />

          <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <RevealItem key={category.slug} className="group bg-paper-raised">
                <Link
                  href={`/blog/category/${category.slug}`}
                  className="flex h-full flex-col p-7 transition-colors duration-500 hover:bg-paper sm:p-8"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-xl leading-tight transition-colors group-hover:text-marigold">
                      {category.name}
                    </h3>
                    <span className="label">{category.count}</span>
                  </div>
                  <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-muted">
                    {category.description}
                  </p>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-12 flex flex-wrap items-center gap-4">
            <Cta href="/blog" variant="outline">
              Search everything
            </Cta>
            <p className="text-sm text-ink-faint">
              Cannot find what you need?{" "}
              <a href={contact.emailHref} className="link-underline text-marigold">
                Write to the clinic
              </a>{" "}
              Most articles here started as somebody&rsquo;s email.
            </p>
          </Reveal>
        </Container>
      </section>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Resources", href: "/resources" },
        ]}
      />
    </>
  );
}
