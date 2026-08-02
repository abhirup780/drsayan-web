import { clinics, contact, outreachClinics, site } from "@/lib/site";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is authored by us, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Physician + MedicalClinic graph, emitted once from the root layout. */
export function PersonJsonLd() {
  const physicianId = `${site.url}/#physician`;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": ["Physician", "Person"],
            "@id": physicianId,
            name: site.name,
            honorificPrefix: "Dr.",
            url: site.url,
            image: `${site.url}/portraits/portrait-hero.jpg`,
            jobTitle: site.role,
            medicalSpecialty: "PediatricEndocrinology",
            description: site.description,
            telephone: contact.phoneDisplay,
            email: contact.email,
            // Kolkata is the base; the monthly OPDs are why families in the
            // districts can find him at all, so every town is listed.
            areaServed: [
              { "@type": "City", name: "Kolkata" },
              ...outreachClinics.map((clinic) => ({ "@type": "City", name: clinic.town })),
              { "@type": "State", name: "West Bengal" },
            ],
            knowsAbout: [
              "Short stature",
              "Growth hormone deficiency",
              "Type 1 diabetes in children",
              "Congenital hypothyroidism",
              "Precocious puberty",
              "Congenital adrenal hyperplasia",
              "Polycystic ovary syndrome in adolescents",
              "Childhood obesity",
              "Rickets and metabolic bone disease",
            ],
            alumniOf: [
              {
                "@type": "CollegeOrUniversity",
                name: "Postgraduate Institute of Medical Education and Research (PGIMER), Chandigarh",
              },
              {
                "@type": "CollegeOrUniversity",
                name: "R. G. Kar Medical College & Hospital, Kolkata",
              },
            ],
            hasCredential: [
              {
                "@type": "EducationalOccupationalCredential",
                credentialCategory: "degree",
                name: "DM (Paediatric Endocrinology), PGIMER Chandigarh",
              },
              {
                "@type": "EducationalOccupationalCredential",
                credentialCategory: "certification",
                name: "Fellowship in Paediatric Endocrinology, Regency CDER Kanpur",
              },
              {
                "@type": "EducationalOccupationalCredential",
                credentialCategory: "degree",
                name: "MD (Paediatric Medicine), R. G. Kar Medical College, Kolkata",
              },
              {
                "@type": "EducationalOccupationalCredential",
                credentialCategory: "degree",
                name: "MBBS, R. G. Kar Medical College & Hospital, Kolkata",
              },
            ],
            worksFor: [
              ...clinics.map((clinic) => ({
                "@type": "MedicalClinic",
                name: clinic.name,
                address: {
                  "@type": "PostalAddress",
                  streetAddress: clinic.addressLines.join(", "),
                  addressLocality: "New Town, Kolkata",
                  addressRegion: "West Bengal",
                  addressCountry: "IN",
                },
              })),
              ...outreachClinics.map((clinic) => ({
                "@type": "MedicalClinic",
                name: clinic.centre,
                telephone: clinic.phoneDisplay,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: clinic.town,
                  addressRegion: "West Bengal",
                  addressCountry: "IN",
                },
              })),
            ],
          },
          {
            "@type": "MedicalClinic",
            "@id": `${site.url}/#clinic`,
            name: clinics[0].name,
            url: contact.bookingUrl,
            image: `${site.url}/portraits/portrait-hero.jpg`,
            telephone: contact.phoneDisplay,
            email: contact.email,
            medicalSpecialty: "PediatricEndocrinology",
            address: {
              "@type": "PostalAddress",
              streetAddress: clinics[0].addressLines.slice(1).join(", "),
              addressLocality: "New Town, Kolkata",
              addressRegion: "West Bengal",
              postalCode: "700156",
              addressCountry: "IN",
            },
            // No `openingHoursSpecification` until the OPD timings are
            // confirmed with the hospital. Publishing guessed hours here
            // would surface them in Google and send families at the wrong
            // time; omitting the field is the honest default.
            physician: { "@id": physicianId },
          },
          {
            "@type": "WebSite",
            "@id": `${site.url}/#website`,
            url: site.url,
            name: site.name,
            inLanguage: "en-IN",
            publisher: { "@id": physicianId },
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${site.url}/blog?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          },
        ],
      }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  date,
  updated,
  image,
  tags,
  readingTime,
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
  updated?: string;
  image?: string;
  tags: string[];
  readingTime: string;
}) {
  const url = `${site.url}/blog/${slug}`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        "@id": url,
        url,
        headline: title,
        description,
        datePublished: date,
        dateModified: updated ?? date,
        inLanguage: "en-IN",
        image: image ? `${site.url}${image}` : `${site.url}/portraits/portrait-hero.jpg`,
        keywords: tags.join(", "),
        timeRequired: readingTime,
        author: { "@id": `${site.url}/#physician` },
        publisher: { "@id": `${site.url}/#physician` },
        reviewedBy: { "@id": `${site.url}/#physician` },
        isPartOf: { "@id": `${site.url}/#website` },
        mainEntityOfPage: url,
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; href: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: `${site.url}${item.href}`,
        })),
      }}
    />
  );
}

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }}
    />
  );
}
