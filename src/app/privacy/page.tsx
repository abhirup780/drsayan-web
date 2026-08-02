import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { contact, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${site.name}'s website handles visitor information.`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="What this site knows about you."
        lede="Short version: almost nothing. This is a static website with no accounts, no advertising and no third-party tracking."
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy" }]}
      />

      <Container width="text" className="prose-clinic pb-24 sm:pb-32">
        <h2>No tracking, no advertising</h2>
        <p>
          This website does not set advertising cookies, does not run behavioural analytics, and
          does not embed third-party trackers. Fonts are self-hosted and served from this domain,
          so loading a page does not tell any font provider that you visited.
        </p>
        <p>
          The only value stored in your browser is your light or dark theme preference, kept in
          local storage on your own device. It is never transmitted anywhere and you can clear it
          at any time.
        </p>

        <h2>The appointment form</h2>
        <p>
          The appointment request form does not submit anything to this website. It assembles the
          details you type into a message and hands that message to WhatsApp or your own email
          application, where you choose whether to send it. Nothing you type is stored on this
          site or passed to any form service.
        </p>
        <p>
          Once you send that message, it is governed by the privacy policy of the service you
          used, WhatsApp or your email provider, and by the clinic&rsquo;s handling of patient
          communications.
        </p>

        <h2>Clinical records</h2>
        <p>
          Medical records created during consultations are held by the clinic separately from this
          website, and are treated as confidential in line with the standards expected of medical
          practice in India. This website has no access to them.
        </p>

        <h2>Hosting logs</h2>
        <p>
          Like any website, pages are served by a hosting provider that may keep short-lived
          technical logs such as IP address, browser type and page requested, for security and reliability.
          These are not used to build a profile of you and are not linked to any clinical record.
        </p>

        <h2>Children</h2>
        <p>
          This site is written for parents and carers. It does not knowingly collect information
          from children, and it collects no information from anybody by default.
        </p>

        <h2>Questions</h2>
        <p>
          Write to <a href={contact.emailHref}>{contact.email}</a> with any question about how
          information is handled, or to ask that a message you sent be deleted.
        </p>
      </Container>
    </>
  );
}
