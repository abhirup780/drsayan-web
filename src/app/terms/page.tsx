import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { contact, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & medical disclaimer",
  description: `Terms of use and medical disclaimer for the website of ${site.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Terms & disclaimer"
        title="Information, not advice."
        lede="Everything on this website is general education. It cannot examine your child, and it is not a substitute for a consultation with a doctor who can."
        crumbs={[{ label: "Home", href: "/" }, { label: "Terms & Disclaimer" }]}
      />

      <Container width="text" className="prose-clinic pb-24 sm:pb-32">
        <h2>Medical disclaimer</h2>
        <p>
          The articles, guides and checklists published here are written for general education.
          They describe how conditions usually behave and how they are usually approached. Your
          child is not a generalisation.
        </p>
        <p>
          Nothing on this site creates a doctor–patient relationship. Do not start, stop or change
          any treatment on the basis of something you read here. Doses, thresholds and protocols
          mentioned in articles are illustrative and vary between children and between centres.
        </p>
        <p>
          <strong>
            If your child is seriously unwell, meaning drowsy, breathing rapidly, vomiting persistently,
            having a seizure, or with a blood sugar you cannot correct, go to the nearest
            emergency department immediately. Do not use this website, email or WhatsApp for
            emergencies.
          </strong>
        </p>

        <h2>Interactive content</h2>
        <p>
          The growth chart illustration on the home page is a teaching device. It uses
          representative curves to explain what centiles mean and is deliberately not tied to any
          real reference population. It cannot be used to assess a child, and no part of this site
          should be used for self-diagnosis.
        </p>

        <h2>Accuracy and revision</h2>
        <p>
          Articles are dated, and revised dates are shown where an article has been updated.
          Medicine moves. An article that was accurate when written may not reflect current
          guidance, and the presence of an article here is not a commitment that it is being
          continuously reviewed.
        </p>

        <h2>Links to other sites</h2>
        <p>
          Where this site links elsewhere, it does so because the destination was considered
          useful at the time. Those sites are not controlled here and their content, accuracy and
          privacy practices are their own.
        </p>

        <h2>Appointments and communication</h2>
        <p>
          Submitting an appointment request does not confirm an appointment. A member of the
          clinic will respond during working hours. Messages sent by WhatsApp or email are not
          monitored continuously and should never be relied on for anything time-critical.
        </p>

        <h2>Content and copyright</h2>
        <p>
          The text, photographs and design of this site belong to {site.name} unless stated
          otherwise. You are welcome to print articles or share links for personal, family or
          educational use, including handing a printed guide to a school. Republishing content
          commercially requires permission.
        </p>

        <h2>Contact</h2>
        <p>
          Questions, corrections and requests should go to{" "}
          <a href={contact.emailHref}>{contact.email}</a>. Corrections to clinical content are
          particularly welcome.
        </p>
      </Container>
    </>
  );
}
