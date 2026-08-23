import type { Metadata } from "next";
import Link from "next/link";

import { BookingBand } from "@/components/home/booking-band";
import { FirstVisit } from "@/components/home/first-visit";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { bringList, clinics, contact, outreachClinics, outreachNote } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ogDefaults } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Your visit",
  description:
    "What happens at a paediatric endocrinology consultation, what to bring, and how to prepare a child for measurement and tests.",
  alternates: { canonical: "/visit" },
  openGraph: {
    ...ogDefaults,
    title: "Your visit, Dr. Sayan Banerjee",
    description:
      "Exactly what happens at a paediatric endocrinology consultation, and how to prepare for it.",
    url: "/visit",
    type: "website",
  },
};

const faqs = [
  {
    q: "Where does Dr. Banerjee consult?",
    a: "At Neotia Bhagirathi Woman and Child Care Centre in New Town, Kolkata, in the Department of Paediatric Endocrinology. Appointments can be booked through the hospital by phone or online.",
  },
  {
    q: "Should my child be fasting?",
    a: "Not for an ordinary first consultation. Fasting is only needed for specific tests, and you will be told in advance and in writing if it applies.",
  },
  {
    q: "Will there be a blood test on the first day?",
    a: "Usually not. The first visit is history, measurement and examination. Tests are chosen afterwards, based on what those reveal, and explained before they are ordered.",
  },
  {
    q: "Do I need a referral?",
    a: "No. Families can book directly. Bringing a summary from your paediatrician, along with previous reports and growth records, makes the consultation considerably more useful.",
  },
  {
    q: "Do you provide a written summary?",
    a: "Always. Every visit ends with a written note covering what we think is happening, what is being done, what to watch for, and when to return, in a form you can share with your paediatrician or school.",
  },
];

