import Link from "next/link";

import { GrowthCurve } from "@/components/motif/growth-curve";
import { WhatsAppIcon } from "@/components/motif/whatsapp-icon";
import { Container } from "@/components/ui/container";
import { Cta } from "@/components/ui/cta";
import { Reveal } from "@/components/ui/reveal";
import { clinics, contact, outreachClinics, site } from "@/lib/site";

export function BookingBand({ index = "08" }: { index?: string }) {
  return (
    <section
      id="book"
      className="grain relative isolate scroll-mt-24 overflow-hidden bg-ink py-24 text-paper sm:py-32 dark:bg-paper-sunk dark:text-ink"
    >
      <GrowthCurve
        className="absolute inset-x-0 bottom-0 -z-10 h-2/3 w-full text-paper opacity-20 dark:text-ink
          [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_45%,black_88%)]"
        grid={false}
        highlightIndex={2}
      />

      <Container width="wide" className="relative">
        <div className="grid gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <span className="label text-marigold">{index} / Appointments</span>
            <h2 className="font-display mt-6 text-(length:--text-display) leading-[0.96]">
              Bring the old
              <br />
              reports. Bring the
              <br />
              <span className="italic text-marigold">questions</span> too.
            </h2>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-paper/70 sm:text-lg dark:text-ink-muted">
              The quickest way to reach Dr. Banerjee is WhatsApp, which goes to him directly.
              Consultations themselves are held in the diary at Neotia Bhagirathi Woman and Child
              Care Centre in New Town, so slots are booked through the hospital.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              {contact.whatsappHref && (
                <Cta
                  href={contact.whatsappHref}
                  withArrow={false}
                  icon={<WhatsAppIcon className="size-[1.05rem] shrink-0" />}
                  className="bg-marigold text-white dark:text-paper hover:bg-ink hover:text-paper dark:hover:bg-ink dark:hover:text-paper"
                  aria-label={`Message Dr. Banerjee on WhatsApp at ${contact.whatsappDisplay}`}
                >
                  Message on WhatsApp
                </Cta>
              )}
              <Cta
                href={contact.bookingUrl}
                variant="outline"
                className="border-paper/25 text-paper hover:border-marigold dark:border-line dark:text-ink"
              >
                Book via the hospital
              </Cta>
              <Cta
                href="/contact#book"
                variant="outline"
                className="border-paper/25 text-paper hover:border-marigold dark:border-line dark:text-ink"
              >
                All the ways to book
              </Cta>
            </div>

            <p className="mt-8 text-sm text-paper/50 dark:text-ink-faint">
              {contact.whatsappDisplay && (
                <>
                  WhatsApp{" "}
                  <span className="text-marigold">{contact.whatsappDisplay}</span>, or call the
                  hospital on{" "}
                </>
              )}
              <a href={contact.phoneHref} className="link-underline text-marigold">
                {contact.phoneDisplay}
              </a>
            </p>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5">
            <dl className="divide-y divide-paper/15 border-y border-paper/15 dark:divide-line dark:border-line">
              {clinics.map((clinic) => (
                <div key={clinic.id} className="py-6">
                  <dt className="font-display text-lg">{clinic.name}</dt>
                  <dd className="mt-3 space-y-1.5 text-[0.9rem] leading-relaxed text-paper/65 dark:text-ink-muted">
                    <p>
                      {clinic.addressLines.join(", ")}
                      <br />
                      {clinic.area}
                    </p>
                    <p className="text-marigold">
                      {clinic.days} · {clinic.hours}
                    </p>
                    {clinic.note && <p className="text-paper/45 dark:text-ink-faint">{clinic.note}</p>}
                    <a
                      href={clinic.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline inline-block pt-1 text-paper dark:text-ink"
                    >
                      Open in Maps
                    </a>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8">
              <p className="label">Monthly OPD clinics</p>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-paper/65 dark:text-ink-muted">
                {outreachClinics.map((c) => c.town).join(" · ")}
              </p>
              <Link
                href="/#outreach"
                className="link-underline mt-3 inline-block text-[0.875rem] text-marigold"
              >
                Numbers for each centre
              </Link>
            </div>

            <p className="mt-8 font-deva text-xl text-marigold">{site.sanskrit.text}</p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
