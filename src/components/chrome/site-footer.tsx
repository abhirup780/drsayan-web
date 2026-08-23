import Link from "next/link";

import { Monogram } from "@/components/motif/monogram";
import { WhatsAppIcon } from "@/components/motif/whatsapp-icon";
import { Container } from "@/components/ui/container";
import { clinics, contact, emergencyNote, nav, outreachClinics, site } from "@/lib/site";

const legal = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms & Disclaimer" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-paper-sunk">
      {/* The Sanskrit blessing, set enormous and quiet — the site's signature. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -bottom-2 select-none">
        <p className="font-deva whitespace-nowrap text-center text-[13vw] leading-none text-ink opacity-[0.045]">
          {site.sanskrit.text}
        </p>
      </div>

      <Container width="wide" className="relative py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <Monogram className="w-10 shrink-0" />
              <div className="leading-tight">
                <p className="font-display text-lg">{site.name}</p>
                <p className="label mt-1">{site.qualifications}</p>
              </div>
            </div>

            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-ink-muted">
              {site.tagline}
            </p>

            <p className="mt-8 font-deva text-xl text-ink">{site.sanskrit.text}</p>
            <p className="mt-1.5 text-xs text-ink-faint italic">
              {site.sanskrit.transliteration} · {site.sanskrit.translation}
            </p>
          </div>

          <div className="md:col-span-3">
            <h2 className="label">Explore</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {[{ href: "/", label: "Home" }, ...nav, { href: "/contact", label: "Contact" }].map(
                (item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="link-underline text-[0.95rem] text-ink-muted transition-colors hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h2 className="label">Clinic</h2>
            <ul className="mt-5 flex flex-col gap-5">
              {clinics.map((clinic) => (
                <li key={clinic.id} className="text-[0.9rem] leading-relaxed text-ink-muted">
                  <p className="text-ink">{clinic.name}</p>
                  <p className="mt-1">
                    {clinic.addressLines.join(", ")}, {clinic.area}
                  </p>
                  <p className="mt-1 text-ink-faint">
                    {clinic.days} · {clinic.hours}
                  </p>
                </li>
              ))}
            </ul>

            <h2 className="label mt-8">Monthly OPD clinics</h2>
            <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-muted">
              {outreachClinics.map((clinic) => clinic.town).join(" · ")}
            </p>
            <Link href="/contact#book" className="link-underline mt-2 inline-block text-[0.9rem] text-marigold">
              Numbers for each centre
            </Link>

            <div className="mt-6 flex flex-col gap-2 text-[0.9rem]">
              <a href={contact.phoneHref} className="link-underline w-fit text-ink">
                {contact.phoneDisplay}
              </a>
              {contact.whatsappHref && (
                <a
                  href={contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline flex w-fit items-center gap-2 text-ink-muted"
                >
                  <WhatsAppIcon className="size-4 shrink-0 text-marigold" />
                  WhatsApp {contact.whatsappDisplay}
                </a>
              )}
              <a href={contact.emailHref} className="link-underline w-fit break-all text-ink-muted">
                {contact.email}
              </a>
              <a
                href={contact.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline w-fit text-ink-muted"
              >
                Book via the hospital
              </a>
              <a
                href={contact.googleProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline w-fit text-ink-muted"
              >
                Directions &amp; reviews on Google
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 rounded-2xl border border-marigold/25 bg-marigold-wash/60 p-5">
          <p className="label text-marigold">In an emergency</p>
          <p className="mt-2 max-w-3xl text-[0.9rem] leading-relaxed text-ink-muted">
            {emergencyNote}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-8 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-5">
            {legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-underline transition-colors hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
