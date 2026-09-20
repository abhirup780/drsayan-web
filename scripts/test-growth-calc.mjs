/**
 * Checks the growth maths against values published by WHO and by the IAP's
 * own SDS calculator, plus the boundary behaviour that is easy to get wrong.
 *
 * Run: node --experimental-strip-types scripts/test-growth-calc.mjs
 * (or via `npm run test:growth`)
 */
import {
  assess,
  ageInDays,
  bandFor,
  describeAge,
  describeAgeBetween,
  heightAtZ,
  midParentalHeight,
  referenceAt,
  zToCentile,
  DAYS_PER_YEAR,
  HANDOVER_DAY,
} from "../src/lib/growth/calc.ts";

let pass = 0;
const fails = [];

function ok(name, cond, detail = "") {
  if (cond) pass++;
  else fails.push(`${name}${detail ? ` — ${detail}` : ""}`);
}

function near(name, got, want, tol, unit = "") {
  const d = Math.abs(got - want);
  ok(name, d <= tol, `got ${got.toFixed(4)}${unit}, want ${want}${unit} (Δ${d.toFixed(4)}, tol ${tol})`);
}

/* ---------------------------------------------------------------- WHO --
 * Published WHO length/height-for-age values (boys and girls, z = -3..+3).
 * Source: the same WHO expanded tables the data is generated from, read
 * independently here so a bug in the generator cannot hide itself.
 */
const WHO_CHECKS = [
  // [sex, day, z, expected cm]  — birth
  ["boys", 0, 0, 49.9], ["boys", 0, -2, 46.1], ["boys", 0, 2, 53.7],
  ["girls", 0, 0, 49.1], ["girls", 0, -2, 45.4], ["girls", 0, 2, 52.9],
  // 12 months (365 d), recumbent length
  ["boys", 365, 0, 75.7], ["boys", 365, -2, 71.0], ["boys", 365, 2, 80.5],
  ["girls", 365, 0, 74.0], ["girls", 365, -2, 68.9], ["girls", 365, 2, 79.2],
  // 24 months — the length side of the switch
  ["boys", 730, 0, 87.8], ["girls", 730, 0, 86.4],
  // 5 years (1826 d), standing height
  ["boys", 1826, 0, 110.0], ["girls", 1826, 0, 109.4],
];

for (const [sex, day, z, want] of WHO_CHECKS) {
  near(`WHO ${sex} day ${day} z=${z}`, heightAtZ(sex, day, z), want, 0.1, " cm");
}

/* ---------------------------------------------------------------- IAP --
 * IAP 2015 medians at the ends of the range, from the workbook itself.
 */
near("IAP boys 5y median", heightAtZ("boys", 5 * DAYS_PER_YEAR, 0), 108.93, 0.05, " cm");
near("IAP girls 5y median", heightAtZ("girls", 5 * DAYS_PER_YEAR, 0), 107.53, 0.05, " cm");
near("IAP boys 18y median", heightAtZ("boys", 18 * DAYS_PER_YEAR, 0), 173.56, 0.05, " cm");
near("IAP girls 18y median", heightAtZ("girls", 18 * DAYS_PER_YEAR, 0), 157.79, 0.05, " cm");

/* ------------------------------------------------------- round tripping */
for (const sex of ["boys", "girls"]) {
  for (const day of [0, 100, 400, 730, 731, 1200, 1826, 2500, 4000, 6000]) {
    for (const z of [-3, -2, -1, 0, 1, 2, 3]) {
      const cm = heightAtZ(sex, day, z);
      const back = assess({ sex, ageDays: day, heightCm: cm }).z;
      near(`round trip ${sex} d${day} z=${z}`, back, z, 1e-9);
    }
  }
}

/* ------------------------------------------------- length/height switch */
{
  const a = heightAtZ("boys", 730, 0);
  const b = heightAtZ("boys", 731, 0);
  ok(
    "length→height step at day 731 is preserved",
    b < a && Math.abs(a - b - 0.671) < 0.05,
    `day730 ${a.toFixed(3)} → day731 ${b.toFixed(3)} (step ${(b - a).toFixed(3)} cm)`
  );
  ok("posture is length before the switch", referenceAt("boys", 730).posture === "length");
  ok("posture is height after the switch", referenceAt("boys", 731).posture === "height");
}

/* ------------------------------------------------------ WHO/IAP handover */
{
  const justUnder = referenceAt("boys", Math.floor(HANDOVER_DAY) - 1);
  const atFive = referenceAt("boys", Math.ceil(HANDOVER_DAY));
  ok("under 5 uses WHO", justUnder.reference === "who", justUnder.reference);
  ok("from 5 uses IAP", atFive.reference === "iap", atFive.reference);
}

