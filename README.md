# Dr. Sayan Banerjee · Paediatric Endocrinology, Kolkata

A production-ready personal practice website. Next.js 16 (App Router) · React 19 · TypeScript ·
Tailwind CSS v4 · Motion · MDX.

**Live:** <https://dr-sayan-website.vercel.app>

```bash
npm install
npm run dev      # http://localhost:3000
npm run check    # typecheck + lint + production build
npx vercel --prod   # deploy
```

### Going live on the real domain

The site works out what its own canonical URL is, so a shared preview advertises itself correctly
rather than a domain that does not exist yet. Two things happen automatically when the real domain
is attached:

1. Add the domain in the Vercel project, then set `NEXT_PUBLIC_SITE_URL` to it (for example
   `https://drsayanbanerjee.com`) in the project's environment variables and redeploy.
2. Canonical tags, Open Graph images, the sitemap and structured data all follow that value.

**While the site is on a `*.vercel.app` URL it is deliberately `noindex` and `robots.txt` disallows
everything.** Sharing the link is unaffected; it only stops Google filing the preview away, where it
would later compete with the real domain for the practice's own name. Setting `NEXT_PUBLIC_SITE_URL`
turns indexing on.

---

## ⚠ Before you go live

Contact details, credentials and the clinic address are real, taken from the hospital's own
listing. Three things still need confirming. Search the repo for `TODO`; all of them sit in
**[`src/lib/site.ts`](src/lib/site.ts)**.

| What | Where | Why it is not filled in |
| --- | --- | --- |
| Production domain | `site.url` | Not chosen yet |
| Kolkata OPD days and timings | `clinics[0].days` / `.hours` | The hospital page does not publish them |
| WhatsApp line | `contact.whatsappHref` | Unknown whether one exists and is monitored |
| Which day of the month each visiting OPD runs | `outreachClinics` | Dates move, so the site tells families to ring the centre |

Until `whatsappHref` is set it stays `null`, and **every WhatsApp option hides itself
automatically** rather than pointing at an unmonitored number. Set it to a full `https://wa.me/…`
URL to switch them all on.

Opening hours are deliberately **absent from the structured data** too. Publishing guessed hours
would surface them in Google and send families at the wrong time, so `openingHoursSpecification`
stays out until the real timings are known.

That file is the single source of truth. **No component hard-codes a phone number or an address.**
Change it once and the header, footer, contact page, visit page, booking band, structured data and
the appointment form all update together.

### Where the practice details came from

- **MBBS and MD (Paediatric Medicine):** R. G. Kar Medical College & Hospital, Kolkata
- **Fellowship in Paediatric Endocrinology:** Regency CDER, Kanpur
- **DM (Paediatric Endocrinology):** PGIMER, Chandigarh
- **Consults at:** Neotia Bhagirathi Woman and Child Care Centre, New Town, Kolkata
- **Monthly visiting OPDs:** Burdwan, Chandipur, Kolaghat, Malda, Mankundu, Serampore, Tamluk

`contact.bookingUrl` points at the hospital's own profile page for Dr. Banerjee, and every "Book"
button on the site follows it. Swap in a different platform there if that ever changes.

### The monthly circuit

`outreachClinics` in the same file holds the seven visiting OPDs. Each entry carries **the host
centre's own number**, not the practice's, because those centres keep their own diaries; the copy
says so explicitly so nobody rings the wrong desk. Since the sitting date moves month to month,
nothing on the site promises a fixed day. It tells families to call and confirm before travelling,
which is the honest version and saves a wasted journey across the state.

Adding or removing a town is a single array entry. It flows automatically into the home page
section, the contact page, the Your Visit page, the footer, and the `areaServed` / `worksFor`
structured data that helps a parent in Malda find him at all.

---

## The design

**Concept: "the growth curve."** Every paediatric endocrinologist's working life happens on a
growth chart, so the chart *is* the identity. A fan of percentile curves draws itself behind the
hero, returns as the section divider, becomes the reading-progress indicator in the blog, and is
compressed into the monogram: a plotted line rising to one deliberate point.

**Palette.** Warm archival paper, deep ink, a marigold accent borrowed from Bengali ritual colour,
and a botanical teal for quiet support. No hospital blues, no gradients, no stock medical imagery.
Full light and dark themes, both hand-tuned.

**Typography.** Fraunces (variable; display sizes use the `SOFT` and `WONK` axes), Inter for UI,
JetBrains Mono for index numbers and eyebrows, and Tiro Devanagari Sanskrit for
**सर्वे सन्तु निरामयाः**, which recurs as the site's quiet signature in the hero, the footer and the
closing band.

**The signature interaction.** `PercentileExplainer` on the home page is a scroll-driven growth
chart that *teaches*: four beats explaining what a centile means, that children track along one,
that crossing lines is the real signal, and why every visit is plotted. It is explicitly labelled
illustrative and non-diagnostic.

**A note on the portrait.** The studio photograph is presented in an arch frame with a stadiometer
scale standing beside it, the instrument this entire speciality turns on. No background removal was
attempted; the grey studio field is treated as an intentional editorial ground.

**Legibility over decoration.** The percentile field behind the hero is masked away from wherever
the copy sits: below the text on narrow screens, right of it on wide ones. The motif stays present
and never competes with a sentence.

