// The explicit extension lets this module run under plain `node
// --experimental-strip-types` as well as through Next, so the clinical maths
// can be tested without a bundler. Next documents this tsconfig setting.
import { LMS } from "./lms-data.ts";

/**
 * Height-for-age maths for the growth checker.
 *
 * Pure functions, no React, no DOM: everything here is unit-testable and is
 * exercised by scripts/test-growth-calc.mjs against values published by WHO
 * and by the IAP's own SDS calculator.
 *
 * Two references are stitched together because neither covers childhood on
 * its own. Under 5 the WHO Child Growth Standards apply; from 5 the IAP 2015
 * Indian reference does. They are different kinds of thing — WHO is a
 * prescriptive standard built from children raised in optimal conditions,
 * IAP a descriptive reference of how Indian children actually grew — so a
 * child measured either side of their fifth birthday can shift by roughly a
 * centimetre of median. That is a property of the charts, not an error, and
 * the UI says which one it used.
 */

export type Sex = "boys" | "girls";

/** Which chart a result came from, and whether it assumes length or height. */
export type Reference = "who" | "iap";
export type Posture = "length" | "height";

export type GrowthResult = {
  z: number;
  centile: number;
  reference: Reference;
  posture: Posture;
  ageDays: number;
  ageYears: number;
  /** Median height for this age and sex, in cm. */
  median: number;
  band: Band;
};

export type Band =
  | "very-short"
  | "short"
  | "usual"
  | "tall"
  | "very-tall";

/* ------------------------------------------------------------------ LMS */

/** Height (cm) -> z. The LMS transform; L = 0 collapses to the log form. */
function lmsToZ(L: number, M: number, S: number, x: number): number {
  return Math.abs(L) < 1e-9
    ? Math.log(x / M) / S
    : (Math.pow(x / M, L) - 1) / (L * S);
}

/** z -> height (cm). The inverse, used to draw the centile bands. */
function lmsToX(L: number, M: number, S: number, z: number): number {
  return Math.abs(L) < 1e-9
    ? M * Math.exp(S * z)
    : M * Math.pow(1 + L * S * z, 1 / L);
}

/* ------------------------------------------------------------------ age */

export const DAYS_PER_YEAR = 365.25;
/** The WHO/IAP handover, in days. */
export const HANDOVER_DAY = 5 * DAYS_PER_YEAR;

/** Whole days between two dates, ignoring time of day and DST. */
export function ageInDays(dob: Date, on: Date): number {
  const a = Date.UTC(dob.getFullYear(), dob.getMonth(), dob.getDate());
  const b = Date.UTC(on.getFullYear(), on.getMonth(), on.getDate());
  return Math.round((b - a) / 86_400_000);
}

/**
 * "6 years, 4 months" from a day count, for display.
 *
 * The epsilon is not cosmetic. A child of exactly 6.5 years is 2374.125 days,
 * which rounds to 2374 and divides to 77.996 months — flooring that would
 * show "6 years, 5 months" to a parent who knows the birthday. Half a day of
 * slack absorbs the rounding without ever promoting a genuine 5-month-old.
 *
 * `describeAgeBetween` is exact where both dates are known; prefer it.
 */
export function describeAge(ageDays: number): string {
  const months = Math.floor(ageDays / (DAYS_PER_YEAR / 12) + 0.02);
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return m === 1 ? "1 month" : `${m} months`;
  const yPart = y === 1 ? "1 year" : `${y} years`;
  if (m === 0) return yPart;
  return `${yPart}, ${m === 1 ? "1 month" : `${m} months`}`;
}

/**
 * Exact calendar age between two dates, for display.
 *
 * Counts whole months on the calendar rather than dividing days, so a child
 * born on the 15th is "6 years, 0 months" on every 15th and never a month
 * out because of leap years or a 28-day February.
 */
export function describeAgeBetween(dob: Date, on: Date): string {
  let years = on.getFullYear() - dob.getFullYear();
  let months = on.getMonth() - dob.getMonth();
  if (on.getDate() < dob.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years === 0) {
    if (months === 0) {
      const days = ageInDays(dob, on);
      return days === 1 ? "1 day" : `${days} days`;
    }
    return months === 1 ? "1 month" : `${months} months`;
  }
  const yPart = years === 1 ? "1 year" : `${years} years`;
  if (months === 0) return yPart;
  return `${yPart}, ${months === 1 ? "1 month" : `${months} months`}`;
}

/* --------------------------------------------------------- table lookup */

type Lms = { L: number; M: number; S: number };

/**
 * WHO parameters at a given day.
 *
 * The table is two separate segments: recumbent length to day 730, standing
 * height from day 731, where WHO bakes in a -0.7 cm adjustment. Interpolating
 * across that step would describe a child who shrinks overnight, so a day is
 * resolved strictly inside one segment.
 */
