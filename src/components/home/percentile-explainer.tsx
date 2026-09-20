"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

/**
 * ── The signature interaction ────────────────────────────────────────
 *  A growth chart that teaches. As the reader scrolls, a real-looking
 *  chart is built up in four beats: what a centile means, that children
 *  track along one, that crossing lines is the actual signal, and why
 *  every visit is plotted.
 *
 *  Everything is illustrative — the copy says so, and nothing here
 *  invites self-diagnosis.
 */

const CHAPTERS = [
  {
    n: "01",
    title: "A centile is a queue, not a grade.",
    body: "If your child is on the 25th centile for height, it means that among 100 children of the same age and sex, roughly 24 are shorter and 75 are taller. That is the entire meaning. It is a position in a queue, and there is no prize for standing at the front.",
  },
  {
    n: "02",
    title: "Most children choose a line and stay near it.",
    body: "Healthy growth is remarkably loyal. From about the age of two, a child settles onto a centile and travels along it year after year, like a train that has found its track. Where the line sits matters far less than whether it keeps its direction.",
  },
  {
    n: "03",
    title: "The signal is crossing the lines.",
    body: "A line that drifts steadily downwards across centiles deserves attention even while the child is still technically ‘within normal range’. This drift is what brings most families to a paediatric endocrinologist, and it is invisible unless somebody is plotting.",
  },
  {
    n: "04",
    title: "Which is why we measure, and plot, every time.",
    body: "One height is a number. Six heights are a story. Bring every old record you can find: a school health card, a vaccination booklet, a pencil mark on a doorframe with a date beside it. It can be worth more than a blood test.",
  },
];

/* Reference centile curves, drawn in the chart's own coordinate space. */
const CENTILES: { d: string; label: string; y: number }[] = [
  { d: "M40,150 C90,120 140,100 190,80 C230,64 265,40 310,26", label: "97", y: 26 },
  { d: "M40,163 C90,134 140,114 190,95 C230,79 265,56 310,42", label: "85", y: 42 },
  { d: "M40,178 C90,150 140,131 190,112 C230,96 265,74 310,60", label: "50", y: 60 },
  { d: "M40,192 C90,165 140,147 190,128 C230,113 265,92 310,78", label: "15", y: 78 },
  { d: "M40,204 C90,178 140,161 190,143 C230,128 265,108 310,95", label: "3", y: 95 },
];

const TRACKING = [
  [55, 183],
  [95, 167],
  [135, 150],
  [175, 133],
  [215, 116],
  [255, 98],
  [300, 74],
] as const;

const FALTERING = [
  [55, 183],
  [95, 167],
  [135, 152],
  [175, 145],
  [215, 140],
  [255, 136],
  [300, 132],
] as const;

const toPolyline = (pts: readonly (readonly [number, number])[]) =>
  pts.map(([x, y]) => `${x},${y}`).join(" ");

