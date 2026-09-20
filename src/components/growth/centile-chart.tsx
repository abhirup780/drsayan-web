"use client";

import { useMemo } from "react";

import { heightAtZ, DAYS_PER_YEAR, type Sex } from "@/lib/growth/calc";

/**
 * The child's measurement plotted on the centile chart that actually applies
 * to them.
 *
 * Only one reference is ever drawn. WHO and IAP disagree by roughly a
 * centimetre of median at the five-year handover, so a single 0-18 curve
 * would carry a visible kink that looks like a rendering bug and invites the
 * wrong question. A clinician plots on one chart; so does this.
 *
 * The shaded band is -2 to +2 SD, which is what "the usual range" means
 * everywhere else in the result. The dashed outer lines are +-3 SD.
 */

const VB = { w: 340, h: 216 };
const PAD = { top: 10, right: 10, bottom: 26, left: 34 };
const PLOT = {
  w: VB.w - PAD.left - PAD.right,
  h: VB.h - PAD.top - PAD.bottom,
};

export function CentileChart({
  sex,
  ageDays,
  heightCm,
  reference,
}: {
  sex: Sex;
  ageDays: number;
  heightCm: number;
  reference: "who" | "iap";
}) {
  const chart = useMemo(() => {
    const fromY = reference === "who" ? 0 : 5;
    const toY = reference === "who" ? 5 : 18;
    const steps = 60;

    const ages: number[] = [];
    for (let i = 0; i <= steps; i++) {
      ages.push(fromY + ((toY - fromY) * i) / steps);
    }

    const curveFor = (z: number) =>
      ages.map((y) => ({ y, cm: heightAtZ(sex, y * DAYS_PER_YEAR, z) }));

    const curves = {
      p3neg: curveFor(-3),
      p2neg: curveFor(-2),
      med: curveFor(0),
      p2: curveFor(2),
      p3: curveFor(3),
    };

    // Scale to the outer curves, with headroom for a point that sits beyond
    // them, so an extreme measurement is never drawn outside the frame.
    const lo = Math.min(curves.p3neg[0].cm, heightCm) - 4;
    const hi = Math.max(curves.p3[curves.p3.length - 1].cm, heightCm) + 4;

    const x = (yr: number) => PAD.left + ((yr - fromY) / (toY - fromY)) * PLOT.w;
    const yPos = (cm: number) => PAD.top + PLOT.h - ((cm - lo) / (hi - lo)) * PLOT.h;

    const path = (pts: { y: number; cm: number }[]) =>
      pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.y).toFixed(2)},${yPos(p.cm).toFixed(2)}`).join("");

    const areaBetween = (
      upper: { y: number; cm: number }[],
      lower: { y: number; cm: number }[]
    ) =>
      path(upper) +
      "L" +
      [...lower]
        .reverse()
        .map((p) => `${x(p.y).toFixed(2)},${yPos(p.cm).toFixed(2)}`)
        .join("L") +
      "Z";

    const xTicks: number[] = [];
    const stepY = reference === "who" ? 1 : 2;
    for (let y = fromY; y <= toY + 0.001; y += stepY) xTicks.push(Math.round(y));

    const yTicks: number[] = [];
    const roughStep = (hi - lo) / 5;
    const niceStep = roughStep > 20 ? 20 : roughStep > 10 ? 10 : 5;
    const firstTick = Math.ceil(lo / niceStep) * niceStep;
    for (let v = firstTick; v <= hi; v += niceStep) yTicks.push(v);

    return {
      curves,
      path,
      areaBetween,
      x,
      y: yPos,
      xTicks,
      yTicks,
      fromY,
      toY,
      childX: x(Math.min(Math.max(ageDays / DAYS_PER_YEAR, fromY), toY)),
      childY: yPos(heightCm),
    };
  }, [sex, ageDays, heightCm, reference]);

  const label =
    reference === "who"
      ? "WHO Child Growth Standards, birth to 5 years"
      : "IAP 2015 growth charts, 5 to 18 years";

  return (
    <figure className="mt-0">
      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        className="block w-full"
        role="img"
        aria-label={`Height-for-age chart. The child's measurement is plotted against the ${label}.`}
      >
        {/* the usual range, -2 to +2 SD */}
        <path d={chart.areaBetween(chart.curves.p2, chart.curves.p2neg)} className="fill-marigold/10" />

        {/* grid */}
        <g className="stroke-line" strokeWidth="0.5">
          {chart.yTicks.map((v) => (
            <line key={v} x1={PAD.left} y1={chart.y(v)} x2={VB.w - PAD.right} y2={chart.y(v)} />
          ))}
        </g>

        {/* outer +-3 SD, dashed */}
        <g className="fill-none stroke-ink-faint" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.55">
          <path d={chart.path(chart.curves.p3neg)} />
          <path d={chart.path(chart.curves.p3)} />
        </g>

        {/* +-2 SD */}
        <g className="fill-none stroke-marigold" strokeWidth="1" opacity="0.55">
          <path d={chart.path(chart.curves.p2neg)} />
          <path d={chart.path(chart.curves.p2)} />
        </g>

        {/* median */}
        <path
          d={chart.path(chart.curves.med)}
          className="fill-none stroke-marigold"
          strokeWidth="1.6"
        />

        {/* axes */}
        <g className="stroke-line" strokeWidth="0.8">
          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + PLOT.h} />
          <line
            x1={PAD.left}
            y1={PAD.top + PLOT.h}
            x2={VB.w - PAD.right}
            y2={PAD.top + PLOT.h}
          />
        </g>

        <g className="fill-ink-faint" fontSize="7" fontFamily="var(--font-mono)">
          {chart.xTicks.map((t) => (
            <text key={t} x={chart.x(t)} y={VB.h - 14} textAnchor="middle">
              {t}
            </text>
          ))}
          <text x={PAD.left + PLOT.w / 2} y={VB.h - 3} textAnchor="middle">
            AGE IN YEARS
          </text>
          {chart.yTicks.map((v) => (
            <text key={v} x={PAD.left - 4} y={chart.y(v) + 2.5} textAnchor="end">
              {v}
            </text>
          ))}
        </g>

        {/* the child */}
        <g>
          <line
            x1={chart.childX}
            y1={PAD.top}
            x2={chart.childX}
            y2={PAD.top + PLOT.h}
            className="stroke-ink"
            strokeWidth="0.5"
            strokeDasharray="1.5 2"
            opacity="0.35"
          />
          <circle cx={chart.childX} cy={chart.childY} r="6" className="fill-marigold" opacity="0.18" />
          <circle
            cx={chart.childX}
            cy={chart.childY}
            r="3.2"
            className="fill-marigold stroke-paper"
            strokeWidth="1.2"
          />
        </g>
      </svg>

      <figcaption className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.75rem] text-ink-faint">
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-[3px] w-4 rounded-full bg-marigold" />
          Median
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-2.5 w-4 rounded-sm bg-marigold/20" />
          Usual range
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block size-2 rounded-full bg-marigold" />
          Your child
        </span>
        <span className="w-full sm:ml-auto sm:w-auto">{label}</span>
      </figcaption>
    </figure>
  );
}
