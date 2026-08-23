import type { Metadata } from "next";
import Image from "next/image";

import { BookingBand } from "@/components/home/booking-band";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { credentials, site } from "@/lib/site";
import { ogDefaults } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "About Dr. Sayan Banerjee",
  description:
    "DM-trained at PGIMER Chandigarh, now practising paediatric and adolescent endocrinology in Kolkata. Training, approach and the principles behind the clinic.",
  alternates: { canonical: "/about" },
  openGraph: {
    ...ogDefaults,
    title: "About Dr. Sayan Banerjee · Paediatric Endocrinologist, Kolkata",
    description:
      "Training at PGIMER Chandigarh, an approach built on time and measurement, and the principles behind the clinic.",
    url: "/about",
    type: "profile",
  },
};

const principles = [
  {
    n: "01",
    title: "The chart before the prescription",
    body: "Nothing is prescribed until the growth record has been plotted and understood. Most endocrine answers are already in the trajectory; the tests confirm what the line has been saying for years.",
  },
  {
    n: "02",
    title: "Explain it twice",
    body: "Once to the parent, and once again, in different words, to the child. A ten-year-old who understands why they are taking a tablet is a ten-year-old who takes it.",
  },
  {
    n: "03",
    title: "Rule out properly, then reassure completely",
    body: "Half-reassurance is worse than none. If the workup is normal, I will say so plainly, explain what that rules out, and tell you exactly what would bring you back.",
  },
  {
    n: "04",
    title: "Cost is a clinical fact",
    body: "A plan a family cannot sustain is not a plan. Investigations are chosen for what they will change, and the cheaper route that answers the question is the better route.",
  },
  {
    n: "05",
    title: "Adolescents get their own room",
    body: "From about eleven, a few minutes alone at every visit. Not to exclude parents, but because young people ask better questions when nobody is watching their face.",
  },
  {
    n: "06",
    title: "Write it down",
    body: "Every visit ends with a written summary: what we think, what we are doing, what to watch for, when to return. You should never have to reconstruct a consultation from memory.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={
          <>
            The long
            <br />
            appointment.
          </>
        }
        lede="I chose paediatric endocrinology because it is the branch of medicine that refuses to be rushed, and because the children in it get better slowly, visibly, and for good."
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* ── Narrative ────────────────────────────────────────── */}
      <Container width="wide" className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            {/* The same frame as the home and Bengali heroes: generous radius
                on the top-left and bottom-right, tight on the other two. */}
            <div className="relative aspect-4/5 overflow-hidden rounded-tl-[4.5rem] rounded-tr-2xl rounded-br-[4.5rem] rounded-bl-2xl bg-paper-sunk sm:rounded-tl-[6rem] sm:rounded-br-[6rem]">
              <Image
                src="/portraits/portrait-hero.jpg"
                alt="Portrait of Dr. Sayan Banerjee."
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 38vw"
                className="object-cover object-top"
              />
            </div>
            <dl className="mt-8 divide-y divide-line border-y border-line">
              {[
                { k: "Speciality", v: "Paediatric & adolescent endocrinology" },
                { k: "Super-speciality", v: "DM, PGIMER Chandigarh" },
                { k: "Consults at", v: "Neotia Bhagirathi, New Town" },
                { k: "Languages", v: "Bengali · Hindi · English" },
              ].map((row) => (
                <div key={row.k} className="flex items-baseline justify-between gap-6 py-3.5">
                  <dt className="label">{row.k}</dt>
                  <dd className="text-right text-[0.9rem] text-ink">{row.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.08} className="space-y-6 text-base leading-relaxed text-ink-muted lg:col-span-7 sm:text-lg">
            <p className="font-display text-2xl leading-snug text-ink sm:text-3xl">
              Most specialities meet a patient at their worst moment. Endocrinology meets a child
              on an ordinary Tuesday and asks what the last five years have looked like.
            </p>
            <p>
              I trained first in paediatrics, which teaches you that children are not small
              adults, and that their physiology, their doses and their fears are all their own.
              That was an MBBS and then an MD in paediatric medicine at R. G. Kar Medical College
              in Kolkata, the city I have come back to practise in.
            </p>
            <p>
              A fellowship in paediatric endocrinology at Regency CDER in Kanpur followed, and
              then three years of DM at the Postgraduate Institute of Medical Education and
              Research in Chandigarh, one of the few centres in India where this super-speciality
              is taught in real depth.
            </p>
            <p>
              PGIMER is a referral hospital of last resort for much of northern India. The
              children who arrive there have usually been somewhere else first. That training
              gives you two things: familiarity with genuinely rare disease, and, just as
              valuable, the confidence to recognise when a worried family&rsquo;s child is
              entirely well and simply needs someone to look properly and say so.
            </p>
            <p>
              I now consult at Neotia Bhagirathi Woman and Child Care Centre in New Town,{" "}
              {site.city}, where I look after children and adolescents with growth concerns, type
              1 and type 2 diabetes, thyroid disease, early and delayed puberty, obesity and
              metabolic disease, bone and calcium disorders, adrenal and pituitary conditions,
              newborn endocrine problems and endocrine emergencies.
            </p>
            <p>
              A great deal of this work is longitudinal. I will meet some of these children when
              they are four and hand them over to an adult service at eighteen. That is not a
              burden of the job; it is the reason for doing it.
            </p>
          </Reveal>
        </div>
      </Container>

      {/* ── Training ─────────────────────────────────────────── */}
      <section className="border-y border-line bg-paper-raised py-20 sm:py-24">
        <Container width="wide">
          <SectionHead
            index="01"
            eyebrow="Training"
            title="Where the thinking comes from."
          />

          <RevealGroup as="ol" className="mt-14 border-t border-line">
            {credentials.map((item) => (
              // The DM and the Fellowship share a title, so the qualification
              // has to be part of the key for React to tell them apart.
              <RevealItem key={`${item.year}-${item.title}`} as="li" className="border-b border-line">
                <div className="grid items-baseline gap-x-8 gap-y-2 py-7 md:grid-cols-12">
                  <span className="font-display text-3xl text-marigold md:col-span-2">
                    {item.year}
                  </span>
                  <h3 className="font-display text-xl md:col-span-3">{item.title}</h3>
                  <p className="text-[0.9rem] text-ink md:col-span-3">{item.org}</p>
                  <p className="text-[0.9rem] leading-relaxed text-ink-muted md:col-span-4">
                    {item.note}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* ── Principles ───────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <Container width="wide">
          <SectionHead
            index="02"
            eyebrow="How this clinic runs"
            title="Six things I will not compromise on."
            lede="Not a mission statement. A description of what actually happens in the room, written down so you can hold me to it."
          />

          <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p) => (
              <RevealItem key={p.n} className="bg-paper p-7 sm:p-8">
                <span className="label text-marigold">{p.n}</span>
                <h3 className="font-display mt-5 text-xl leading-tight">{p.title}</h3>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-muted">{p.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* ── Beyond the clinic ────────────────────────────────── */}
      <section className="border-t border-line bg-paper-raised py-20 sm:py-24">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7">
              <SectionHead
                index="03"
                eyebrow="Beyond the clinic"
                title="Teaching, writing, and being asked difficult questions in public."
                lede="Paediatric endocrinology in India is short of specialists and long on misinformation. Some of the most useful work happens outside the consulting room."
              />

              <ul className="mt-10 divide-y divide-line border-y border-line">
                {[
                  {
                    t: "Teaching & academic work",
                    d: "Training postgraduates and paediatricians in growth assessment, diabetes technology and the endocrine conditions most likely to be missed in general practice.",
                  },
                  {
                    t: "Conferences & CME",
                    d: "Presenting and attending national paediatric endocrinology meetings, because the field moves and a five-year-old protocol is a liability.",
                  },
                  {
                    t: "Public education",
                    d: "Podcasts, talks and the Blog on this site, written for parents rather than for peers, and revised when the evidence changes.",
                  },
                  {
                    t: "Diabetes camps & support",
                    d: "Working with families of children with type 1 diabetes, where the practical knowledge is often held by other parents rather than by doctors.",
                  },
                ].map((item) => (
                  <li key={item.t} className="py-5">
                    <h3 className="font-display text-lg">{item.t}</h3>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-muted">{item.d}</p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-5">
              <div className="space-y-6">
                <figure>
                  <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-paper-sunk">
                    <Image
                      src="/portraits/portrait-lecture.jpg"
                      alt="Dr. Sayan Banerjee presenting at the RSSDIWB annual conference, 2026."
                      fill
                      sizes="(max-width: 1024px) 90vw, 38vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="label mt-3">RSSDIWB annual conference, 2026</figcaption>
                </figure>

                <figure>
                  <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-paper-sunk">
                    <Image
                      src="/portraits/portrait-studio.jpg"
                      alt="Dr. Sayan Banerjee recording a podcast episode."
                      fill
                      sizes="(max-width: 1024px) 90vw, 38vw"
                      className="object-cover object-top"
                    />
                  </div>
                  <figcaption className="label mt-3">Recording for parents</figcaption>
                </figure>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-16 border-t border-line pt-10">
            <p className="font-deva text-3xl text-marigold sm:text-4xl">{site.sanskrit.text}</p>
            <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink-muted">
              <em>{site.sanskrit.transliteration}</em>, “{site.sanskrit.translation}” An old line,
              an unreasonable ambition, and the correct one to keep working towards.
            </p>
          </Reveal>
        </Container>
      </section>

      <BookingBand />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />
    </>
  );
}
