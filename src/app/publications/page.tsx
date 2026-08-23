import type { Metadata } from "next";

import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { publicationStats, publicationsByYear, type Publication } from "@/lib/publications";
import { contact } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ogDefaults } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Publications",
  description:
    "Peer-reviewed publications by Dr. Sayan Banerjee in paediatric endocrinology: congenital adrenal hyperplasia, type 1 diabetes, Turner syndrome, precocious puberty, metabolic bone disease and monogenic disorders.",
  alternates: { canonical: "/publications" },
  openGraph: {
    ...ogDefaults,
    title: "Publications · Dr. Sayan Banerjee",
    description: "Peer-reviewed research in paediatric endocrinology.",
    url: "/publications",
    type: "website",
  },
};

/**
 * Bolds Dr. Banerjee's name wherever it appears in an author list.
 *
 * Author strings are written as the journals print them, which means several
 * forms of the same name. Splitting on a capture group keeps the delimiters,
 * so the rest of the list survives intact.
 */
function AuthorList({ authors }: { authors: string }) {
  const parts = authors.split(/(Banerjee,? S(?:ayan)?\b\.?)/g);

  return (
    <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-muted">
      {parts.map((part, i) =>
        /^Banerjee/.test(part) ? (
          <strong key={i} className="font-semibold text-ink">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}

/**
 * One paper.
 *
 * Where a DOI exists the whole card is the link, so the entire block is a
 * single large target rather than a line of small text at the bottom. That
 * means the DOI itself must render as plain text here — an anchor inside an
 * anchor is invalid HTML and browsers silently unnest it.
 *
 * The two papers with no DOI on record render as a plain card. A card that
 * looks clickable and is not would be worse than one that never claimed to be.
 */
function PublicationCard({ item }: { item: Publication }) {
  const body = (
    <>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h3
          className={cn(
            "font-display max-w-4xl flex-1 text-lg leading-snug sm:text-xl",
            item.doi && "transition-colors group-hover:text-marigold"
          )}
        >
          {item.title}
        </h3>
        {item.first && (
          <span className="label rounded-full border border-marigold/40 px-2.5 py-0.5 text-marigold">
            First author
          </span>
        )}
      </div>

      <AuthorList authors={item.authors} />

      <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-t border-line pt-4 text-[0.85rem]">
        <span className="text-ink italic">{item.journal}</span>
        <span className="font-mono text-[0.78rem] text-ink-faint">{item.detail}</span>
        {item.doi ? (
          // The site's underline-grows-on-hover language, driven by the card
          // rather than by hovering this small span specifically.
          <span className="link-underline ml-auto font-mono text-[0.78rem] break-all text-marigold group-hover:bg-[length:100%_1px]">
            doi:{item.doi}
          </span>
        ) : (
          <span className="ml-auto font-mono text-[0.78rem] text-ink-faint">No DOI on record</span>
        )}
      </div>
    </>
  );

  if (!item.doi) {
    return <div className="p-7 sm:p-8">{body}</div>;
  }

  return (
    <a
      href={`https://doi.org/${item.doi}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-7 transition-colors duration-500 hover:bg-paper-raised sm:p-8"
    >
      {body}
    </a>
  );
}

export default function PublicationsPage() {
  const grouped = publicationsByYear();

  const stats = [
    { value: String(publicationStats.total), label: "Peer-reviewed papers" },
    { value: String(publicationStats.firstAuthor), label: "As first author" },
    { value: String(publicationStats.journals), label: "Journals" },
    {
      value: `${publicationStats.earliest}–${String(publicationStats.latest).slice(2)}`,
      label: "Years in print",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Publications"
        title={
          <>
            The questions
            <br />
            worth writing
            <br />
            down.
          </>
        }
        lede="Peer-reviewed work in paediatric endocrinology, most of it from the super-speciality unit at PGIMER Chandigarh. Rare disease is where the literature is thinnest, which is precisely why these case series get written."
        crumbs={[{ label: "Home", href: "/" }, { label: "Publications" }]}
      />

      {/* ── Numbers ──────────────────────────────────────────── */}
      <section className="border-y border-line bg-paper-raised py-12 sm:py-14">
        <Container width="wide">
          <RevealGroup as="dl" className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <RevealItem key={stat.label}>
                <dt className="label">{stat.label}</dt>
                <dd className="font-display mt-2 text-4xl text-marigold sm:text-5xl">
                  {stat.value}
                </dd>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* ── The list ─────────────────────────────────────────── */}
      <Container width="wide" className="py-16 sm:py-20">
        <div className="flex flex-col gap-16">
          {grouped.map((group) => (
            <section key={group.year}>
              <Reveal className="flex items-baseline gap-5">
                <h2 className="font-display text-3xl text-marigold sm:text-4xl">{group.year}</h2>
                <span className="rule mt-auto mb-2 hidden flex-1 sm:block" />
                <span className="label">
                  {group.items.length} {group.items.length === 1 ? "paper" : "papers"}
                </span>
              </Reveal>

              <RevealGroup
                as="ol"
                className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line"
              >
                {group.items.map((item) => (
                  <RevealItem key={item.title} as="li" className="group bg-paper">
                    <PublicationCard item={item} />
                  </RevealItem>
                ))}
              </RevealGroup>
            </section>
          ))}
        </div>

        <Reveal className="mt-14 rounded-2xl border border-line bg-paper-raised p-7">
          <p className="label">A note on this list</p>
          <p className="mt-3 max-w-3xl text-[0.9rem] leading-relaxed text-ink-muted">
            Every entry links to its DOI, the permanent identifier for the paper, rather than to a
            publisher&rsquo;s page that may move. Where a paper is behind a paywall, write to Dr.
            Banerjee at{" "}
            <a href={contact.emailHref} className="link-underline text-marigold">
              {contact.email}
            </a>{" "}
            and he will usually send a copy for personal or academic use.
          </p>
        </Reveal>
      </Container>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Publications", href: "/publications" },
        ]}
      />
    </>
  );
}
