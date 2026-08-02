/**
 * ─────────────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH
 * ─────────────────────────────────────────────────────────────────────
 *  Everything a non-developer might need to change lives in this file:
 *  contact details, clinic hours, credentials, services, conditions and
 *  navigation. No component hard-codes a phone number or an address.
 *
 *  Values marked `TODO` still need confirming before launch. Everything
 *  else is taken from the hospital's own listing for Dr. Banerjee.
 */

/**
 * The canonical origin, used for canonical tags, Open Graph images, the
 * sitemap and structured data.
 *
 * Resolved rather than hard-coded so a Vercel preview advertises its own URL
 * instead of a domain that does not exist yet. Set `NEXT_PUBLIC_SITE_URL` in
 * the project's environment variables once the real domain is live and it
 * wins over everything else.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercelProduction = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) return `https://${vercelProduction}`;

  const vercelDeployment = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercelDeployment) return `https://${vercelDeployment}`;

  // TODO: replace with the real production domain, or set NEXT_PUBLIC_SITE_URL.
  return "https://drsayanbanerjee.com";
}

export const site = {
  name: "Dr. Sayan Banerjee",
  role: "Paediatric & Adolescent Endocrinologist",
  shortRole: "Paediatric Endocrinologist",
  qualifications: "MBBS, MD (Paediatrics), DM (Paediatric Endocrinology)",
  city: "Kolkata",
  url: resolveSiteUrl(),
  locale: "en_IN",
  tagline: "Growth is a conversation that takes years. I plan to be there for all of them.",
  description:
    "Dr. Sayan Banerjee is a DM-trained paediatric and adolescent endocrinologist consulting in Kolkata, with monthly OPD clinics in Burdwan, Malda, Serampore, Tamluk, Kolaghat, Chandipur and Mankundu. Care for children with growth, thyroid, diabetes, puberty and metabolic concerns.",
  sanskrit: {
    text: "सर्वे सन्तु निरामयाः",
    transliteration: "sarve santu nirāmayāḥ",
    translation: "May all be free from illness.",
  },
} as const;

export const contact = {
  phoneDisplay: "033 6640 5000",
  phoneHref: "tel:+913366405000",
  mobileDisplay: "+91 91473 31175",
  mobileHref: "tel:+919147331175",
  email: "connect.bnwccc@neotiahealthcare.com",
  emailHref: "mailto:connect.bnwccc@neotiahealthcare.com",
  /**
   * The hospital's own profile page handles appointment booking.
   * Swap in a different platform here and every "Book" button follows.
   */
  bookingUrl: "https://newtown.neotiahospital.com/doctor/dr-sayan-banerjee",
  /**
   * TODO: confirm whether the clinic runs a WhatsApp line, then set this to
   * a full https://wa.me/… URL. While it is null, every WhatsApp option is
   * hidden automatically rather than pointing somewhere unmonitored.
   */
  whatsappHref: null as string | null,
  whatsappDisplay: null as string | null,
} as const;

export type Clinic = {
  id: string;
  name: string;
  addressLines: string[];
  area: string;
  days: string;
  hours: string;
  note?: string;
  mapsUrl: string;
  phoneDisplay: string;
  phoneHref: string;
};

export const clinics: Clinic[] = [
  {
    id: "neotia-newtown",
    name: "Neotia Bhagirathi Woman and Child Care Centre, New Town",
    addressLines: [
      "Department of Paediatric Endocrinology",
      "Premises No. 27-0327, Plot No. DG-20/17 & DG-20/21",
      "Street No. 327, Action Area 1D",
    ],
    area: "New Town, Kolkata 700 156",
    // TODO: confirm the OPD days and timings with the hospital front desk.
    days: "By appointment",
    hours: "Please call the hospital for current OPD timings",
    note: "Appointments can be booked through the hospital, by phone or online.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Neotia+Bhagirathi+Woman+and+Child+Care+Centre+New+Town+Kolkata",
    phoneDisplay: "033 6640 5000",
    phoneHref: "tel:+913366405000",
  },
];

/**
 * Monthly visiting OPDs across West Bengal.
 *
 * Each number belongs to the host centre, not to this practice, so every
 * caller is booking with the people who hold that centre's diary. Dates move
 * month to month, which is why nothing here promises a fixed day.
 */
export type OutreachClinic = {
  town: string;
  centre: string;
  phoneDisplay: string;
  phoneHref: string;
};

