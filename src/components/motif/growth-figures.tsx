import { cn } from "@/lib/utils";

/**
 * ── The mark ─────────────────────────────────────────────────────────
 *  Three figures, each taller than the last. A child growing up, which is
 *  the entire speciality in one glyph and needs no explaining to anyone.
 *
 *  Redrawn as clean geometry rather than shipped from the supplied trace:
 *  that file was 180 kB of auto-traced noise, could not take `currentColor`,
 *  and carried a baked-in white background. This is a few hundred bytes,
 *  inherits the text colour, and stays crisp from 16px to a billboard.
 */

/** One figure, drawn in a 44 × 100 box with its feet on y = 100. */
function Figure({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cx="22" cy="15" r="15" />
      <rect x="1" y="36" width="42" height="32" rx="15" />
      <rect x="5" y="61" width="15" height="39" rx="7.5" />
      <rect x="24" y="61" width="15" height="39" rx="7.5" />
    </g>
  );
}

export function GrowthFigures({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 116 100"
      // Width is set by the caller; height follows the 116:100 viewBox.
      className={cn("h-auto", className)}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <Figure x={2} y={54} scale={0.46} />
      <Figure x={30} y={30} scale={0.7} />
      <Figure x={70} y={0} scale={1} />
    </svg>
  );
}

/**
 * The same idea with the tallest figure picked out in marigold, for places
 * that carry the mark on its own rather than beside the wordmark.
 */
export function GrowthFiguresAccent({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 116 100"
      // Width is set by the caller; height follows the 116:100 viewBox.
      className={cn("h-auto", className)}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <g opacity="0.55">
        <Figure x={2} y={54} scale={0.46} />
        <Figure x={30} y={30} scale={0.7} />
      </g>
      <g className="fill-marigold">
        <Figure x={70} y={0} scale={1} />
      </g>
    </svg>
  );
}