export default function VisitPage() {
  return (
    <>
      <PageHeader
        eyebrow="Your visit"
        title={
          <>
            Come prepared.
            <br />
            Leave with a plan.
          </>
        }
        lede="Specialist appointments are stressful mostly because nobody tells you what is about to happen. So here is all of it, the sequence and the checklist, before you arrive."
        crumbs={[{ label: "Home", href: "/" }, { label: "Your Visit" }]}
      />

      <FirstVisit index="01" />

      {/* ── What to bring ────────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <Container width="wide">
          <SectionHead
            index="02"
            eyebrow="What to bring"
            title="Four things that change the consultation."
            lede="The first four items on this list are worth more to me than any test I could order on the day. The last three are for your sake."
          />

          <RevealGroup as="ul" className="mt-14 border-t border-line">
            {bringList.map((item, i) => (
              <RevealItem key={item.title} as="li" className="border-b border-line">
                <div className="grid items-baseline gap-x-10 gap-y-2 py-6 md:grid-cols-12">
                  <div className="flex items-center gap-4 md:col-span-1">
                    <span
                      className={cn(
                        "label",
                        item.essential ? "text-marigold" : "text-ink-faint"
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="font-display text-xl leading-snug md:col-span-5">
                    {item.title}
                    {item.essential && (
                      <span className="label ml-3 align-middle text-marigold">Essential</span>
                    )}
                  </h3>

                  <p className="text-[0.92rem] leading-relaxed text-ink-muted md:col-span-6">
                    {item.detail}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* ── Where to come ────────────────────────────────────── */}
      <section className="border-y border-line bg-paper-raised py-24 sm:py-32">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHead
                index="03"
                eyebrow="Where to come"
                title="Kolkata every week, and seven towns every month."
                lede="Regular consultations run from the Department of Paediatric Endocrinology at Neotia Bhagirathi Woman and Child Care Centre in New Town. If travelling to the city is difficult, the monthly OPD clinics may be closer to you."
              />
            </div>

            <RevealGroup className="lg:col-span-7">
              {clinics.map((clinic) => (
                <RevealItem key={clinic.id} className="rounded-2xl border border-line bg-paper p-7 sm:p-8">
                  <h3 className="font-display text-xl leading-snug">{clinic.name}</h3>
                  <address className="mt-4 text-[0.92rem] leading-relaxed text-ink-muted not-italic">
                    {clinic.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                    <span className="block">{clinic.area}</span>
                  </address>

                  <dl className="mt-5 space-y-2 border-t border-line pt-5 text-[0.9rem]">
                    <div className="flex gap-4">
                      <dt className="label w-24 shrink-0">Booking</dt>
                      <dd className="text-ink">{clinic.days}</dd>
                    </div>
                    <div className="flex gap-4">
                      <dt className="label w-24 shrink-0">Timings</dt>
                      <dd className="text-marigold">{clinic.hours}</dd>
                    </div>
                    <div className="flex gap-4">
                      <dt className="label w-24 shrink-0">Phone</dt>
                      <dd className="text-ink">
                        <a href={contact.phoneHref} className="link-underline">
                          {contact.phoneDisplay}
                        </a>
                      </dd>
                    </div>
                    {contact.whatsappHref && (
                      <div className="flex gap-4">
                        <dt className="label w-24 shrink-0">WhatsApp</dt>
                        <dd className="text-ink">
                          <a
                            href={contact.whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-underline"
                          >
                            {contact.whatsappDisplay}
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>

                  <div className="mt-6 flex flex-wrap gap-4">
                    <a
                      href={clinic.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline text-[0.875rem] text-ink"
                    >
                      Open in Maps
                    </a>
                    <a
                      href={contact.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline text-[0.875rem] text-marigold"
                    >
                      Book on the hospital website
                    </a>
                  </div>
                </RevealItem>
              ))}

              <RevealItem className="mt-6 rounded-2xl border border-line bg-paper p-7 sm:p-8">
                <h3 className="font-display text-xl leading-snug">
                  Monthly OPD clinics across West Bengal
                </h3>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-muted">{outreachNote}</p>

                <ul className="mt-5 divide-y divide-line-soft border-t border-line">
                  {outreachClinics.map((clinic) => (
                    <li
                      key={clinic.town}
                      className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3"
                    >
                      <span className="font-display text-lg">{clinic.town}</span>
                      <span className="mr-auto text-[0.87rem] text-ink-muted">{clinic.centre}</span>
                      <a
                        href={clinic.phoneHref}
                        className="link-underline font-mono text-[0.8rem] text-ink"
                      >
                        <span className="sr-only">
                          Call {clinic.centre} in {clinic.town}:{" "}
                        </span>
                        {clinic.phoneDisplay}
                      </a>
                    </li>
                  ))}
                </ul>
              </RevealItem>
            </RevealGroup>
          </div>
        </Container>
      </section>

      {/* ── Preparing a child ────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <Container width="wide">
          <SectionHead
            index="04"
            eyebrow="Preparing your child"
            title="Tell them the truth, in advance."
            lede="Children cope with unpleasant things far better than they cope with being surprised by them."
          />

          <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                t: "Say what will happen",
                d: "“The doctor will measure how tall you are, listen to your chest, and talk to us.” Specific beats vague, every time.",
              },
                {
                t: "Do not promise no needles",
                d: "If a test is likely, say it is possible. A promise broken in a clinic is remembered for years.",
              },
              {
                t: "Explain the measuring",
                d: "Shoes off, heels together, standing tall against a wall. Practising once at home turns an odd request into a familiar game.",
              },
              {
                t: "Let them ask me things",
                d: "Children are welcome to ask their own questions and will be answered directly, not over their heads.",
              },
              {
                t: "Avoid weight talk in the car",
                d: "Especially with older children. Weight is discussed in the room, carefully, and never as a judgement.",
              },
              {
                t: "Bring a second adult if you can",
                d: "One to hold the conversation, one to hold the child. It makes a long appointment much easier for everyone.",
              },
            ].map((item) => (
              <RevealItem key={item.t} className="bg-paper p-7 sm:p-8">
                <h3 className="font-display text-xl leading-tight">{item.t}</h3>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-muted">{item.d}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-10">
            <p className="text-[0.95rem] text-ink-muted">
              If a stimulation test has been arranged, read{" "}
              <Link
                href="/blog/preparing-for-a-hormone-stimulation-test"
                className="link-underline text-marigold"
              >
                Preparing for a hormone stimulation test
              </Link>{" "}
              first. It covers the whole morning, step by step.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="border-t border-line bg-paper-raised py-20 sm:py-24">
        <Container width="wide">
          <SectionHead index="05" eyebrow="FAQ" title="Practical questions." />

          <RevealGroup as="dl" className="mt-12 border-t border-line">
            {faqs.map((faq) => (
              <RevealItem
                key={faq.q}
                className="grid gap-x-12 gap-y-2 border-b border-line py-7 md:grid-cols-12"
              >
                <dt className="font-display text-xl leading-snug md:col-span-5">{faq.q}</dt>
                <dd className="text-[0.95rem] leading-relaxed text-ink-muted md:col-span-7">
                  {faq.a}
                </dd>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <BookingBand />

      <FaqJsonLd items={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Your Visit", href: "/visit" },
        ]}
      />
    </>
  );
}
