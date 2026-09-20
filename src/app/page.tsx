import type { Metadata } from "next";

import { BookingBand } from "@/components/home/booking-band";
import { ConditionsIndex } from "@/components/home/conditions-index";
import { CredentialBand } from "@/components/home/credential-band";
import { FirstVisit } from "@/components/home/first-visit";
import { GrowthCheckBand } from "@/components/home/growth-check-band";
import { Hero } from "@/components/home/hero";
import { BlogPreview } from "@/components/home/blog-preview";
import { OutreachClinics } from "@/components/home/outreach-clinics";
import { PercentileExplainer } from "@/components/home/percentile-explainer";
import { PracticeIntro } from "@/components/home/practice-intro";
import { PressStrip } from "@/components/home/press-strip";
import { ResourceShelf } from "@/components/home/resource-shelf";
import { ServicesGrid } from "@/components/home/services-grid";
import { VideoPreview } from "@/components/home/video-preview";
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
      <PressStrip />
      <GrowthCheckBand />
      <PracticeIntro />
      <ConditionsIndex />
      <PercentileExplainer />
      <ServicesGrid />
      <FirstVisit />
      <OutreachClinics index="06" />
      <VideoPreview index="07" />
      <BlogPreview index="08" />
      <ResourceShelf index="09" limit={4} />
      <BookingBand index="10" />
    </>
  );
}
