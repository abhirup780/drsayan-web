import {
  clinics,
  contact,
  mediaAppearances,
  outreachClinics,
  sameAsProfiles,
  site,
} from "@/lib/site";

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
            // Ties this site to the Google Business Profile and the hospital
            // channels, so Google treats them as one entity rather than
            // several competing ones with the same name.
            sameAs: sameAsProfiles,
            // Press and talks he is the named subject of. Deliberately no
            // `aggregateRating` anywhere in this graph: self-published review
            // markup is against Google's guidelines and risks a manual
            // action. The Google profile carries the real reviews.
            subjectOf: mediaAppearances.map((item) => ({
              "@type": item.kind === "video" ? "VideoObject" : "NewsArticle",
              name: item.title,
              headline: item.title,
              url: item.url,
              ...(item.date ? { datePublished: item.date } : {}),
              inLanguage: item.lang === "bn" ? "bn-IN" : "en-IN",
              publisher: { "@type": "Organization", name: item.outlet },
              ...(item.videoId
                ? {
                    thumbnailUrl: `${site.url}${item.poster}`,
                    embedUrl: `https://www.youtube-nocookie.com/embed/${item.videoId}`,
                  }
                : {}),
            })),
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
            // The hospital's own front desk, not the practice inbox: this
            // node describes Neotia, and Google files it against the hospital.
            email: contact.hospitalEmail,
            medicalSpecialty: "PediatricEndocrinology",
            address: {
              "@type": "PostalAddress",
              streetAddress: clinics[0].addressLines.slice(1).join(", "),
              addressLocality: "New Town, Kolkata",
              addressRegion: "West Bengal",
              postalCode: "700156",
              addressCountry: "IN",
            },
            ...(clinics[0].geo
              ? {
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: clinics[0].geo.lat,
                    longitude: clinics[0].geo.lng,
                  },
                  hasMap: clinics[0].mapsUrl,
                }
              : {}),
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

/**
 * The /media page as a collection, with each talk and press piece as an item.
 *
 * `VideoObject` is what puts a video thumbnail beside the result in search.
 * `uploadDate` is omitted where we do not know it rather than guessed —
 * Google would publish the guess.
 */
export function MediaJsonLd() {
  const url = `${site.url}/media`;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": url,
        url,
        name: "Media & press",
        inLanguage: "en-IN",
        isPartOf: { "@id": `${site.url}/#website` },
        about: { "@id": `${site.url}/#physician` },
        hasPart: mediaAppearances.map((item) =>
          item.kind === "video"
            ? {
                "@type": "VideoObject",
                name: item.title,
                description: item.note,
                url: item.url,
                thumbnailUrl: `${site.url}${item.poster}`,
                embedUrl: `https://www.youtube-nocookie.com/embed/${item.videoId}`,
                ...(item.date ? { uploadDate: item.date } : {}),
                inLanguage: "en-IN",
                publisher: { "@type": "Organization", name: item.outlet },
                about: { "@id": `${site.url}/#physician` },
              }
            : {
                "@type": "NewsArticle",
                headline: item.title,
                url: item.url,
                ...(item.date ? { datePublished: item.date } : {}),
                inLanguage: item.lang === "bn" ? "bn-IN" : "en-IN",
                publisher: { "@type": "Organization", name: item.outlet },
                ...(item.byline
                  ? { author: { "@type": "Person", name: item.byline } }
                  : {}),
                mentions: { "@id": `${site.url}/#physician` },
              }
        ),
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
