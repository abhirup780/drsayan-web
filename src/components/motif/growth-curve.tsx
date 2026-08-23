"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * ── The signature motif ───────────────────────────────────────────────
 *  Every paediatric endocrinologist's working life happens on a growth
 *  chart. So the chart *is* the visual identity: a fan of percentile
 *  curves that draws itself in, reappears as section dividers, and
 *  becomes the reading-progress indicator in the blog.
 *
 *  The curve shape is real in spirit — a steep infant rise, a long
 *  steady childhood run, then the pubertal spurt near the right edge.
 */

/** Percentile curves in a 0–100 × 0–100 box, y measured from the top. */
const CURVES = [
  "M0,88 C10,66 22,58 38,52 C54,46 62,42 70,32 C78,22 88,15 100,11",
  "M0,92 C10,72 22,64 38,58 C54,52 62,49 70,40 C78,31 88,24 100,20",
  "M0,96 C10,78 22,71 38,65 C54,59 62,56 70,48 C78,40 88,33 100,29",
  "M0,99 C10,84 22,78 38,72 C54,66 62,63 70,56 C78,49 88,42 100,38",
  "M0,102 C10,90 22,85 38,79 C54,73 62,70 70,64 C78,58 88,51 100,47",
];

type Props = {
  className?: string;
  /** Emphasise the median curve in marigold. */
  highlightIndex?: number;
  /** Draw a faint dotted measurement grid behind the curves. */
  grid?: boolean;
  strokeWidth?: number;
  animate?: boolean;
};

/**
 * Note: this field stretches to fill its container (`preserveAspectRatio` is
 * "none"), so it carries lines only. Anything round would render as an
 * ellipse — plotted dots belong in the aspect-correct charts instead.
 */
export function GrowthCurve({
  className,
  highlightIndex = 2,
  grid = true,
  strokeWidth = 0.35,
  animate = true,
}: Props) {
  const reduce = useReducedMotion();
  const shouldAnimate = animate && !reduce;

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn("pointer-events-none select-none", className)}
      aria-hidden="true"
      focusable="false"
    >
      {grid && (
        <g stroke="currentColor" strokeWidth={strokeWidth * 0.5} opacity="0.16">
          {[0, 20, 40, 60, 80, 100].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" strokeDasharray="1 2.5" />
          ))}
          {[0, 20, 40, 60, 80, 100].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} strokeDasharray="1 2.5" />
          ))}
        </g>
      )}

      <g fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke">
        {CURVES.map((d, i) => {
          const isHighlight = i === highlightIndex;
          return (
            <motion.path
              key={d}
              d={d}
              stroke="currentColor"
              strokeWidth={isHighlight ? strokeWidth * 1.9 : strokeWidth}
              opacity={isHighlight ? 0.95 : 0.32}
              className={isHighlight ? "text-marigold" : undefined}
              initial={shouldAnimate ? { pathLength: 0 } : false}
              animate={shouldAnimate ? { pathLength: 1 } : undefined}
              transition={{
                duration: 2.1,
                delay: 0.25 + Math.abs(i - highlightIndex) * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          );
        })}
      </g>

    </svg>
  );
}

/**
 * The section divider.
 *
 * A full-width curve stretched over 1200px is so shallow it just reads as a
 * crooked rule, so this is a short, aspect-correct curve fragment ending on a
 * plotted marigold point, followed by a hairline that carries the eye across.
 * Unmistakably the growth-chart gesture, at any viewport width.
 */
export function CurveDivider({ className, flip = false }: { className?: string; flip?: boolean }) {
  const reduce = useReducedMotion();

  // The in-view trigger lives on the wrapper, never on the path itself: a
  // path whose initial state is `pathLength: 0` renders no geometry, so an
  // observer attached to it would have nothing to intersect and would never
  // fire — the animation would deadlock at invisible.
  //
  // `initial` and `whileInView` stay constant regardless of `reduce`, and the
  // reduction is expressed in the transition instead. Switching them (to
  // `false`/`undefined`) mid-life left motion with no target variant once
  // useReducedMotion resolved from null to a boolean, so it animated the
  // paths back toward a base state it had never read — the "animate opacity
  // from undefined to 0" warning. `Reveal` already handles it this way.
  const duration = reduce ? 0 : undefined;

  return (
    <motion.div
      aria-hidden="true"
      className={cn("flex items-end gap-4", flip && "flex-row-reverse", className)}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.6 }}
    >
      <svg
        viewBox="0 0 120 36"
        className={cn("h-9 w-[7.5rem] shrink-0 text-ink-faint", flip && "-scale-x-100")}
        fill="none"
        focusable="false"
      >
        <motion.path
          d="M3,33 C26,30 42,25 60,19 C78,13 94,9 110,6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            shown: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: duration ?? 1.1, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        />
        <motion.circle
          cx="112"
          cy="5.6"
          r="3.4"
          className="fill-marigold"
          style={{ transformOrigin: "112px 5.6px" }}
          variants={{
            hidden: { scale: 0 },
            shown: {
              scale: 1,
              transition: {
                duration: duration ?? 0.5,
                delay: reduce ? 0 : 0.85,
                ease: [0.16, 1, 0.3, 1],
              },
            },
          }}
        />
      </svg>

      <span className={cn("rule mb-[3px] h-px flex-1", flip && "-scale-x-100")} />
    </motion.div>
  );
}
