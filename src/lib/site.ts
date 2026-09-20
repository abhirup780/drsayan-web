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

  // The live domain. Production sets NEXT_PUBLIC_SITE_URL and that wins, but
  // this is the same value so a missing env var degrades to correct canonical
  // URLs rather than to a domain that was never registered.
  return "https://www.drsayan.in";
}

const resolvedUrl = resolveSiteUrl();

/**
 * True once the site is being served from its real domain.
 *
 * While it is still on a *.vercel.app preview URL, the whole site is marked
 * `noindex`: otherwise Google indexes the preview and it ends up competing
 * with the real domain for the practice's own name. Sharing the link is
 * unaffected — it only stops search engines filing it away.
 *
 * Set `NEXT_PUBLIC_SITE_URL` to the live domain and indexing turns itself on.
 */
export const isCanonicalDomain = !resolvedUrl.includes(".vercel.app");

export const site = {
  name: "Dr. Sayan Banerjee",
  role: "Paediatric & Adolescent Endocrinologist",
  shortRole: "Paediatric Endocrinologist",
  qualifications: "MBBS, MD (Paediatrics), DM (Paediatric Endocrinology)",
  city: "Kolkata",
  url: resolvedUrl,
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

/**
 * Search engine ownership verification.
 *
 * Bing is already verified by the file at public/BingSiteAuth.xml. Google
 * needs a token, which is issued per-property and cannot be invented:
 *
 *   1. Open https://search.google.com/search-console
 *   2. Add a property of type "URL prefix" for https://www.drsayan.in
 *      (the www form — that is what the site actually serves)
 *   3. Choose the "HTML tag" method. Google shows a meta tag like
 *      <meta name="google-site-verification" content="AbC123..." />
 *   4. Paste only the content value below, then deploy and press Verify.
 *
 * While it is null no tag is emitted, which is correct: an empty or wrong
 * verification tag is worse than none, because Google records a failed
 * attempt against the property.
 *
 * Verification is what makes Search Console show which queries the site
 * actually ranks for. Without it there is no measurement.
 */
export const verification = {
  google: null as string | null,
} as const;

export const contact = {
  phoneDisplay: "033 6640 5000",
  phoneHref: "tel:+913366405000",
  /**
   * The practice's own address, and the one every "write to us" link and the
   * appointment form point at. This is the inbox Dr. Banerjee reads.
   */
  email: "drsayanpedendo@gmail.com",
  emailHref: "mailto:drsayanpedendo@gmail.com",
  /**
   * The hospital's own front-desk address, kept separate on purpose.
   *
   * It belongs to Neotia, not to this practice, so it is what the
   * `MedicalClinic` node in structured data advertises. Publishing a personal
   * address as the hospital's contact point would be wrong in both
   * directions — it misdirects hospital business and it puts a private inbox
   * into Google's record of the hospital.
   */
  hospitalEmail: "connect.bnwccc@neotiahealthcare.com",
  hospitalEmailHref: "mailto:connect.bnwccc@neotiahealthcare.com",
  /**
   * The hospital's own profile page handles appointment booking.
   * Swap in a different platform here and every "Book" button follows.
   */
  bookingUrl: "https://newtown.neotiahospital.com/doctor/dr-sayan-banerjee",
  /**
   * WhatsApp, straight to Dr. Banerjee rather than to a hospital desk.
   *
   * This is the preferred first contact, so it leads every list of channels
   * on the site. The number is deliberately not published as a `tel:` link:
   * it is a messaging line, and inviting voice calls to it would set the
   * wrong expectation about how quickly a reply arrives.
   */
  whatsappHref: "https://wa.me/919836665566" as string | null,
  whatsappDisplay: "+91 98366 65566" as string | null,
  /**
   * The Google Business Profile — "Dr Sayan Banerjee | D.M Paediatric
   * Endocrinologist | New Town". This is the listing families actually find
   * when they search his name, so it carries the map pin, the reviews and the
   * directions link.
   *
   * Addressed by CID — the listing's permanent numeric id — rather than by a
   * share.google short link or a /maps/place/ URL carrying session state.
   * Both of those rot; the CID does not.
   */
  googleProfileUrl: "https://maps.google.com/?cid=8757713119497602764",
} as const;

/**
 * Profiles that belong to this practice, emitted as `sameAs` in structured
 * data. This is what lets Google connect drsayan.in to the Business Profile
 * it already knows about, rather than treating them as two unrelated things.
 *
 * Only add a URL here if the practice genuinely controls or is the subject of
 * it. `sameAs` is an identity claim, not a bookmark list.
 */
export const sameAsProfiles: string[] = [
  contact.googleProfileUrl,
  contact.bookingUrl,
  // The hospital channels that host his talks. Not his own channels, but he
  // is the named subject of the videos on them.
  "https://www.youtube.com/@NBWCC_NewTown",
  "https://www.youtube.com/@neotiabhagirathiwomanandch6167",
  // TODO: add the practice's Facebook page URL once confirmed. The reel at
  // facebook.com/reel/1673437530543871 is a post, not a profile, so it does
  // not belong in `sameAs` — it belongs in `mediaAppearances` below.
];

/* ── Media & press ───────────────────────────────────────────────── */

/**
 * Talks and press appearances, newest first.
 *
 * `video` items get a click-to-load YouTube embed on /media; `press` items are
 * plain outbound links. Nothing here is reproduced beyond a headline and a
 * short attributed quote — the traffic goes to the publisher, as it should.
 */
export type MediaAppearance = {
  id: string;
  kind: "video" | "press";
  outlet: string;
  title: string;
  /**
   * ISO date, used for display and for `subjectOf` structured data.
   *
   * `null` where the publication date is genuinely unknown — YouTube does not
   * expose an upload date through oEmbed. A guessed date would be published
   * verbatim into structured data, so absence is the honest option; both the
   * card and the schema simply omit the date.
   */
  date: string | null;
  url: string;
  /** BCP-47 tag. Bengali items are marked so screen readers pronounce them. */
  lang: "en" | "bn";
  /** A short, attributed pull quote. Never more than a sentence or two. */
  quote?: string;
  byline?: string;
  /** `video` only: the YouTube id and the locally-served poster frame. */
  videoId?: string;
  poster?: string;
  /** A one-line note in our own words on why the piece matters to a parent. */
  note: string;
};

export const mediaAppearances: MediaAppearance[] = [
  {
    id: "news18-juvenile-diabetes",
    kind: "press",
    outlet: "News18 Bengali",
    title:
      "জুভেনাইল ডায়াবিটিসে আক্রান্ত ছিলেন নায়িকা সোনম কাপুর, কোন কোন উপসর্গ বুঝিয়ে দেয় আপনার খুদের ব্লাড সুগার বেশি? জানাচ্ছেন চিকিৎসক",
    date: "2026-07-03",
    url: "https://bengali.news18.com/photogallery/life-style/diabetes-in-children-early-signs-of-juvenile-diabetes-every-parent-should-know-according-to-a-doctor-rm-2788280.html",
    lang: "bn",
    byline: "Rukmini Mazumder",
    quote:
      "শিশুদের ক্ষেত্রে ডায়াবেটিসের অন্যতম বড় লক্ষণগুলির মধ্যে একটি হল সবসময় ক্লান্ত লাগা বা শরীরে কোনওরকম কাজ করার এনার্জি না পাওয়া।",
    note: "The early signs of type 1 diabetes in children, in Bengali.",
  },
  {
    id: "telegraph-milk-health-drinks",
    kind: "press",
    outlet: "The Telegraph · My Kolkata",
    title:
      "Plain milk or health drinks for kids? Doctors explain what really supports healthy growth",
    date: "2026-06-29",
    url: "https://www.telegraphindia.com/my-kolkata/lifestyle/milk-or-health-drinks-what-do-kolkata-doctors-recommend-for-kids/cid/2167755",
    lang: "en",
    byline: "Jaismita Alexander",
    quote: "There is no easy shortcut to healthy growth.",
    note: "Why no malt drink outgrows a child's own genetic potential.",
  },
  {
    id: "video-bengali-growth",
    kind: "video",
    outlet: "Sonoscan Air",
    title: "শিশুর Growth থেমে যাচ্ছে? কারণ, লক্ষণ ও সমাধান",
    // TODO: set the real upload date from the channel listing.
    date: null,
    url: "https://www.youtube.com/watch?v=i_9_vvDV7J4",
    lang: "bn",
    videoId: "i_9_vvDV7J4",
    poster: "/media/video-bengali-growth.jpg",
    note: "উচ্চতা বাড়া থেমে গেলে পিছনে কী কারণ থাকতে পারে, আর কখন ডাক্তার দেখানো দরকার — সহজ বাংলায়।",
  },
  {
    id: "video-bengali-thyroid",
    kind: "video",
    outlet: "Health Inside | বাংলা",
    title:
      "বাচ্চার থাইরয়েডের সমস্যা বুঝবেন কীভাবে বাচ্চার হাইপোথাইরয়েডিজমের সমস্যা ধরা পড়লে কি করবেন?",
    // TODO: set the real upload date from the channel listing.
    date: null,
    url: "https://www.youtube.com/watch?v=Qxk3RsSCPfM",
    lang: "bn",
    videoId: "Qxk3RsSCPfM",
    poster: "/media/video-bengali-thyroid.jpg",
    note: "জন্মগত হাইপোথাইরয়েডিজম কীভাবে ধরা পড়ে, স্ক্রিনিং কেন জরুরি, আর ধরা পড়লে চিকিৎসা কী — সহজ বাংলায়।",
  },
  {
    id: "video-dka-silent-emergency",
    kind: "video",
    outlet: "Neotia Bhagirathi Woman & Child Care Centre",
    title: "Diabetic Ketoacidosis in Children: A Silent Emergency",
    // TODO: set the real upload date from the YouTube studio listing.
    date: null,
    url: "https://www.youtube.com/watch?v=m_vGX4euRqQ",
    lang: "en",
    videoId: "m_vGX4euRqQ",
    poster: "/media/video-dka-silent-emergency.jpg",
    note: "How DKA hides in plain sight, and the signs that mean go now.",
  },
  {
    id: "video-diabetes-in-children",
    kind: "video",
    outlet: "Neotia Bhagirathi Woman & Child Care Centre",
    title: "Diabetes in Children",
    // TODO: set the real upload date from the YouTube studio listing.
    date: null,
    url: "https://www.youtube.com/watch?v=Z-STc2vakjI",
    lang: "en",
    videoId: "Z-STc2vakjI",
    poster: "/media/video-diabetes-in-children.jpg",
    note: "An introduction for families who have just heard the diagnosis.",
  },
  {
    id: "video-bengali-podcast-diabetes",
    kind: "video",
    outlet: "Health Inside | বাংলা",
    title:
      "বাচ্চাদের ডায়াবেটিসের লক্ষণ ও চিকিৎসা | বাচ্চাদের ডায়াবেটিস হলে কী করণীয়?",
    // TODO: set the real upload date from the channel listing.
    date: null,
    url: "https://www.youtube.com/watch?v=qshIsQyrAOQ",
    lang: "bn",
    videoId: "qshIsQyrAOQ",
    poster: "/media/video-bengali-podcast-diabetes.jpg",
    note: "টাইপ ১ ডায়াবিটিসের প্রাথমিক লক্ষণ আর বাড়িতে কী করণীয়, বাংলায়।",
  },
  // TODO: the Facebook reel at facebook.com/reel/1673437530543871 is not
  // listed yet — Facebook requires a login to read it, so its date, caption
  // and whether it is his own clip or a hospital repost are all unconfirmed.
  // Fill those in and add it here as a `press` item.
];

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
  /** Decimal degrees, taken from the Google Business Profile's own pin. */
  geo?: { lat: number; lng: number };
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
    // The Business Profile's own pin, not a name search. A search URL can
    // land on the wrong building; a CID lands on the exact listing.
    mapsUrl: "https://maps.google.com/?cid=8757713119497602764",
    phoneDisplay: "033 6640 5000",
    phoneHref: "tel:+913366405000",
    geo: { lat: 22.5801151, lng: 88.4754942 },
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
  { href: "/growth-check", label: "Height check" },
  { href: "/about", label: "About" },
  { href: "/conditions", label: "Conditions" },
  { href: "/visit", label: "Your Visit" },
  { href: "/resources", label: "Resources" },
  { href: "/blog", label: "Blog" },
  { href: "/publications", label: "Publications" },
  { href: "/media", label: "Media" },
] as const;

/** The Bengali summary of the whole site, linked from the header. */
export const bengaliPage = { href: "/bn", label: "বাংলা" } as const;

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
