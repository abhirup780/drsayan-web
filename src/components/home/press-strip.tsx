import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { mediaAppearances } from "@/lib/site";

/**
 * A quiet line of third-party validation, sat directly under the credentials.
 *
 * Deliberately understated: outlet names, no logos. Reproducing a masthead
 * implies an endorsement by the publication, which quoting a doctor is not.
 */
export function PressStrip() {
  // One entry per outlet, pointing at that outlet's piece. `mediaAppearances`
  // is ordered newest first, so the first match for an outlet is the one a
  // reader should land on if it ever carries more than one.
  const outlets = mediaAppearances
    .filter((item) => item.kind === "press")
    .filter(
      (item, i, all) => all.findIndex((other) => other.outlet === item.outlet) === i
    );

  if (outlets.length === 0) return null;

  return (
    <section className="border-b border-line bg-paper-raised py-10 sm:py-12">
      <Container width="wide">
        <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="label text-marigold">Quoted in</span>
            {outlets.map((item) => (
              <a
                key={item.outlet}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                title={item.title}
                className="link-underline font-display text-lg leading-none text-ink-muted transition-colors hover:text-marigold"
              >
                {item.outlet}
              </a>
            ))}
          </div>

          <Link
            href="/media"
            className="link-underline shrink-0 text-[0.9rem] text-marigold"
          >
            Talks &amp; press
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
