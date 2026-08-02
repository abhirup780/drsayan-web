import type { Metadata } from "next";

import { AppointmentForm } from "@/components/contact/appointment-form";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { clinics, contact, emergencyNote, outreachClinics, outreachNote, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & appointments",
  description:
    "Book a paediatric endocrinology consultation in Kolkata with Dr. Sayan Banerjee at Neotia Bhagirathi Woman and Child Care Centre, New Town. Address, phone and appointment requests.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact & appointments · Dr. Sayan Banerjee",
    description:
      "Clinic addresses, timings and appointment requests for paediatric endocrinology in Kolkata.",
    url: "/contact",
    type: "website",
  },
};

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

      <Container width="wide" className="pb-24 sm:pb-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ── Direct channels & clinics ──────────────────────── */}
          <div className="lg:col-span-5">
            <Reveal>
              <h2 className="label">Reach the clinic directly</h2>
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {[
                  { k: "Hospital", v: contact.phoneDisplay, href: contact.phoneHref },
                  { k: "Mobile", v: contact.mobileDisplay, href: contact.mobileHref },
                  { k: "Email", v: contact.email, href: contact.emailHref },
                  { k: "Book online", v: "Hospital website", href: contact.bookingUrl },
                ].map((row) => (
                  <li key={row.k} className="flex items-baseline justify-between gap-6 py-4">
                    <span className="label">{row.k}</span>
                    <a
                      href={row.href}
                      {...(row.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="link-underline text-right text-[0.95rem] text-ink"
                    >
                      {row.v}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.06} className="mt-12">
              <h2 className="label">Where to come</h2>
              <div className="mt-5 space-y-8">
                {clinics.map((clinic) => (
                  <article key={clinic.id} className="rounded-2xl border border-line p-6">
                    <h3 className="font-display text-xl leading-tight">{clinic.name}</h3>
                    <address className="mt-3 text-[0.92rem] leading-relaxed text-ink-muted not-italic">
                      {clinic.addressLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                      <span className="block">{clinic.area}</span>
                    </address>

                    <dl className="mt-4 space-y-1.5 text-[0.9rem]">
                      <div className="flex gap-3">
                        <dt className="label w-16 shrink-0">Days</dt>
                        <dd className="text-ink">{clinic.days}</dd>
                      </div>
                      <div className="flex gap-3">
                        <dt className="label w-16 shrink-0">Hours</dt>
                        <dd className="text-marigold">{clinic.hours}</dd>
                      </div>
                    </dl>

                    {clinic.note && (
                      <p className="mt-4 text-[0.85rem] leading-relaxed text-ink-faint">
                        {clinic.note}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-4">
                      <a
                        href={clinic.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline text-[0.875rem] text-ink"
                      >
                        Open in Maps
                      </a>
                      <a
                        href={clinic.phoneHref}
                        className="link-underline text-[0.875rem] text-ink-muted"
                      >
                        {clinic.phoneDisplay}
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.08} className="mt-12">
              <h2 className="label">Monthly OPD clinics across West Bengal</h2>
              <p className="mt-4 text-[0.9rem] leading-relaxed text-ink-muted">{outreachNote}</p>

              <ul className="mt-5 divide-y divide-line border-y border-line">
                {outreachClinics.map((clinic) => (
                  <li key={clinic.town} className="py-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <span className="font-display text-lg">{clinic.town}</span>
                      <a
                        href={clinic.phoneHref}
                        className="link-underline font-mono text-[0.8rem] text-ink"
                      >
                        <span className="sr-only">
                          Call {clinic.centre} in {clinic.town}:{" "}
                        </span>
                        {clinic.phoneDisplay}
                      </a>
                    </div>
                    <p className="mt-1 text-[0.87rem] text-ink-muted">{clinic.centre}</p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1} className="mt-10 rounded-2xl border border-marigold/30 bg-marigold-wash/50 p-6">
              <p className="label text-marigold">In an emergency</p>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-muted">{emergencyNote}</p>
            </Reveal>
          </div>

          {/* ── Form ───────────────────────────────────────────── */}
          <div id="book" className="scroll-mt-28 lg:col-span-7">
            <Reveal delay={0.04}>
              <AppointmentForm />
            </Reveal>

            <Reveal delay={0.08} className="mt-10">
              <div className="rounded-2xl border border-line p-7">
                <h2 className="font-display text-xl">Before your first visit</h2>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-muted">
                  Bring every height and weight ever recorded for your child, all previous
                  reports in date order, current medicines in their boxes, and both parents&rsquo;
                  heights. The full checklist is on the{" "}
                  <a href="/visit" className="link-underline text-marigold">
                    Your Visit
                  </a>{" "}
                  page.
                </p>
                <p className="mt-6 font-deva text-lg text-marigold">{site.sanskrit.text}</p>
              </div>
            </Reveal>
          </div>
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