export function PercentileExplainer() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(CHAPTERS.length - 1, Math.floor(v * CHAPTERS.length + 0.15));
    setStep((prev) => (prev === next ? prev : next));
  });

  const showChild = step >= 1;
  const faltering = step >= 2;
  const showDots = step >= 3;

  return (
    <section
      ref={ref}
      aria-labelledby="chart-heading"
      className="relative border-y border-line bg-ink text-paper dark:bg-paper-sunk dark:text-ink"
    >
      <Container width="wide" className="py-14 sm:py-20 lg:py-24">
        <div className="mb-12">
          <div className="flex items-baseline gap-4">
            <span className="label text-marigold">03</span>
            <span className="label text-paper/50 dark:text-ink-faint">Read the chart with me</span>
          </div>
          <h2
            id="chart-heading"
            className="font-display mt-5 max-w-3xl text-(length:--text-display) leading-[0.98]"
          >
            The most useful thing in this clinic is a piece of graph paper.
          </h2>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          {/* ── Sticky chart ──────────────────────────────────────── */}
          <div className="sticky top-20 z-10 -mx-5 bg-ink px-5 py-4 sm:mx-0 sm:px-0 lg:col-span-6 lg:self-start lg:py-0 dark:bg-paper-sunk">
            <figure>
              <svg
                viewBox="0 0 340 240"
                className="w-full"
                role="img"
                aria-label="An illustrative height-for-age growth chart showing five centile curves, with one child's measurements plotted along the 25th centile and a second pattern drifting downwards across the centile lines."
              >
                {/* Plot frame */}
                <g stroke="currentColor" opacity="0.25">
                  <line x1="40" y1="18" x2="40" y2="212" strokeWidth="0.8" />
                  <line x1="40" y1="212" x2="316" y2="212" strokeWidth="0.8" />
                </g>

                {/* Graph-paper grid */}
                <g stroke="currentColor" opacity="0.1" strokeWidth="0.5">
                  {[2, 4, 6, 8, 10, 12, 14, 16].map((age, i) => (
                    <line key={age} x1={40 + i * 39.4} y1="18" x2={40 + i * 39.4} y2="212" />
                  ))}
                  {[40, 70, 100, 130, 160, 190].map((y) => (
                    <line key={y} x1="40" y1={y} x2="316" y2={y} />
                  ))}
                </g>

                {/* Axis labels */}
                <g className="fill-current" opacity="0.5" fontSize="7" fontFamily="var(--font-mono)">
                  {[2, 4, 6, 8, 10, 12, 14, 16].map((age, i) => (
                    <text key={age} x={40 + i * 39.4} y="224" textAnchor="middle">
                      {age}
                    </text>
                  ))}
                  <text x="178" y="236" textAnchor="middle" letterSpacing="1.5">
                    AGE IN YEARS
                  </text>
                  <text x="14" y="118" textAnchor="middle" transform="rotate(-90 14 118)" letterSpacing="1.5">
                    HEIGHT
                  </text>
                </g>

                {/* Centile curves. The in-view trigger sits on the <g>, not on
                    each path: a path at `pathLength: 0` has no geometry to
                    intersect, so an observer on it would never fire. */}
                <motion.g
                  fill="none"
                  strokeLinecap="round"
                  initial="hidden"
                  whileInView="shown"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {CENTILES.map((c, i) => (
                    <motion.path
                      key={c.label}
                      d={c.d}
                      stroke="currentColor"
                      strokeWidth={c.label === "50" ? "1.1" : "0.7"}
                      opacity={c.label === "50" ? 0.55 : 0.3}
                      variants={{
                        hidden: { pathLength: 0 },
                        shown: {
                          pathLength: 1,
                          transition: {
                            duration: 1.4,
                            delay: i * 0.08,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        },
                      }}
                    />
                  ))}
                </motion.g>

                {/* Centile labels */}
                <g className="fill-current" opacity="0.45" fontSize="6.5" fontFamily="var(--font-mono)">
                  {CENTILES.map((c) => (
                    <text key={c.label} x="319" y={c.y + 2}>
                      {c.label}
                    </text>
                  ))}
                </g>

                {/* The child's own line */}
                <motion.g
                  animate={{ opacity: showChild ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-marigold"
                >
                  <motion.polyline
                    points={toPolyline(TRACKING)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ opacity: faltering ? 0 : 1 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <motion.polyline
                    points={toPolyline(FALTERING)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ opacity: faltering ? 1 : 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {(faltering ? FALTERING : TRACKING).map(([x, y], i) => (
                    <motion.circle
                      key={`${x}-${i}`}
                      cx={x}
                      cy={y}
                      r="2.6"
                      fill="currentColor"
                      animate={{ opacity: showDots ? 1 : 0, scale: showDots ? 1 : 0.2 }}
                      transition={{ duration: 0.35, delay: showDots ? i * 0.06 : 0 }}
                      style={{ transformOrigin: `${x}px ${y}px` }}
                    />
                  ))}
                </motion.g>

                {/* Callout that appears with the crossing chapter */}
                <motion.g
                  animate={{ opacity: faltering && !showDots ? 1 : faltering ? 0.85 : 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-marigold"
                >
                  <line
                    x1="215"
                    y1="140"
                    x2="252"
                    y2="176"
                    stroke="currentColor"
                    strokeWidth="0.7"
                    strokeDasharray="2 2"
                  />
                  <text
                    x="255"
                    y="182"
                    fontSize="7"
                    fontFamily="var(--font-mono)"
                    letterSpacing="1"
                    className="fill-current"
                  >
                    CROSSING
                  </text>
                </motion.g>
              </svg>

              <figcaption className="mt-3 text-[0.7rem] leading-relaxed text-paper/45 dark:text-ink-faint">
                Illustrative only, not a diagnostic tool. Real charts are specific to sex,
                population and the measurement being tracked.
              </figcaption>
            </figure>
          </div>

          {/* ── Scrolling chapters ────────────────────────────────── */}
          <div className="mt-12 lg:col-span-6 lg:mt-0">
            {CHAPTERS.map((chapter, i) => (
              <div
                key={chapter.n}
                className="flex min-h-[62svh] flex-col justify-center py-10 lg:min-h-[85svh]"
              >
                <motion.div
                  animate={{ opacity: reduce ? 1 : step === i ? 1 : 0.28 }}
                  transition={{ duration: 0.5 }}
                >
                  <span
                    className={cn(
                      "label transition-colors",
                      step === i ? "text-marigold" : "text-paper/40 dark:text-ink-faint"
                    )}
                  >
                    {chapter.n}
                  </span>
                  <h3 className="font-display mt-4 text-(length:--text-title) leading-[1.05]">
                    {chapter.title}
                  </h3>
                  <p className="mt-5 max-w-lg text-base leading-relaxed text-paper/70 sm:text-lg dark:text-ink-muted">
                    {chapter.body}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