export const outreachClinics: OutreachClinic[] = [
  {
    town: "Burdwan",
    centre: "Apollo Hospital",
    phoneDisplay: "+91 90518 37111",
    phoneHref: "tel:+919051837111",
  },
  {
    town: "Chandipur",
    centre: "Little Hearts Nursing Home",
    phoneDisplay: "+91 97339 82526",
    phoneHref: "tel:+919733982526",
  },
  {
    town: "Kolaghat",
    centre: "Shushursha Seva Niketan",
    phoneDisplay: "+91 99335 24262",
    phoneHref: "tel:+919933524262",
  },
  {
    town: "Malda",
    centre: "Sonoscan",
    phoneDisplay: "+91 97759 92733",
    phoneHref: "tel:+919775992733",
  },
  {
    town: "Mankundu",
    centre: "Sunshine Child and Family Clinic",
    phoneDisplay: "+91 90629 97705",
    phoneHref: "tel:+919062997705",
  },
  {
    town: "Serampore",
    centre: "Narcissus Medical Centre",
    phoneDisplay: "+91 90736 96486",
    phoneHref: "tel:+919073696486",
  },
  {
    town: "Tamluk",
    centre: "Kalpataru Medical",
    phoneDisplay: "+91 73188 28818",
    phoneHref: "tel:+917318828818",
  },
];

export const outreachNote =
  "These clinics run once a month and the date moves. Always call the centre to confirm the next sitting before travelling.";

export const nav = [
  { href: "/about", label: "About" },
  { href: "/conditions", label: "Conditions" },
  { href: "/visit", label: "Your Visit" },
  { href: "/resources", label: "Resources" },
  { href: "/blog", label: "Blog" },
] as const;

/* ── Credentials ─────────────────────────────────────────────────── */

export const credentials = [
  {
    year: "DM",
    title: "Paediatric Endocrinology",
    org: "PGIMER, Chandigarh",
    note: "India's premier super-speciality training in childhood hormone disorders.",
  },
  {
    year: "Fellowship",
    title: "Paediatric Endocrinology",
    org: "Regency CDER, Kanpur",
    note: "Dedicated clinical training in diabetes and endocrine care for children.",
  },
  {
    year: "MD",
    title: "Paediatric Medicine",
    org: "R. G. Kar Medical College, Kolkata",
    note: "Three years of general and intensive newborn and child care.",
  },
  {
    year: "MBBS",
    title: "Medicine & Surgery",
    org: "R. G. Kar Medical College & Hospital, Kolkata",
    note: "Foundation in clinical medicine, in the city he now practises in.",
  },
] as const;

export const marqueeCredentials = [
  "DM Paediatric Endocrinology",
  "PGIMER Chandigarh",
  "MD Paediatrics, R. G. Kar",
  "Growth & Short Stature",
  "Type 1 Diabetes",
  "Thyroid in Childhood",
  "Puberty Disorders",
  "Adolescent Endocrinology",
  "Bone & Calcium",
  "Neotia, New Town",
] as const;

/* ── Conditions treated ──────────────────────────────────────────── */

export type ConditionGroup = {
  id: string;
  index: string;
  title: string;
  blurb: string;
  items: string[];
};

