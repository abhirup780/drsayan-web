/**
 * Peer-reviewed publications, newest first.
 *
 * Kept as structured fields rather than pre-formatted citation strings so the
 * page can group by year, mark first authorship, and link DOIs without
 * parsing prose. `authors` is stored as written on the paper; the page bolds
 * Dr. Banerjee's name at render time rather than marking it up here.
 *
 * `doi` is the bare identifier, never a URL — the page builds the
 * https://doi.org/… link. A DOI is the stable handle; publisher URLs move.
 */
export type Publication = {
  authors: string;
  title: string;
  journal: string;
  detail: string;
  year: number;
  doi?: string;
  /** True where he is the first-listed author. */
  first?: boolean;
};

export const publications: Publication[] = [
  {
    authors: "Bala A, Banerjee S, George A, Srivastava P, Kumar M, KC N, Yadav J, et al.",
    title:
      "Rare types of congenital adrenal hyperplasia: report of five children with 11β-hydroxylase deficiency including pathogenic and novel CYP11B1 variants",
    journal: "Archives of Endocrinology and Metabolism",
    detail: "2026 Jul 3;70(5):e260073",
    year: 2026,
    doi: "10.20945/2359-4292-2026-0073",
  },
  {
    authors: "Yadav V, Bajpai A, Banerjee S, et al.",
    title:
      "Development and Validation of Puberty Interpreter, a Mobile Clinical Decision-Support Tool for Pubertal Disorders",
    journal: "Indian Journal of Pediatrics",
    detail: "2026;93:815–819",
    year: 2026,
    doi: "10.1007/s12098-026-06265-y",
  },
  {
    authors: "Kotthurthi K, Bala A, Banerjee S, et al.",
    title:
      "Zoledronic Acid as a Therapeutic Option for Hypercalcemia in Subcutaneous Fat Necrosis: Series of Four Infants",
    journal: "Journal of Neonatology",
    detail: "2026",
    year: 2026,
    doi: "10.1177/09732179261431375",
  },
  {
    authors:
      "Nanda PM, Banerjee S, Yadav A, Dayal D, George A, Panigrahi I, Kumar R, Bala A, Yadav J",
    title:
      "Clinical Profile and Response to Recombinant Growth Hormone in Girls with Turner Syndrome: Experience from a Tertiary Care Centre in North India",
    journal: "Indian Journal of Endocrinology and Metabolism",
    detail: "2026;30(1):102–106",
    year: 2026,
    doi: "10.4103/ijem.ijem_348_24",
  },
  {
    authors: "Banerjee S, George A, Bala A, et al.",
    title: "Assessing the Role of Delta Copeptin in the Evaluation of SIAD and CSW",
    journal: "Indian Journal of Pediatrics",
    detail: "2026;93:357–362",
    year: 2026,
    doi: "10.1007/s12098-025-05890-3",
    first: true,
  },
  {
    authors: "Dayal D, Raha SJ, Banerjee S, Bala A, Kumar R, Sukhija J, Raj S, Yadav J",
    title:
      "Cataract in children with type 1 diabetes: a single-center experience from North India on an underrecognized complication",
    journal: "Journal of Pediatric Endocrinology and Metabolism",
    detail: "2026;39(2):173–177",
    year: 2026,
    doi: "10.1515/jpem-2025-0387",
  },
  {
    authors: "Banerjee S, Pathak PP, Sharma R, et al.",
    title:
      "CANDID Study: Clinical and Molecular Characterization of Congenital Arginine Vasopressin-Resistance and the Use of a Novel Diagnostic Biomarker in Indian Children",
    journal: "Indian Journal of Pediatrics",
    detail: "2026;93:162–167",
    year: 2026,
    doi: "10.1007/s12098-025-05446-5",
    first: true,
  },
  {
    authors:
      "Kumar R, Dayal D, George A, Banerjee S, Yadav J, Govier M, Mohan V, Radha V",
    title:
      "Neonatal Diabetes: 20-Year Experience from a Tertiary Care Pediatric Diabetes Clinic in North India",
    journal: "Hormone Research in Paediatrics",
    detail: "2025 Sep 9:1–12",
    year: 2025,
    doi: "10.1159/000548390",
  },
  {
    authors: "Banerjee S, Soyal Y, Thunga C, et al.",
    title: "Congenital Lactase Deficiency, An Unusual Cause of Infantile Hypercalcemia",
    journal: "Indian Journal of Pediatrics",
    detail: "2025;92:863–865",
    year: 2025,
    doi: "10.1007/s12098-025-05621-8",
    first: true,
  },
  {
    authors: "Bala A, Ghai B, George A, Banerjee S, Kumar M, Dayal D",
    title:
      "Caudal epidural steroid injection as a novel therapy for treatment-induced neuropathy of diabetes in children: report of two cases",
    journal: "Journal of Pediatric Endocrinology and Metabolism",
    detail: "2025;38(9):986–990",
    year: 2025,
    doi: "10.1515/jpem-2025-0005",
  },
  {
    authors:
      "George A, Rallapalli A, Nanda PM, Peters M, Banerjee S, Bala A, Panigrahi I, Kumar R, Yadav J, Dayal D",
    title:
      "Clinical and genetic insights into congenital lipoid adrenal hyperplasia: a case series from a tertiary care center in North India",
    journal: "Journal of Pediatric Endocrinology and Metabolism",
    detail: "2025;38(6):644–648",
    year: 2025,
    doi: "10.1515/jpem-2024-0624",
  },
  {
    authors: "Banerjee S, George A, Nanda P, et al.",
    title:
      "Clinical and molecular spectrum of genetic hypertriglyceridaemia in North Indian children: a case series",
    journal: "Pediatric Endocrinology Diabetes and Metabolism",
    detail: "2025;31(1):25–29",
    year: 2025,
    doi: "10.5114/pedm.2025.148401",
    first: true,
  },
  {
    authors: "Raha SJ, Banerjee S, Bala A, et al.",
    title: "Seizures due to Autosomal Dominant Hypocalcemia-Type 1",
    journal: "Indian Journal of Pediatrics",
    detail: "2025;92:563",
    year: 2025,
    doi: "10.1007/s12098-025-05501-1",
  },
  {
    authors: "Panigrahi I, George A, Bala A, Farzana N, Banerjee S, Dayal D",
    title: "Dunnigan-type Familial Partial Lipodystrophy in a North Indian Kindred",
    journal: "Bangladesh Journal of Endocrinology and Metabolism",
    detail: "2025;4(2):91–96",
    year: 2025,
    doi: "10.4103/bjem.bjem_39_24",
  },
  {
    authors: "Dwivedi A, George A, Banerjee S, et al.",
    title: "Peripheral Precocious Puberty in a Toddler Unmasking a Hepatoblastoma",
    journal: "Indian Journal of Pediatrics",
    detail: "2025;92:450",
    year: 2025,
    doi: "10.1007/s12098-025-05454-5",
  },
  {
    authors: "Bala A, George A, Banerjee S, et al.",
    title:
      "Supplementation of High-Strength Oral Probiotics Improves Immune Regulation and Preserves Beta Cells among Children with New-Onset Type 1 Diabetes Mellitus: A Randomised, Double-Blind Placebo Control Trial: Correspondence",
    journal: "Indian Journal of Pediatrics",
    detail: "2025;92:318",
    year: 2025,
    doi: "10.1007/s12098-024-05243-6",
  },
  {
    authors: "Akanksha, Banerjee S, Bala A, et al.",
    title: "Atypical Presentation of Distal Renal Tubular Acidosis in a Child",
    journal: "Indian Journal of Pediatrics",
    detail: "2025;92:97",
    year: 2025,
    doi: "10.1007/s12098-024-05307-7",
  },
  {
    authors: "Arora S, Banerjee S, George A, Bala A, Thingnam SKS, Rohit MK, Dayal D",
    title:
      "Dramatic response to Evinacumab in a North Indian girl with homozygous familial hypercholesterolemia",
    journal: "Journal of Pediatric Endocrinology and Metabolism",
    detail: "2025;38(3):305–309",
    year: 2025,
    doi: "10.1515/jpem-2024-0506",
  },
  {
    authors: "Das A, Banerjee S, George A, et al.",
    title: "Urethral Polyp Mimicking Precocious Puberty",
    journal: "Indian Journal of Pediatrics",
    detail: "2024;91:1313",
    year: 2024,
    doi: "10.1007/s12098-024-05242-7",
  },
  {
    authors: "Sagar R, Banerjee S, Yadav J, et al.",
    title:
      "Psychological Assessment of Mothers of Indian Children with Differences of Sex Development",
    journal: "Indian Pediatrics",
    detail: "2024;61:1039–1042",
    year: 2024,
    doi: "10.1007/s13312-024-3313-y",
  },
  {
    authors:
      "George A, Navi S, Nanda PM, Daniel R, Anand K, Banerjee S, Panigrahi I, Dayal D",
    title:
      "Clinical and molecular characterisation of children with monogenic obesity: a case series",
    journal: "Pediatric Endocrinology Diabetes and Metabolism",
    detail: "2024;30(2):104–109",
    year: 2024,
    doi: "10.5114/pedm.2024.140934",
  },
  {
    authors: "Nanda PM, Banerjee S, George A, et al.",
    title: "Pseudohypertriglyceridemia: A Diagnostic Conundrum",
    journal: "Indian Journal of Pediatrics",
    detail: "2024;91:993",
    year: 2024,
    doi: "10.1007/s12098-024-05142-w",
  },
  {
    authors: "Banerjee S, Bajpai A",
    title: "Precocious Puberty",
    journal: "Indian Journal of Pediatrics",
    detail: "2023;90:582–589",
    year: 2023,
    doi: "10.1007/s12098-023-04554-4",
    first: true,
  },
  {
    authors: "Verma P, Banerjee S, Baskey U, et al.",
    title:
      "Clinicopathological alteration of symptoms with serotype among dengue infected pediatric patients",
    journal: "Journal of Medical Virology",
    detail: "2022;94:4348–4358",
    year: 2022,
    doi: "10.1002/jmv.27862",
  },
  {
    authors: "Das P, Banerjee S, Roy A",
    title:
      "Glossopharyngeal and Vagus Nerve Palsy in a Child With Scrub Typhus Meningitis",
    journal: "Indian Pediatrics",
    detail: "2021;58:81–82",
    year: 2021,
    doi: "10.1007/s13312-021-2103-z",
  },
  {
    authors: "Das G, Das P, Banerjee S",
    title: "Michelin Tire Baby Syndrome and Achondroplasia: A Rare Association",
    journal: "Indian Journal of Paediatric Dermatology",
    detail: "2020;21(2):147–149",
    year: 2020,
    doi: "10.4103/ijpd.IJPD_100_19",
  },
];

/** Publications grouped by year, newest year first. */
export function publicationsByYear() {
  const years = [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a);
  return years.map((year) => ({
    year,
    items: publications.filter((p) => p.year === year),
  }));
}

export const publicationStats = {
  total: publications.length,
  firstAuthor: publications.filter((p) => p.first).length,
  earliest: Math.min(...publications.map((p) => p.year)),
  latest: Math.max(...publications.map((p) => p.year)),
  journals: new Set(publications.map((p) => p.journal)).size,
};