**The favicon** (`public/icon.svg`) is the monogram reduced further still, to a single rising
stroke. The ring and the plotted dot turn to mush at 16px, so they are dropped.

### House style

The copy avoids em dashes entirely; commas, colons and full stops do the work instead. This is
enforced in the blog too: `remark-smartypants` runs with `dashes: false`, so hyphens an author
types are never silently promoted into dashes. Curly quotes and ellipses still get fixed
automatically.

---

## Publishing an article

Add one file to `content/blog/`. Commit it. That is the whole workflow. No CMS, no database, no
admin login.

````mdx
---
title: "Reading your child's growth chart"
description: "One or two sentences. Used for search, cards, meta description and the social card."
date: "2026-06-18"          # ISO. Required.
updated: "2026-07-22"       # Optional, shown as "Revised …"
category: "growth"          # One of the slugs in src/lib/blog-schema.ts
tags: ["Growth charts", "Centiles"]
featured: true              # Optional, pins it to "Start here"
draft: false                # Optional, visible in dev, not in production
---

Markdown, with GitHub extensions and smart quotes applied automatically.

<Callout type="warn" title="Worth an appointment sooner rather than later">
The one component available inside prose. Two tones only: `note` (teal) and `warn` (marigold).
</Callout>
````

Frontmatter is **validated at build time**. A missing title or an unknown category fails the build
with a named error rather than shipping a broken page.

Everything else is derived automatically: reading time, table of contents, related articles (scored
by shared tags, then category), the search index, the sitemap entry, the Open Graph card, and
`MedicalWebPage` structured data.

To add or rename a **category**, edit `CATEGORIES` in `src/lib/blog-schema.ts`.

---

## Architecture

```
content/blog/*.mdx        Articles. The only thing an author touches.
dr-sayan-pic/                Original photographs (source, not served).
scripts/prepare-images.mjs   npm run images → optimised JPEGs into public/portraits.

src/lib/
  site.ts                    ⭐ All practice content and contact details.
  blog-schema.ts          Types + taxonomy. No `fs`, safe in client bundles.
  blog.ts                 Server-only MDX loader, `server-only` guarded.
  toc.ts                     Heading extraction (same slugger as rehype-slug).
  og.tsx                     Shared social-card renderer.

src/components/
  chrome/                    Header, footer, theme.
  motif/                     GrowthCurve, CurveDivider, Monogram.
  home/                      One file per home-page section.
  blog/                   Cards, search, MDX renderer, TOC, reading progress.
  contact/                   Appointment form.
  ui/                        Container, Cta, Reveal, SectionHead, PageHeader.
  seo/                       JSON-LD builders.
```

The client/server split matters: `blog.ts` imports `server-only` and touches the filesystem, so
its types and taxonomy live separately in `blog-schema.ts`. Client components (search, cards)
import from the schema module, never from the loader.

**One motion vocabulary.** Everything that appears on scroll uses `Reveal` / `RevealGroup`, so the
whole site shares a single rhythm instead of a zoo of effects.

---

## Accessibility

- Skip link, landmarks, and a visible focus ring on every interactive element.
- `prefers-reduced-motion` honoured globally in CSS **and** per component via `useReducedMotion()`,
  animations degrade to a static render rather than to a fast one.
- Semantic headings, `aria-current` on active navigation, `aria-live` on search results and the
  copy-link confirmation, real `<label>`s on every form field.
- Theme is applied before first paint (no flash), and the toggle reads the DOM as its source of
  truth via `useSyncExternalStore`, so it can never disagree with the page it sits on.
- Colour pairings target WCAG AA in both themes.

## Performance

- Fully static: 70 prerendered routes. Only `/blog` is server-rendered, to support `?q=`.
- Self-hosted fonts (no request leaves the origin) and `next/image` for every photograph.
- Search runs entirely in the browser over a small pre-built index. Instant, and no visitor's
  health searches are logged anywhere.
- No analytics, no trackers, no third-party embeds.

## SEO

`Physician` + `MedicalClinic` + `WebSite` structured data site-wide; `MedicalWebPage` per article;
`BreadcrumbList` and `FAQPage` where relevant. Generated `sitemap.xml`, `robots.txt`, a web manifest,
and per-article Open Graph images rendered at build time. Single-article tag pages are `noindex` and
excluded from the sitemap to avoid thin-content dilution.

---

## Clinical & regulatory notes

- **No patient testimonials anywhere.** India's medical-council code discourages them; the site uses
  the doctor's own voice instead.
- Every article ends with a disclaimer and carries a standing "information, not advice" callout;
  emergency instructions appear in the footer of every page.
- The growth-chart explainer is labelled illustrative and non-diagnostic in both the UI and
  `/terms`.
- The appointment form **submits nothing to this site.** It composes a message and hands it to the
  visitor's own mail client, so a child's health details never pass through the website or any
  third-party form service. This is a deliberate privacy choice; see `/privacy`.
- **No consultation durations or fees are quoted anywhere.** Promising "45 minutes" is a commitment
  the clinic has to keep on its busiest day, so the site describes what happens at a visit without
  putting a clock on it.

## Deploying

Any Node host. On Vercel it is zero-config: push, set the production domain, and update `site.url`
to match.