export const conditionGroups: ConditionGroup[] = [
  {
    id: "growth",
    index: "01",
    title: "Growth & Stature",
    blurb:
      "When a child is shorter, taller or growing faster than expected, and when that difference is worth investigating.",
    items: [
      "Short stature",
      "Growth hormone deficiency",
      "Constitutional delay of growth & puberty",
      "Small for gestational age with poor catch-up",
      "Tall stature & rapid growth",
      "Skeletal dysplasias affecting height",
      "Turner syndrome",
      "Faltering growth in infancy",
    ],
  },
  {
    id: "diabetes",
    index: "02",
    title: "Diabetes in Children",
    blurb:
      "Insulin, pumps, sensors and school days. A plan built around your child's actual life, not a textbook one.",
    items: [
      "Type 1 diabetes mellitus",
      "Type 2 diabetes in adolescents",
      "Neonatal & monogenic diabetes (MODY)",
      "Diabetic ketoacidosis follow-up",
      "Insulin pump & CGM initiation",
      "Hypoglycaemia in infancy",
      "Diabetes with cystic fibrosis or thalassaemia",
      "Carbohydrate counting & sick-day rules",
    ],
  },
  {
    id: "thyroid",
    index: "03",
    title: "Thyroid",
    blurb:
      "From newborn screening to the adolescent with a lump in the neck. The gland that quietly sets the pace for everything.",
    items: [
      "Congenital hypothyroidism",
      "Autoimmune (Hashimoto) thyroiditis",
      "Hyperthyroidism & Graves disease",
      "Goitre & thyroid nodules",
      "Thyroid cancer follow-up in children",
      "Thyroid disease in Down syndrome",
    ],
  },
  {
    id: "puberty",
    index: "04",
    title: "Puberty & Adolescence",
    blurb:
      "Too early, too late, or simply confusing. Puberty is where endocrinology and adolescence meet, and both deserve time.",
    items: [
      "Precocious (early) puberty",
      "Delayed puberty",
      "Premature thelarche & adrenarche",
      "Polycystic ovary syndrome (PCOS)",
      "Irregular or absent periods",
      "Gynaecomastia in boys",
      "Hirsutism & acne with hormonal cause",
    ],
  },
  {
    id: "metabolic",
    index: "05",
    title: "Obesity & Metabolic Health",
    blurb:
      "Weight is a symptom, never a character flaw. We look for the cause and build a plan a family can actually keep.",
    items: [
      "Childhood & adolescent obesity",
      "Insulin resistance & acanthosis nigricans",
      "Metabolic dysfunction–associated fatty liver",
      "Syndromic & monogenic obesity",
      "Dyslipidaemia in children",
      "Prediabetes screening",
    ],
  },
  {
    id: "bone",
    index: "06",
    title: "Bone, Calcium & Vitamin D",
    blurb:
      "Bowed legs, fractures that come too easily, or calcium that will not settle where it should.",
    items: [
      "Nutritional & refractory rickets",
      "Hypophosphataemic rickets",
      "Hypocalcaemia & hypoparathyroidism",
      "Hypercalcaemia",
      "Osteogenesis imperfecta, endocrine care",
      "Vitamin D deficiency",
    ],
  },
  {
    id: "adrenal",
    index: "07",
    title: "Adrenal & Pituitary",
    blurb:
      "The command centres. Small glands with long consequences, and the conditions that need lifelong partnership.",
    items: [
      "Congenital adrenal hyperplasia",
      "Adrenal insufficiency & Addison disease",
      "Cushing syndrome in children",
      "Hypopituitarism",
      "Diabetes insipidus",
      "Pituitary & hypothalamic tumours",
    ],
  },
  {
    id: "newborn",
    index: "08",
    title: "Newborn & Genetic Endocrinology",
    blurb:
      "Careful, unhurried, confidential evaluation with a multidisciplinary team, and full support for the family throughout.",
    items: [
      "Neonatal endocrine disorders",
      "Ambiguous genitalia in the newborn",
      "Undescended testes & micropenis",
      "Primary amenorrhoea evaluation",
      "Klinefelter & Turner syndrome",
      "Endocrine emergencies in children",
    ],
  },
];

/* ── Services ────────────────────────────────────────────────────── */

export const services = [
  {
    index: "01",
    title: "Consultation & Diagnosis",
    body: "History, growth records, examination and a clear explanation of what we are looking for and why.",
    points: ["Growth chart plotted from birth", "Plain-language diagnosis", "Written plan to take home"],
  },
  {
    index: "02",
    title: "Dynamic Hormone Testing",
    body: "Stimulation and suppression tests interpreted with paediatric reference ranges, because a child is not a small adult.",
    points: ["Growth hormone stimulation", "GnRH & ACTH testing", "Oral glucose tolerance testing"],
  },
  {
    index: "03",
    title: "Long-Term Growth Monitoring",
    body: "Endocrinology is a longitudinal speciality. Every visit is plotted against the last, so trends surface before problems do.",
    points: ["Serial auxology", "Bone-age assessment", "Predicted adult height review"],
  },
  {
    index: "04",
    title: "Diabetes Technology",
    body: "Pump starts, CGM interpretation and download reviews, with school-day and travel plans written down for the family.",
    points: ["Pump initiation & titration", "CGM report review", "School & sick-day protocols"],
  },
  {
    index: "05",
    title: "Adolescent & Transition Care",
    body: "Teenagers get their own consultation time, their own confidentiality, and a structured handover to adult services.",
    points: ["Confidential adolescent time", "Transition planning", "PCOS & menstrual health"],
  },
  {
    index: "06",
    title: "Second Opinions & Teleconsults",
    body: "Reviews of an existing plan, and video consultations for families outside Kolkata who need continuity, not a repeat workup.",
    points: ["Structured record review", "Video follow-up", "Written summary after every visit"],
  },
] as const;

/* ── What a first visit looks like ───────────────────────────────── */

