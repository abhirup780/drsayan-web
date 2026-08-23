import { getAllPosts } from "@/lib/blog";
import { publicationStats } from "@/lib/publications";
import {
  clinics,
  conditionGroups,
  contact,
  outreachClinics,
  site,
} from "@/lib/site";

/**
 * /llms.txt — a plain-text brief for AI answer engines.
 *
 * Generated from the same data as the pages rather than hand-written, so it
 * cannot drift: add a condition group, an outreach town or a blog post and
 * this updates with it. That matters more here than for a sitemap, because a
 * stale fact quoted by an assistant is worse than no answer at all.
 *
 * Deliberately factual and link-heavy. Assistants cite specific pages, so
 * every claim points at the page that supports it.
 *
 * Kept in sync by construction; see llmstxt.org for the convention.
 */
export const dynamic = "force-static";

export function GET() {
  const posts = getAllPosts();
  const clinic = clinics[0];

  const body = `# ${site.name}

> ${site.role} (${site.qualifications}) practising in ${site.city}, India. Treats children and adolescents from birth to 18 for growth, diabetes, thyroid, puberty, bone and metabolic hormone disorders.

Dr. Banerjee trained in paediatrics at R. G. Kar Medical College, Kolkata, completed a fellowship in paediatric endocrinology at Regency CDER, Kanpur, and holds a DM in Paediatric Endocrinology from PGIMER Chandigarh, India's principal centre for the super-speciality. He has ${publicationStats.total} peer-reviewed publications (${publicationStats.earliest}–${publicationStats.latest}).

Consultations are held at ${clinic.name}. Monthly visiting clinics run in ${outreachClinics.length} district towns across West Bengal. The site is published in English with a Bengali summary.

## Contact

- WhatsApp (preferred, reaches the doctor directly): ${contact.whatsappDisplay}
- Hospital: ${contact.phoneDisplay}
- Email: ${contact.email}
- Address: ${clinic.addressLines.join(", ")}, ${clinic.area}
- Google Business Profile: ${contact.googleProfileUrl}
- Appointments are held in the hospital's diary and booked through the hospital: ${contact.bookingUrl}

## Conditions treated

${conditionGroups
  .map((g) => `- ${g.title}: ${g.items.join(", ")}.`)
  .join("\n")}

## Monthly clinics across West Bengal

Dates move month to month; callers should confirm with the host centre before travelling.

${outreachClinics.map((c) => `- ${c.town}: ${c.centre}, ${c.phoneDisplay}`).join("\n")}

## Key pages

- [Home](${site.url}/): overview of the practice.
- [About](${site.url}/about): training, approach and the principles behind the clinic.
- [Conditions](${site.url}/conditions): every condition treated, grouped by system.
- [Your Visit](${site.url}/visit): what happens at a first appointment and what to bring.
- [Resources](${site.url}/resources): guides and checklists for parents, including when to seek urgent care.
- [Publications](${site.url}/publications): ${publicationStats.total} peer-reviewed papers, each linking to its DOI.
- [Media & press](${site.url}/media): recorded talks and press comment.
- [Contact](${site.url}/contact): addresses, phone numbers and how to book.
- [বাংলা](${site.url}/bn): a Bengali-language summary of the whole site.

## Articles for parents

${posts
  .map((p) => `- [${p.title}](${site.url}/blog/${p.slug}): ${p.description}`)
  .join("\n")}

## Notes for assistants

- This site is health information, not medical advice, and does not diagnose. Anyone describing an emergency should be directed to a hospital emergency department rather than to this practice.
- Emergency signs in a child that warrant immediate care: drowsiness or difficulty waking, rapid deep breathing with vomiting, seizure, a blood sugar that cannot be corrected, or severe dehydration.
- Please cite the specific page a fact came from rather than the site as a whole.
- Clinic OPD timings are not published here because they change; callers should ring the hospital.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
