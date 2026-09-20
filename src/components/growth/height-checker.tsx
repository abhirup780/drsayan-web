"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { CentileChart } from "@/components/growth/centile-chart";
import {
  MAX_AGE_DAYS,
  ageInDays,
  assess,
  describeAgeBetween,
  heightAtZ,
  midParentalHeight,
  type Band,
  type Sex,
} from "@/lib/growth/calc";
import { contact } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Height-for-age checker.
 *
 * Deliberately height only. Weight and BMI answer a different question, and
 * mixing them lets a reassuring BMI mask a growth problem, which is the exact
 * failure this practice sees most.
 *
 * Everything is computed in the browser. No measurement is transmitted, which
 * is both the honest default for a child's health data and the reason the
 * page needs no backend.
 */

type Tone = "ok" | "watch" | "review";

const BAND_TONE: Record<Band, Tone> = {
  "very-short": "review",
  short: "watch",
  usual: "ok",
  tall: "ok",
  "very-tall": "watch",
};

/** Headline and guidance per band. Written to inform, never to frighten. */
function verdict(band: Band, sex: Sex) {
  const child = sex === "boys" ? "boys" : "girls";
  switch (band) {
    case "very-short":
      return {
        title: "Worth seeing a doctor about",
        body: `This height is well below the range expected for ${child} of this age. That is worth looking into properly rather than waiting, because the causes that matter are treatable and the earlier they are found the more can be done. Take any old height records with you.`,
      };
    case "short":
      return {
        title: "Worth having checked",
        body: `This height is below the range expected for ${child} of this age. Plenty of healthy children are simply short, often because their parents are. What tells the two apart is the pattern over time, not this one number, so bring it up at the next visit.`,
      };
    case "usual":
      return {
        title: "Within the usual range",
        body: `This height sits inside the range expected for ${child} of this age. Children come in a wide variety of sizes, and being nearer one edge than the middle is not a problem in itself. Keep measuring once or twice a year.`,
      };
    case "tall":
      return {
        title: "Taller than most, and that is usually fine",
        body: `This height is above the range expected for ${child} of this age. Tall children are most often tall because their families are. It is worth recording, not worrying about.`,
      };
    case "very-tall":
      return {
        title: "Worth having checked",
        body: `This height is well above the range expected for ${child} of this age. Tall stature is rarely a problem in itself, but when it is this far above the expected range it is worth a doctor confirming there is no hormonal reason behind it.`,
      };
  }
}

const TONE_STYLES: Record<Tone, string> = {
  ok: "border-teal/30 bg-teal/5",
  watch: "border-marigold/35 bg-marigold-wash/60",
  review: "border-marigold/60 bg-marigold-wash",
};

const TONE_TITLE: Record<Tone, string> = {
  ok: "text-teal",
  watch: "text-marigold",
  review: "text-marigold",
};

const inputClass =
  "mt-2 w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-[0.95rem] text-ink transition-colors placeholder:text-ink-faint focus:border-marigold focus:outline-none aria-invalid:border-marigold";

