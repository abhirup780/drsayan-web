import type { Metadata } from "next";

import { BookingBand } from "@/components/home/booking-band";
import { ConditionsIndex } from "@/components/home/conditions-index";
import { CredentialBand } from "@/components/home/credential-band";
import { FirstVisit } from "@/components/home/first-visit";
import { Hero } from "@/components/home/hero";
import { BlogPreview } from "@/components/home/blog-preview";
import { OutreachClinics } from "@/components/home/outreach-clinics";
import { PercentileExplainer } from "@/components/home/percentile-explainer";
import { PracticeIntro } from "@/components/home/practice-intro";
import { ResourceShelf } from "@/components/home/resource-shelf";
import { ServicesGrid } from "@/components/home/services-grid";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} · ${site.role}, ${site.city}`,
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <CredentialBand />
      <PracticeIntro />
      <ConditionsIndex />
      <PercentileExplainer />
      <ServicesGrid />
      <FirstVisit />
      <OutreachClinics index="06" />
      <BlogPreview index="07" />
      <ResourceShelf index="08" limit={4} />
      <BookingBand index="09" />
    </>
  );
}