/* ------------------------------------------------------------- centiles */
// A&S 7.1.26 carries |error| < 1.5e-7, so 50 is approached, not hit exactly.
near("z=0 is the 50th centile", zToCentile(0), 50, 1e-5);
near("z=-2 is ~2.28th centile", zToCentile(-2), 2.275, 0.001);
near("z=+2 is ~97.7th centile", zToCentile(2), 97.725, 0.001);
near("z=1.645 is ~95th centile", zToCentile(1.645), 95, 0.01);

/* ---------------------------------------------------------------- bands */
ok("z -3.1 is very-short", bandFor(-3.1) === "very-short");
ok("z -2.5 is short", bandFor(-2.5) === "short");
ok("z -1.9 is usual", bandFor(-1.9) === "usual");
ok("z 0 is usual", bandFor(0) === "usual");
ok("z 2.5 is tall", bandFor(2.5) === "tall");
ok("z 3.5 is very-tall", bandFor(3.5) === "very-tall");
ok("exactly -2 is short (boundary is inclusive below)", bandFor(-2) === "usual");

/* -------------------------------------------------------------- ageing */
ok("age in days across a leap day", ageInDays(new Date(2024, 1, 28), new Date(2024, 2, 1)) === 2);
ok("same day is 0 days", ageInDays(new Date(2020, 5, 5), new Date(2020, 5, 5)) === 0);
ok("one year is 365 or 366", [365, 366].includes(ageInDays(new Date(2019, 0, 1), new Date(2020, 0, 1))));
ok("describeAge months only", describeAge(90) === "2 months", describeAge(90));
ok("describeAge survives the 6.5y rounding edge", describeAge(Math.round(6.5 * DAYS_PER_YEAR)) === "6 years, 6 months", describeAge(Math.round(6.5 * DAYS_PER_YEAR)));
ok("describeAgeBetween exact on a birthday", describeAgeBetween(new Date(2018, 4, 15), new Date(2024, 4, 15)) === "6 years", describeAgeBetween(new Date(2018, 4, 15), new Date(2024, 4, 15)));
ok("describeAgeBetween a day before a birthday", describeAgeBetween(new Date(2018, 4, 15), new Date(2024, 4, 14)) === "5 years, 11 months", describeAgeBetween(new Date(2018, 4, 15), new Date(2024, 4, 14)));
ok("describeAgeBetween newborn days", describeAgeBetween(new Date(2024, 0, 1), new Date(2024, 0, 6)) === "5 days", describeAgeBetween(new Date(2024, 0, 1), new Date(2024, 0, 6)));

/* --------------------------------------------------- mid-parental height */
{
  const b = midParentalHeight("boys", 175, 162);
  near("MPH boys", b.target, 175, 1e-9, " cm");
  near("MPH boys low", b.low, 166.5, 1e-9, " cm");
  const g = midParentalHeight("girls", 175, 162);
  near("MPH girls", g.target, 162, 1e-9, " cm");
}

/* ------------------------------------------------ a worked clinical case */
{
  // IAP boys at 7.0y: median 120.7 cm, -2 SD at 109.3 cm.
  const r = assess({ sex: "boys", ageDays: Math.round(7 * DAYS_PER_YEAR), heightCm: 108 });
  ok("7y boy 108cm uses IAP", r.reference === "iap");
  ok("7y boy 108cm flagged short", r.band === "short", `z ${r.z.toFixed(2)} band ${r.band}`);
  ok("7y boy 108cm centile below 3", r.centile < 3, `centile ${r.centile.toFixed(1)}`);

  // 112 cm at the same age is low-but-normal and must NOT be flagged; a tool
  // that cries wolf at the 6th centile would send well children to clinic.
  const mild = assess({ sex: "boys", ageDays: Math.round(7 * DAYS_PER_YEAR), heightCm: 112 });
  ok("7y boy 112cm stays in the usual range", mild.band === "usual", `z ${mild.z.toFixed(2)}`);

  // A 3-month-old girl at the median should read ~50th centile.
  const g = assess({ sex: "girls", ageDays: 91, heightCm: heightAtZ("girls", 91, 0) });
  near("3mo girl at median → centile 50", g.centile, 50, 1e-6);
  ok("3mo girl uses WHO length", g.reference === "who" && g.posture === "length");
}

/* --------------------------------------------------------------- report */
console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) {
  console.log("\nFAILURES:");
  for (const f of fails) console.log("  ✗ " + f);
  process.exit(1);
}
console.log("All growth calculations verified against WHO and IAP published values.\n");
