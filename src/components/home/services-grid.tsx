import { Container } from "@/components/ui/container";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { services } from "@/lib/site";

export function ServicesGrid() {
  return (
    <section id="services" className="scroll-mt-24 py-24 sm:py-32">
      <Container width="wide">
        <SectionHead
          index="04"
          eyebrow="What the clinic does"
          title="Care that is measured in years, not appointments."
          lede="Six things this practice does properly, rather than sixty it does adequately."
        />

        <RevealGroup className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <RevealItem
              key={service.index}
              className="group relative flex flex-col bg-paper p-7 transition-colors duration-500 hover:bg-paper-raised sm:p-8"
            >
              <span className="label text-marigold">{service.index}</span>
              <h3 className="font-display mt-5 text-2xl leading-tight">{service.title}</h3>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-muted">{service.body}</p>

              <ul className="mt-6 flex flex-col gap-2 border-t border-line-soft pt-5">
                {service.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-baseline gap-2.5 text-[0.8125rem] text-ink-faint"
                  >
                    <span aria-hidden="true" className="mt-2 block h-px w-2 shrink-0 bg-marigold" />
                    {point}
                  </li>
                ))}
              </ul>

              {/* A curve fragment that draws itself in on hover. */}
              <svg
                viewBox="0 0 60 20"
                aria-hidden="true"
                className="pointer-events-none absolute right-5 bottom-5 h-4 w-14 text-marigold opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                fill="none"
              >
                <path
                  d="M2 18C14 14 24 11 34 7C42 3.8 50 2.6 58 2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <circle cx="58" cy="2" r="2" fill="currentColor" />
              </svg>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
