import { marqueeCredentials } from "@/lib/site";

/**
 * A slow horizontal band of credentials and focus areas. Deliberately
 * hairline and low-contrast: it should read as a running footer in a
 * printed programme, not as a badge wall.
 */
export function CredentialBand() {
  const items = [...marqueeCredentials, ...marqueeCredentials];

  return (
    <div className="group relative overflow-hidden border-y border-line bg-paper-raised py-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper-raised to-transparent sm:w-28"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper-raised to-transparent sm:w-28"
      />

      <div
        className="flex w-max animate-marquee-x items-center gap-8 group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:overflow-x-auto"
        // Duplicated list; a screen reader only needs to hear it once.
        aria-hidden="true"
      >
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="flex shrink-0 items-center gap-8">
            <span className="label whitespace-nowrap">{item}</span>
            <span className="size-1 shrink-0 rounded-full bg-marigold/60" />
          </span>
        ))}
      </div>

      <p className="sr-only">
        Areas of expertise: {marqueeCredentials.join(", ")}.
      </p>
    </div>
  );
}
