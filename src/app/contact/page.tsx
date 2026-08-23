import type { Metadata } from "next";

import { ClinicMap } from "@/components/contact/clinic-map";
import { WhatsAppIcon } from "@/components/motif/whatsapp-icon";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { clinics, contact, emergencyNote, outreachClinics, outreachNote, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ogDefaults } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Contact & appointments",
  description:
    "Book a paediatric endocrinology consultation in Kolkata with Dr. Sayan Banerjee at Neotia Bhagirathi Woman and Child Care Centre, New Town. Address, phone and appointment requests.",
  alternates: { canonical: "/contact" },
  openGraph: {
    ...ogDefaults,
    title: "Contact & appointments · Dr. Sayan Banerjee",
    description:
      "Clinic addresses, timings and appointment requests for paediatric endocrinology in Kolkata.",
    url: "/contact",
    type: "website",
  },
};

/**
 * Ordered by what the practice actually prefers, not by formality. WhatsApp
 * reaches Dr. Banerjee himself, so it leads; the hospital holds the diary, so
 * it is what actually books a slot; email is for the longer questions.
 */
const bookingRoutes = [
  {
    step: "01",
    title: "WhatsApp the doctor",
    body: "The preferred first contact, and it goes to Dr. Banerjee directly rather than to a front desk. Best for describing a concern, asking whether an appointment is the right next step, and sending a photograph of a report.",
    action: `Message ${contact.whatsappDisplay}`,
    href: contact.whatsappHref,
    highlight: true,
  },
  {
    step: "02",
    title: "Call the hospital",
    body: "The front desk holds the OPD diary, so this is the route that actually confirms a time. Ask for the paediatric endocrinology clinic.",
    action: `Call ${contact.phoneDisplay}`,
    href: contact.phoneHref,
    highlight: false,
  },
  {
    step: "03",
    title: "Book online, or write",
    body: "Neotia's own booking page lists available slots. For second opinions and questions about an existing plan, email works better than either.",
    action: "Hospital booking page",
    href: contact.bookingUrl,
    highlight: false,
  },
] as const;

const directLines = [
  { k: "WhatsApp", v: contact.whatsappDisplay, href: contact.whatsappHref },
  { k: "Hospital", v: contact.phoneDisplay, href: contact.phoneHref },
  { k: "Email", v: contact.email, href: contact.emailHref },
].filter((row): row is { k: string; v: string; href: string } => Boolean(row.v && row.href));

