"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

/**
 * Wraps the article body so it can measure it directly — which is why this
 * component owns the element rather than looking it up after mount.
 *
 * Progress is shown in the site's own language: a marigold line filling
 * across the top, plus a quiet "minutes left" dial on wide screens.
 */
export function ReadingProgress({
  minutes,
  children,
}: {
  minutes: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 88px", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });

  const remaining = useTransform(progress, (v) =>
    v > 0.985 ? "Finished" : `${Math.max(0, Math.ceil(minutes * (1 - v)))} min left`
  );

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-60 h-[2px] origin-left bg-marigold"
      />

      <div
        aria-hidden="true"
        className="fixed right-6 bottom-6 z-40 hidden items-center gap-3 rounded-full border border-line bg-paper/85 py-2 pr-4 pl-2 backdrop-blur-md xl:flex"
      >
        <span className="grid size-8 place-items-center">
          <svg viewBox="0 0 36 36" className="size-8 -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-line"
            />
            <motion.circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="text-marigold"
              style={{ pathLength: progress }}
            />
          </svg>
        </span>
        <motion.span className="label whitespace-nowrap">{remaining}</motion.span>
      </div>

      <div id="article-body" ref={ref} className="prose-clinic max-w-[44rem]">
        {children}
      </div>
    </>
  );
}
