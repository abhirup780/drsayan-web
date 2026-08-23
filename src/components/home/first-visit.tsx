import { CurveDivider } from "@/components/motif/growth-curve";
import { Container } from "@/components/ui/container";
import { Cta } from "@/components/ui/cta";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { visitSteps } from "@/lib/site";

/**
 * The anxiety-reducer. Parents arriving at a specialist rarely know what is
 * about to happen to their child; saying so plainly is the single most
 * useful piece of content on a doctor's website.
 */
export function FirstVisit({ index = "05" }: { index?: string }) {
  return (
    <section
      id="visit"
      className="scroll-mt-24 border-y border-line bg-paper-raised py-16 sm:py-24 lg:py-32"
    >
      <Container width="wide">
        <SectionHead
          index={index}
          eyebrow="Your first visit"
          title={
            <>
              Nothing here will
              <br className="hidden sm:block" /> be a surprise.
            </>
          }
          lede="This is exactly how a first consultation goes, so you can tell your child in advance, in their own words."
        />

        <CurveDivider className="mt-10 opacity-60" />

        <RevealGroup as="ol" className="mt-4 grid gap-px overflow-hidden bg-line sm:grid-cols-2 lg:grid-cols-3">
          {visitSteps.map((step) => (
            <RevealItem
              key={step.step}
              as="li"
              className="group relative flex flex-col bg-paper-raised p-7 transition-colors duration-500 hover:bg-paper sm:p-8"
            >
              <span className="font-display block text-5xl leading-none text-line transition-colors duration-500 group-hover:text-marigold">
                {step.step}
              </span>

              <h3 className="font-display mt-6 text-xl leading-tight">{step.title}</h3>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-muted">{step.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Cta href="/visit" variant="outline">
            What to bring, and how to prepare
          </Cta>
        </div>
      </Container>
    </section>
  );
}