const askFor = [
  "Your child's name and age",
  "What you have noticed, and roughly how long it has been going on",
  "Anything already investigated, and by whom",
  "Which location suits you: New Town, one of the monthly OPD clinics, or a video consultation",
  "A phone number that will be answered",
] as const;

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Let&rsquo;s find
            <br />
            a time.
          </>
        }
        lede="Regular consultations run from Neotia Bhagirathi Woman and Child Care Centre in New Town, and monthly OPD clinics run at seven centres across West Bengal. Describe the concern when you get in touch, and you will be told what to bring with you."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      {/* ── 01 · Booking ─────────────────────────────────────── */}
      <section id="book" className="scroll-mt-28 py-16 sm:py-20">
        <Container width="wide">
          <SectionHead
            index="01"
            eyebrow="Request an appointment"
            title="Three ways to book."
            lede="Appointments are held in the hospital's diary, so the fastest route is always the hospital itself. Describe the concern when you get in touch and you will be told what to bring."
          />

          <RevealGroup
            as="ol"
            className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-3"
          >
            {bookingRoutes.map((route) =>
              route.href ? (
                <RevealItem
                  key={route.step}
                  as="li"
                  className={cn(
                    "flex flex-col p-7 sm:p-8",
                    route.highlight ? "bg-marigold-wash" : "bg-paper"
                  )}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="label text-marigold">{route.step}</span>
                    <h3 className="font-display flex items-center gap-2 text-lg leading-tight">
                      {route.highlight && <WhatsAppIcon className="size-[1.1rem] shrink-0 text-marigold" />}
                      {route.title}
                    </h3>
                  </div>
                  <p className="mt-4 flex-1 text-[0.9rem] leading-relaxed text-ink-muted">
                    {route.body}
                  </p>
                  <a
                    href={route.href}
                    {...(route.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="link-underline mt-5 inline-block w-fit text-[0.95rem] break-all text-marigold"
                  >
                    {route.action}
                  </a>
                </RevealItem>
              ) : null
            )}
          </RevealGroup>

          {/* Direct lines, as one compact row rather than a tall list in a
              narrow column. The mobile number appears nowhere else. */}
          <Reveal className="mt-8 flex flex-wrap items-baseline gap-x-10 gap-y-3 rounded-2xl border border-line bg-paper-raised px-7 py-5">
            <span className="label text-marigold">Direct lines</span>
            {directLines.map((row) => (
              <span key={row.k} className="flex items-baseline gap-3">
                <span className="label">{row.k}</span>
                <a
                  href={row.href}
                  className="link-underline text-[0.95rem] break-all text-ink"
                >
                  {row.v}
                </a>
              </span>
            ))}
          </Reveal>

          <Reveal className="mt-8 rounded-2xl border border-line p-7 sm:p-8">
            <h3 className="label">What to say when you get in touch</h3>
            <ul className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2">
              {askFor.map((item) => (
                <li
                  key={item}
                  className="flex items-baseline gap-3 text-[0.9rem] leading-snug text-ink-muted"
                >
                  <span aria-hidden="true" className="mt-2 block h-px w-2.5 shrink-0 bg-marigold" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-ink-faint">
              Enquiries are answered during working hours. This is not a channel for emergencies.
              If your child is seriously unwell, go to the nearest emergency department.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── 02 · Where to come ───────────────────────────────── */}
      <section className="border-y border-line bg-paper-raised py-16 sm:py-20">
        <Container width="wide">
          <SectionHead
            index="02"
            eyebrow="Where to come"
            title="The New Town clinic."
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-10">
            {clinics.map((clinic) => (
              <Reveal key={clinic.id} className="flex">
                <article className="flex w-full flex-col rounded-2xl border border-line bg-paper p-7 sm:p-8">
                  <h3 className="font-display text-xl leading-tight">{clinic.name}</h3>
                  <address className="mt-4 text-[0.92rem] leading-relaxed text-ink-muted not-italic">
                    {clinic.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                    <span className="block">{clinic.area}</span>
                  </address>

                  <dl className="mt-5 space-y-1.5 border-t border-line pt-5 text-[0.9rem]">
                    <div className="flex gap-3">
                      <dt className="label w-16 shrink-0">Days</dt>
                      <dd className="text-ink">{clinic.days}</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="label w-16 shrink-0">Hours</dt>
                      <dd className="text-marigold">{clinic.hours}</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="label w-16 shrink-0">Phone</dt>
                      <dd>
                        <a href={clinic.phoneHref} className="link-underline text-ink">
                          {clinic.phoneDisplay}
                        </a>
                      </dd>
                    </div>
                  </dl>

                  {clinic.note && (
                    <p className="mt-5 text-[0.85rem] leading-relaxed text-ink-faint">
                      {clinic.note}
                    </p>
                  )}

                  <p className="mt-auto pt-6 text-[0.875rem] leading-relaxed text-ink-faint">
                    Reviews and directions live on the{" "}
                    <a
                      href={contact.googleProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline text-marigold"
                    >
                      Google profile
                    </a>
                    .
                  </p>
                </article>
              </Reveal>
            ))}

            {clinics[0]?.geo && (
              <Reveal delay={0.06} className="flex">
                <ClinicMap clinic={clinics[0]} className="w-full bg-paper" />
              </Reveal>
            )}
          </div>
        </Container>
      </section>

      {/* ── 03 · Outreach ────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <Container width="wide">
          <SectionHead
            index="03"
            eyebrow="Across West Bengal"
            title="Monthly OPD clinics."
            lede={outreachNote}
          />

          <RevealGroup
            as="ul"
            className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
          >
            {outreachClinics.map((clinic) => (
              <RevealItem key={clinic.town} as="li" className="bg-paper p-6">
                <span className="font-display text-lg">{clinic.town}</span>
                <p className="mt-1 text-[0.87rem] leading-snug text-ink-muted">{clinic.centre}</p>
                <a
                  href={clinic.phoneHref}
                  className="link-underline mt-3 inline-block font-mono text-[0.8rem] text-ink"
                >
                  <span className="sr-only">
                    Call {clinic.centre} in {clinic.town}:{" "}
                  </span>
                  {clinic.phoneDisplay}
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <Container width="wide" className="pb-24 sm:pb-32">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {/* ── 04 · Before the visit, and the emergency note ─── */}
          <Reveal className="flex">
            <div className="flex w-full flex-col rounded-2xl border border-line p-7 sm:p-8">
              <h2 className="font-display text-xl">Before your first visit</h2>
              <p className="mt-4 text-[0.92rem] leading-relaxed text-ink-muted">
                Bring every height and weight ever recorded for your child, all previous reports
                in date order, current medicines in their boxes, and both parents&rsquo; heights.
                The full checklist is on the{" "}
                <a href="/visit" className="link-underline text-marigold">
                  Your Visit
                </a>{" "}
                page.
              </p>
              <p className="mt-auto pt-6 font-deva text-lg text-marigold">{site.sanskrit.text}</p>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="flex">
            <div className="flex w-full flex-col rounded-2xl border border-marigold/30 bg-marigold-wash/50 p-7 sm:p-8">
              <p className="label text-marigold">In an emergency</p>
              <p className="mt-4 text-[0.92rem] leading-relaxed text-ink-muted">{emergencyNote}</p>
            </div>
          </Reveal>
        </div>
      </Container>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />
    </>
  );
}
