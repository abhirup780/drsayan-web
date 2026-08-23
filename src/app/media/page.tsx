import type { Metadata } from "next";

import { VideoEmbed } from "@/components/media/video-embed";
import { BreadcrumbJsonLd, MediaJsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { Cta } from "@/components/ui/cta";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { contact, mediaAppearances } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { ogDefaults } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Media & press",
  description:
    "Talks and press appearances by Dr. Sayan Banerjee, paediatric endocrinologist: diabetes and diabetic ketoacidosis in children, and comment in The Telegraph and News18 Bengali on childhood growth and nutrition.",
  alternates: { canonical: "/media" },
  openGraph: {
    ...ogDefaults,
    title: "Media & press · Dr. Sayan Banerjee",
    description: "Talks on childhood diabetes, and press comment on growth and nutrition.",
    url: "/media",
    type: "website",
  },
};

const videos = mediaAppearances.filter((item) => item.kind === "video");
const press = mediaAppearances.filter((item) => item.kind === "press");

export default function MediaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Media & press"
        title={
          <>
            Said once,
            <br />
            carefully, and
            <br />
            written down.
          </>
        }
        lede="Talks recorded at the hospital, and the occasions a newspaper has asked for a paediatric endocrinologist's view. Every link here goes to the publisher, not to a copy of it."
        crumbs={[{ label: "Home", href: "/" }, { label: "Media" }]}
      />

      {/* ── Talks ────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <Container width="wide">
          <SectionHead
            index="01"
            eyebrow="Watch"
            title="Two talks on childhood diabetes."
            lede="Recorded for families rather than for colleagues. Nothing loads from YouTube until you press play."
          />

          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            {videos.map((item) => (
              <Reveal key={item.id}>
                <article>
                  <VideoEmbed
                    videoId={item.videoId!}
                    title={item.title}
                    poster={item.poster!}
                  />
                  <h3 className="font-display mt-6 text-2xl leading-tight">{item.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">{item.note}</p>
                  <p className="label mt-4 text-ink-faint">{item.outlet}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Press ────────────────────────────────────────────── */}
      <section className="border-y border-line bg-paper-raised py-20 sm:py-28">
        <Container width="wide">
          <SectionHead
            index="02"
            eyebrow="In the press"
            title="Asked, and answered."
            lede="Comment given to journalists covering childhood growth, nutrition and diabetes, in English and in Bengali."
          />

          <RevealGroup
            as="ul"
            className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line"
          >
            {press.map((item) => (
              <RevealItem key={item.id} as="li" className="group bg-paper-raised">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full flex-col p-7 transition-colors duration-500 hover:bg-paper sm:p-9"
                >
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    <span className="label text-marigold">{item.outlet}</span>
                    {item.lang === "bn" && (
                      <span className="label rounded-full border border-line px-2.5 py-0.5 text-ink-faint">
                        বাংলা
                      </span>
                    )}
                    <span className="rule mt-auto mb-1.5 hidden flex-1 sm:block" />
                    {item.date && (
                      <time dateTime={item.date} className="label text-ink-faint">
                        {formatDate(item.date)}
                      </time>
                    )}
                  </div>

                  <h3
                    lang={item.lang}
                    className="font-display mt-5 max-w-4xl text-xl leading-snug transition-colors group-hover:text-marigold sm:text-2xl"
                  >
                    {item.title}
                  </h3>

                  {item.quote && (
                    <blockquote
                      lang={item.lang}
                      className="mt-5 max-w-3xl border-l-2 border-marigold/40 pl-5 text-[0.95rem] leading-relaxed text-ink-muted italic"
                    >
                      &ldquo;{item.quote}&rdquo;
                    </blockquote>
                  )}

                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-faint">
                    <span className="link-underline text-marigold">Read at {item.outlet}</span>
                    {item.byline && <span>Reported by {item.byline}</span>}
                  </div>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-10 text-sm text-ink-faint">
            <p className="max-w-3xl leading-relaxed">
              Quotations above are reproduced from the published articles and belong to their
              publishers. Press enquiries are welcome at{" "}
              <a href={contact.emailHref} className="link-underline text-marigold">
                {contact.email}
              </a>
              .
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── Find the practice ───────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <Container width="wide">
          <SectionHead
            index="03"
            eyebrow="Elsewhere"
            title="Find the practice."
            lede="The Google listing carries the map pin, the directions and the reviews families have left themselves."
          />
          <Reveal className="mt-10 flex flex-wrap items-center gap-4">
            <Cta href={contact.googleProfileUrl} variant="outline">
              View the Google profile
            </Cta>
            <Cta href="/contact" variant="ghost">
              Book an appointment
            </Cta>
          </Reveal>
        </Container>
      </section>

      <MediaJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Media", href: "/media" },
        ]}
      />
    </>
  );
}