function todayISO() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Parses a yyyy-mm-dd value as a local date, never as UTC. */
function parseISO(v: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function HeightChecker({ compact = false }: { compact?: boolean }) {
  const uid = useId();
  const [sex, setSex] = useState<Sex>("boys");
  const [dob, setDob] = useState("");
  // Lazily today's date on the client, empty during SSR. Doing this in an
  // effect would cascade a render; doing it eagerly would print the server's
  // date into HTML that the browser then disagrees with the moment the two
  // are in different days. The input carries suppressHydrationWarning because
  // that difference is deliberate.
  const [on, setOn] = useState(() =>
    typeof window === "undefined" ? "" : todayISO()
  );
  const [height, setHeight] = useState("");
  const [showParents, setShowParents] = useState(false);
  const [father, setFather] = useState("");
  const [mother, setMother] = useState("");
  const [submitted, setSubmitted] = useState(false);
  // Counts submissions rather than tracking a boolean, so a second press
  // re-runs the scroll even though `submitted` is already true.
  const [runs, setRuns] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  // Bring the answer into view. On a phone the button sits at the bottom of
  // the card and the result renders below the fold, so pressing it otherwise
  // looks like nothing happened. Only moves the page when the answer really
  // is off-screen: on a desktop where the whole card already fits, scrolling
  // would be a jolt for nothing.
  useEffect(() => {
    if (runs === 0) return;
    const el = resultRef.current;
    if (!el) return;
    if (el.getBoundingClientRect().top < window.innerHeight - 120) return;
    el.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }, [runs]);

  const parsed = useMemo(() => {
    const birth = parseISO(dob);
    const when = parseISO(on);
    const cm = Number.parseFloat(height);

    if (!birth) return { error: "Please enter your child's date of birth." as const };
    if (!when) return { error: "Please enter the date the height was measured." as const };
    if (when < birth) return { error: "The measurement date is before the date of birth." as const };

    const days = ageInDays(birth, when);
    if (days > MAX_AGE_DAYS) {
      return {
        error:
          "This check covers birth to 18 years. From 18, adult ranges apply instead of a growth chart." as const,
      };
    }
    if (!Number.isFinite(cm) || cm < 30 || cm > 220) {
      return { error: "Please enter a height between 30 and 220 cm." as const };
    }

    const result = assess({ sex, ageDays: days, heightCm: cm });
    const f = Number.parseFloat(father);
    const m = Number.parseFloat(mother);
    const parents =
      Number.isFinite(f) && Number.isFinite(m) && f >= 120 && f <= 220 && m >= 120 && m <= 220
        ? midParentalHeight(sex, f, m)
        : null;

    return { result, birth, when, days, cm, parents };
  }, [sex, dob, on, height, father, mother]);

  const show = submitted && "result" in parsed && parsed.result;

  return (
    <div className={cn("rounded-2xl border border-line bg-paper-raised", compact ? "p-6 sm:p-7" : "p-7 sm:p-9")}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
          setRuns((n) => n + 1);
        }}
        noValidate
      >
        <fieldset className="border-0 p-0">
          <legend className="label text-marigold">Child</legend>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <span className="label block" id={`${uid}-sex`}>
                Boy or girl
              </span>
              <div
                role="group"
                aria-labelledby={`${uid}-sex`}
                className="mt-2 flex overflow-hidden rounded-lg border border-line"
              >
                {(["boys", "girls"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSex(s)}
                    aria-pressed={sex === s}
                    className={cn(
                      "flex-1 px-4 py-2.5 text-[0.95rem] transition-colors",
                      sex === s
                        ? "bg-marigold font-medium text-white dark:text-paper"
                        : "bg-paper text-ink-muted hover:text-ink"
                    )}
                  >
                    {s === "boys" ? "Boy" : "Girl"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor={`${uid}-h`} className="label block">
                Height or length <span className="text-ink-faint">cm</span>
              </label>
              <input
                id={`${uid}-h`}
                type="number"
                inputMode="decimal"
                step="0.1"
                min="30"
                max="220"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 112.5"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor={`${uid}-dob`} className="label block">
                Date of birth
              </label>
              <input
                id={`${uid}-dob`}
                type="date"
                value={dob}
                // `max` is today's date, which only exists on the client, so
                // the deliberate server/client difference is suppressed the
                // same way as the measurement date below.
                max={on || undefined}
                suppressHydrationWarning
                onChange={(e) => setDob(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor={`${uid}-on`} className="label block">
                Date measured
              </label>
              <input
                id={`${uid}-on`}
                type="date"
                value={on}
                suppressHydrationWarning
                onChange={(e) => setOn(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </fieldset>

        {/* Its own band with a rule above it. As a bare link it sat directly
            on the primary button and the two read as one crowded block. */}
        <div className="mt-7 border-t border-line pt-6">
          <button
            type="button"
            onClick={() => setShowParents((v) => !v)}
            aria-expanded={showParents}
            className="link-underline text-[0.9rem] text-marigold"
          >
            {showParents ? "Hide parents' heights" : "Add parents' heights (optional)"}
          </button>
        </div>

        {showParents && (
          <fieldset className="mt-4 border-0 p-0">
            <p className="text-[0.875rem] leading-relaxed text-ink-muted">
              A child&rsquo;s genetic height target is calculated from both parents. Measured is far
              better than remembered.
            </p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor={`${uid}-f`} className="label block">
                  Father&rsquo;s height <span className="text-ink-faint">cm</span>
                </label>
                <input
                  id={`${uid}-f`}
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={father}
                  onChange={(e) => setFather(e.target.value)}
                  placeholder="e.g. 172"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor={`${uid}-m`} className="label block">
                  Mother&rsquo;s height <span className="text-ink-faint">cm</span>
                </label>
                <input
                  id={`${uid}-m`}
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={mother}
                  onChange={(e) => setMother(e.target.value)}
                  placeholder="e.g. 158"
                  className={inputClass}
                />
              </div>
            </div>
          </fieldset>
        )}

        <button
          type="submit"
          className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-ink px-6 text-[0.95rem] font-medium text-paper transition-colors duration-300 hover:bg-marigold hover:text-white sm:w-auto dark:hover:text-paper"
        >
          Check the height
        </button>
      </form>

      <div ref={resultRef} aria-live="polite" className={cn("scroll-mt-24", submitted && "mt-7")}>
        {submitted && "error" in parsed && parsed.error && (
          <p role="alert" className="rounded-xl border border-marigold/40 bg-marigold-wash/60 p-4 text-[0.9rem] text-ink-muted">
            {parsed.error}
          </p>
        )}

        {show && "result" in parsed && parsed.result && (
          <Result
            sex={sex}
            r={parsed.result}
            ageLabel={describeAgeBetween(parsed.birth!, parsed.when!)}
            heightCm={parsed.cm!}
            parents={parsed.parents ?? null}
          />
        )}
      </div>

      {/* The privacy note belongs on the card, not beside it: it answers a
          question a parent asks at the moment they type a child's date of
          birth, and it is the card that has to earn that. */}
      <p className="mt-7 flex items-start gap-2.5 border-t border-line pt-5 text-[0.8rem] leading-relaxed text-ink-muted">
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="mt-px size-3.5 shrink-0 text-marigold"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
        >
          <rect x="3" y="7" width="10" height="7" rx="1.6" />
          <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
        </svg>
        Worked out on your own device. The date of birth and the height are never sent anywhere,
        and nothing is saved.
      </p>
    </div>
  );
}

function Result({
  sex,
  r,
  ageLabel,
  heightCm,
  parents,
}: {
  sex: Sex;
  r: ReturnType<typeof assess>;
  ageLabel: string;
  heightCm: number;
  parents: { target: number; low: number; high: number } | null;
}) {
  const tone = BAND_TONE[r.band];
  const v = verdict(r.band, sex);
  const centile = Math.max(0.1, Math.min(99.9, r.centile));
  const centileLabel = centile < 1 ? "below the 1st" : centile > 99 ? "above the 99th" : `${Math.round(centile)}`;
  const lower = heightAtZ(sex, r.ageDays, -2);
  const upper = heightAtZ(sex, r.ageDays, 2);

  return (
    <div>
      <div className={cn("rounded-2xl border p-6", TONE_STYLES[tone])}>
        <p className={cn("font-display text-xl leading-tight sm:text-2xl", TONE_TITLE[tone])}>
          {v.title}
        </p>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">{v.body}</p>
      </div>

      <dl className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
        <div className="bg-paper p-5">
          <dt className="label">Height</dt>
          <dd className="font-display mt-1.5 text-2xl">{heightCm.toFixed(1)} cm</dd>
          <p className="mt-1 text-[0.8rem] text-ink-faint">
            at {ageLabel}
          </p>
        </div>
        <div className="bg-paper p-5">
          <dt className="label">Centile</dt>
          <dd className="font-display mt-1.5 text-2xl text-marigold">{centileLabel}</dd>
          <p className="mt-1 text-[0.8rem] text-ink-faint">
            {centile >= 1 && centile <= 99
              ? `Taller than about ${Math.round(centile)} in 100 ${sex} the same age`
              : `${centile < 1 ? "Shorter" : "Taller"} than almost all ${sex} the same age`}
          </p>
        </div>
        <div className="bg-paper p-5">
          <dt className="label">Usual range here</dt>
          <dd className="font-display mt-1.5 text-2xl">
            {lower.toFixed(0)}&ndash;{upper.toFixed(0)}
          </dd>
          <p className="mt-1 text-[0.8rem] text-ink-faint">
            cm, for {sex} of this exact age
          </p>
        </div>
      </dl>

      <div className="mt-5 rounded-2xl border border-line bg-paper p-5 sm:p-6">
        <CentileChart sex={sex} ageDays={r.ageDays} heightCm={heightCm} reference={r.reference} />
      </div>

      {parents && (
        <div className="mt-5 rounded-2xl border border-line bg-paper p-5 sm:p-6">
          <p className="label">Genetic height target</p>
          <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-muted">
            From these parents, an adult height of about{" "}
            <strong className="font-medium text-ink">{parents.target.toFixed(0)} cm</strong> would be
            expected, and anywhere from {parents.low.toFixed(0)} to {parents.high.toFixed(0)} cm is
            within the usual spread. This is a rough guide, not a prediction. It assumes both parents
            reached their own potential, and it says nothing on its own about whether growth is
            healthy. What it does help with is context: a child who is short but heading towards a
            short target is a different conversation from one who is not.
          </p>
        </div>
      )}

      <details className="mt-5 rounded-2xl border border-line bg-paper">
        <summary className="label cursor-pointer list-none p-5 text-ink-muted">
          Numbers to show the doctor
        </summary>
        <div className="border-t border-line p-5 pt-4">
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {[
              ["Z score (SD score)", `${r.z >= 0 ? "+" : ""}${r.z.toFixed(2)}`],
              ["Exact centile", `${centile.toFixed(1)}`],
              ["Median for this age", `${r.median.toFixed(1)} cm`],
              ["Age used", `${r.ageYears.toFixed(2)} years (${r.ageDays} days)`],
              [
                "Reference",
                r.reference === "who"
                  ? "WHO Child Growth Standards 2006"
                  : "IAP 2015 (Khadilkar et al.)",
              ],
              [
                "Measured as",
                r.posture === "length" ? "Recumbent length" : "Standing height",
              ],
            ].map(([k, val]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 border-b border-line-soft pb-2">
                <dt className="text-[0.85rem] text-ink-muted">{k}</dt>
                <dd className="font-mono text-[0.8rem] text-ink">{val}</dd>
              </div>
            ))}
          </dl>
        </div>
      </details>

      {tone !== "ok" && (
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/contact#book"
            className="inline-flex h-11 items-center justify-center rounded-full bg-marigold px-5 text-[0.9rem] font-medium text-white transition-colors hover:bg-ink hover:text-paper dark:text-paper"
          >
            Book an appointment
          </Link>
          {contact.whatsappHref && (
            <a
              href={contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full border border-line px-5 text-[0.9rem] text-ink transition-colors hover:border-marigold hover:text-marigold"
            >
              Ask on WhatsApp
            </a>
          )}
          <Link
            href="/blog/short-stature-when-to-worry"
            className="inline-flex h-11 items-center justify-center rounded-full border border-line px-5 text-[0.9rem] text-ink transition-colors hover:border-marigold hover:text-marigold"
          >
            Read about short stature
          </Link>
        </div>
      )}
    </div>
  );
}