function whoAt(sex: Sex, ageDays: number): { lms: Lms; posture: Posture } {
  const segments = LMS.who[sex] as readonly (readonly (readonly number[])[])[];
  const isLength = ageDays < LMS.who.switchDay;
  const seg = isLength ? segments[0] : segments[1];
  const day = Math.min(Math.max(ageDays, seg[0][0]), seg[seg.length - 1][0]);

  let i = 0;
  while (i < seg.length - 2 && seg[i + 1][0] <= day) i++;
  const a = seg[i];
  const b = seg[Math.min(i + 1, seg.length - 1)];
  const t = b[0] === a[0] ? 0 : (day - a[0]) / (b[0] - a[0]);

  return {
    // WHO height-for-age uses L = 1 at every age, so only M and S vary.
    lms: { L: 1, M: a[1] + t * (b[1] - a[1]), S: a[2] + t * (b[2] - a[2]) },
    posture: isLength ? "length" : "height",
  };
}

/** IAP parameters at a decimal age, interpolated between monthly rows. */
function iapAt(sex: Sex, ageYears: number): Lms {
  const ages = LMS.iap.ages as readonly number[];
  const rows = LMS.iap[sex] as readonly (readonly number[])[];
  const age = Math.min(Math.max(ageYears, ages[0]), ages[ages.length - 1]);

  let i = 0;
  while (i < ages.length - 2 && ages[i + 1] <= age) i++;
  const a = rows[i];
  const b = rows[Math.min(i + 1, rows.length - 1)];
  const span = ages[Math.min(i + 1, ages.length - 1)] - ages[i];
  const t = span === 0 ? 0 : (age - ages[i]) / span;

  return {
    L: a[0] + t * (b[0] - a[0]),
    M: a[1] + t * (b[1] - a[1]),
    S: a[2] + t * (b[2] - a[2]),
  };
}

/** The reference and parameters that apply at a given age. */
export function referenceAt(
  sex: Sex,
  ageDays: number
): { lms: Lms; reference: Reference; posture: Posture } {
  if (ageDays < HANDOVER_DAY) {
    const { lms, posture } = whoAt(sex, ageDays);
    return { lms, reference: "who", posture };
  }
  return {
    lms: iapAt(sex, ageDays / DAYS_PER_YEAR),
    reference: "iap",
    posture: "height",
  };
}

/* ----------------------------------------------------------- statistics */

/**
 * Normal CDF via Abramowitz & Stegun 7.1.26, |error| < 1.5e-7 — far finer
 * than a centile printed as a whole number.
 */
export function zToCentile(z: number): number {
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-x * x);
  return 50 * (1 + sign * y);
}

/* ------------------------------------------------------------- banding */

/**
 * Cut-offs are the standard ones, and match those the IAP's own SDS
 * calculator documents on its instructions sheet: stunted below -2 SD,
 * severely stunted below -3 SD, tall above +2 SD.
 *
 * The upper end is split further because this is an endocrinologist's site:
 * WHO notes that height above +3 SD is rarely a problem in itself but can
 * point to an endocrine cause, which is exactly the case worth reviewing.
 */
export function bandFor(z: number): Band {
  if (z < -3) return "very-short";
  if (z < -2) return "short";
  if (z > 3) return "very-tall";
  if (z > 2) return "tall";
  return "usual";
}

/* --------------------------------------------------------------- public */

export const MIN_AGE_DAYS = 0;
export const MAX_AGE_DAYS = Math.round(18 * DAYS_PER_YEAR);

export type GrowthInput = {
  sex: Sex;
  ageDays: number;
  heightCm: number;
};

export function assess({ sex, ageDays, heightCm }: GrowthInput): GrowthResult {
  const { lms, reference, posture } = referenceAt(sex, ageDays);
  const z = lmsToZ(lms.L, lms.M, lms.S, heightCm);
  return {
    z,
    centile: zToCentile(z),
    reference,
    posture,
    ageDays,
    ageYears: ageDays / DAYS_PER_YEAR,
    median: lms.M,
    band: bandFor(z),
  };
}

/** Height in cm at a given z, for drawing centile curves. */
export function heightAtZ(sex: Sex, ageDays: number, z: number): number {
  const { lms } = referenceAt(sex, ageDays);
  return lmsToX(lms.L, lms.M, lms.S, z);
}

/* ------------------------------------------- mid-parental target height */

/**
 * Tanner mid-parental height: the band a child's genetic potential points at.
 *
 * Boys  (father + mother + 13) / 2
 * Girls (father + mother - 13) / 2
 *
 * The +-8.5 cm band is the conventional target range. It is a rough guide,
 * not a prediction: it assumes both parents reached their own potential, and
 * it says nothing on its own about whether growth is healthy. It earns its
 * place here because a child who is short but tracking towards a short
 * target is a different conversation from one who is not.
 */
export const MPH_SPREAD = 8.5;

export function midParentalHeight(
  sex: Sex,
  fatherCm: number,
  motherCm: number
): { target: number; low: number; high: number } {
  const target = (fatherCm + motherCm + (sex === "boys" ? 13 : -13)) / 2;
  return { target, low: target - MPH_SPREAD, high: target + MPH_SPREAD };
}
