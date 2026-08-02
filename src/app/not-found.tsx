import { GrowthCurve } from "@/components/motif/growth-curve";
import { Container } from "@/components/ui/container";
import { Cta } from "@/components/ui/cta";

export default function NotFound() {
  return (
    <section className="grain relative isolate flex min-h-svh items-center overflow-hidden py-32">
      <GrowthCurve
        className="absolute inset-x-0 bottom-0 -z-10 h-2/3 w-full text-ink opacity-40
          [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_50%,black_90%)]"
      />

      <Container width="wide" className="relative">
        <p className="label text-marigold">404 · off the chart</p>
        <h1 className="font-display mt-6 max-w-3xl text-(length:--text-hero) leading-[0.92]">
          This page is not
          <br />
          on any centile.
        </h1>
        <p className="mt-7 max-w-lg text-base leading-relaxed text-ink-muted sm:text-lg">
          The address you followed does not exist, or it has moved somewhere more sensible. Try
          the Blog, or tell the clinic what you were looking for.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Cta href="/">Back to the beginning</Cta>
          <Cta href="/blog" variant="outline">
            Search the Blog
          </Cta>
        </div>
      </Container>
    </section>
  );
}