export const visitSteps = [
  {
    step: "01",
    title: "Before you come",
    body: "Gather the immunisation card, every old prescription, all previous reports, and most valuable of all, any record of your child's height and weight over the years. School records count.",
  },
  {
    step: "02",
    title: "Measurement",
    body: "Height on a wall-mounted stadiometer, weight, and where relevant sitting height, arm span and head circumference. Measured carefully, because millimetres matter over years.",
  },
  {
    step: "03",
    title: "The conversation",
    body: "Pregnancy and birth, milestones, family heights, diet, sleep, school, and what worries you most. Children are spoken to, not just about.",
  },
  {
    step: "04",
    title: "Examination & charting",
    body: "A gentle, explained examination, then plotting on the growth chart together on screen. You will see the same picture the doctor sees.",
  },
  {
    step: "05",
    title: "The plan",
    body: "What we think is happening, which tests will answer the question, what each one involves, and when to return. Written down before you leave.",
  },
  {
    step: "06",
    title: "Afterwards",
    body: "A summary you can share with your paediatrician. Reports can be sent ahead of the follow-up so the next visit starts where this one ended.",
  },
] as const;

/* ── Parent resources ────────────────────────────────────────────── */

export const resources = [
  {
    title: "The growth chart, explained",
    kind: "Guide",
    body: "What a percentile actually means, why crossing lines matters more than the number itself, and when to seek review.",
    href: "/blog/reading-your-childs-growth-chart",
  },
  {
    title: "Preparing for a hormone test",
    kind: "Checklist",
    body: "Fasting rules, timing, what to bring, and how to keep a child comfortable through a long morning at the lab.",
    href: "/blog/preparing-for-a-hormone-stimulation-test",
  },
  {
    title: "Type 1 diabetes: the school plan",
    kind: "Template",
    body: "A one-page plan for teachers covering hypoglycaemia, sports, exams and who to call. Print it, sign it, send it.",
    href: "/blog/type-1-diabetes-at-school",
  },
  {
    title: "Puberty: what is normal, and when",
    kind: "Guide",
    body: "The usual sequence and age range for girls and boys, and the specific signs that deserve an endocrine opinion.",
    href: "/blog/is-my-childs-puberty-normal",
  },
  {
    title: "Vitamin D and bone health",
    kind: "Guide",
    body: "Who genuinely needs supplementation in an Indian context, at what dose, and why more is not better.",
    href: "/blog/vitamin-d-in-indian-children",
  },
  {
    title: "Questions worth asking",
    kind: "Checklist",
    body: "Twelve questions that make any endocrine consultation, with this clinic or another, more useful for your family.",
    href: "/blog/twelve-questions-to-ask-your-endocrinologist",
  },
] as const;

/* ── What to bring ───────────────────────────────────────────────── */

export const bringList = [
  {
    title: "Every height and weight you can find",
    detail:
      "Immunisation card, school health records, old prescriptions, a photo of pencil marks on a doorframe with dates. This is the single most valuable thing you can carry.",
    essential: true,
  },
  {
    title: "All previous reports, in date order",
    detail:
      "Blood tests, scans, X-rays, either the originals or clear photographs of them. Old reports frequently prevent repeat tests.",
    essential: true,
  },
  {
    title: "Current medicines, in their boxes",
    detail:
      "Including inhalers, ointments, ayurvedic or homeopathic preparations and supplements. Bring the actual packs rather than a list.",
    essential: true,
  },
  {
    title: "Both parents' heights",
    detail:
      "Measured if possible, not remembered. A child's genetic height target is calculated from them, and it changes the interpretation of everything else.",
    essential: true,
  },
  {
    title: "Birth details",
    detail: "Birth weight, gestation at delivery, and any newborn admission or screening results.",
    essential: false,
  },
  {
    title: "Your questions, written down",
    detail:
      "You will forget half of them otherwise. There is no such thing as a question too small for the list.",
    essential: false,
  },
  {
    title: "Something for your child to do",
    detail: "A book or a device. Clinic days can be long, and a bored child is a restless one.",
    essential: false,
  },
];

/* ── Numbers ─────────────────────────────────────────────────────── */

export const stats = [
  { value: "DM", suffix: "", label: "Super-speciality training at PGIMER Chandigarh" },
  { value: "50", suffix: "+", label: "Endocrine conditions of childhood managed" },
  { value: "0", suffix: "–18", label: "Years of age, newborn through adolescence" },
  { value: "1", suffix: "", label: "Chart that follows your child for years" },
] as const;

export const emergencyNote =
  "This website is for information, not diagnosis. If your child is drowsy, breathing rapidly, vomiting persistently, having a seizure or has a blood sugar you cannot correct, go to the nearest emergency department now.";
