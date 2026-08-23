import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CurveDivider } from "@/components/motif/growth-curve";
import { WhatsAppIcon } from "@/components/motif/whatsapp-icon";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { clinics, contact, outreachClinics, site } from "@/lib/site";
import { ogDefaults } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "বাংলা",
  description:
    "ডাঃ সায়ন বন্দ্যোপাধ্যায়, কলকাতার শিশু ও কৈশোরের হরমোন বিশেষজ্ঞ। উচ্চতা, থাইরয়েড, ডায়াবিটিস, বয়ঃসন্ধি ও মেটাবলিক সমস্যায় শিশুদের চিকিৎসা।",
  alternates: { canonical: "/bn" },
  openGraph: {
    ...ogDefaults,
    title: "ডাঃ সায়ন বন্দ্যোপাধ্যায় · শিশু হরমোন বিশেষজ্ঞ",
    description: "কলকাতা ও পশ্চিমবঙ্গের সাতটি শহরে শিশুদের হরমোন চিকিৎসা।",
    url: "/bn",
    type: "website",
    locale: "bn_IN",
  },
};

/**
 * The Bengali summary of the whole site.
 *
 * Written in the Bengali a Kolkata family actually speaks: clinical terms stay
 * as the loanwords everyone uses, in Bengali script — ডায়াবিটিস, থাইরয়েড,
 * গ্রোথ হরমোন, পিউবার্টি — rather than being forced into Sanskritic
 * coinages nobody says aloud. Translating "growth hormone deficiency" into
 * pure Bengali would be accurate and useless.
 *
 * The site's `.label` class is mono, uppercase and widely tracked, which is
 * wrong for Bengali script, so this page uses its own eyebrow styling
 * throughout rather than reusing SectionHead.
 */

const conditions = [
  {
    title: "উচ্চতা ও শারীরিক বৃদ্ধি",
    body: "বয়সের তুলনায় উচ্চতা কম, বছরে বৃদ্ধি কমে যাওয়া, গ্রোথ হরমোনের ঘাটতি, টার্নার সিনড্রোম, জন্মের সময় ওজন কম থাকার পর ঠিকমতো না বাড়া।",
  },
  {
    title: "শিশুদের ডায়াবিটিস",
    body: "টাইপ ১ ডায়াবিটিস, কিশোর বয়সে টাইপ ২, ইনসুলিন পাম্প ও CGM চালু করা, স্কুলের জন্য লিখিত প্ল্যান, অসুস্থ দিনের নিয়ম।",
  },
  {
    title: "থাইরয়েড",
    body: "জন্মগত হাইপোথাইরয়েডিজম, হাশিমোটো থাইরয়েডাইটিস, থাইরয়েড বেড়ে যাওয়া, গলার সামনে ফোলা বা গিঁট।",
  },
  {
    title: "বয়ঃসন্ধি",
    body: "সময়ের অনেক আগে বা অনেক দেরিতে পিউবার্টি, PCOS, অনিয়মিত বা বন্ধ পিরিয়ড, ছেলেদের বুকে মাংস বেড়ে যাওয়া।",
  },
  {
    title: "ওজন ও মেটাবলিক সমস্যা",
    body: "শিশু-কিশোরদের ওবেসিটি, ইনসুলিন রেজিস্ট্যান্স, ঘাড়ে-বগলে কালো ছোপ, ফ্যাটি লিভার, কোলেস্টেরল বেশি থাকা।",
  },
  {
    title: "হাড়, ক্যালসিয়াম ও ভিটামিন ডি",
    body: "রিকেট, পায়ে বেঁকে যাওয়া, সহজে হাড় ভাঙা, রক্তে ক্যালসিয়াম কম বা বেশি, ভিটামিন ডি-র ঘাটতি।",
  },
  {
    title: "অ্যাড্রিনাল ও পিটুইটারি",
    body: "কনজেনিটাল অ্যাড্রিনাল হাইপারপ্লেসিয়া (CAH), অ্যাড্রিনাল ইনসাফিসিয়েন্সি, কুশিং সিনড্রোম, পিটুইটারি গ্রন্থির সমস্যা।",
  },
  {
    title: "নবজাতক ও জিনগত সমস্যা",
    body: "সদ্যোজাতর হরমোন সমস্যা, জন্মের সময় লিঙ্গ নির্ধারণে অস্পষ্টতা, অণ্ডকোষ না নামা। ধৈর্য ধরে, গোপনীয়তা রেখে দেখা হয়।",
  },
];

const redFlags = [
  "সমবয়সীদের তুলনায় বাচ্চা স্পষ্টভাবে খাটো, বা এক বছরে উচ্চতা প্রায় বাড়েনি",
  "মেয়েদের ৮ বছরের আগে বা ছেলেদের ৯ বছরের আগে বয়ঃসন্ধির লক্ষণ",
  "১৩–১৪ বছর পেরিয়ে গেলেও বয়ঃসন্ধি শুরু হয়নি",
  "বারবার জল তেষ্টা, ঘন ঘন প্রস্রাব, হঠাৎ ওজন কমে যাওয়া, খুব ক্লান্তি",
  "গলার সামনে ফোলা বা শক্ত গিঁট",
  "অস্বাভাবিক দ্রুত ওজন বাড়া, সঙ্গে ঘাড়ে বা বগলে কালো ছোপ",
];

const visitSteps = [
  {
    step: "১",
    title: "আসার আগে",
    body: "ইমিউনাইজেশন কার্ড, পুরনো সব প্রেসক্রিপশন আর রিপোর্ট, আর সবচেয়ে দরকারি জিনিসটা হল বাচ্চার আগের উচ্চতা ও ওজনের যে কোনও হিসেব। স্কুলের রেকর্ডও চলবে।",
  },
  {
    step: "২",
    title: "মাপজোক",
    body: "দেওয়ালে লাগানো স্ট্যাডিওমিটারে উচ্চতা, ওজন, আর দরকার হলে বসা অবস্থায় উচ্চতা ও হাতের বিস্তার। মিলিমিটারও গুরুত্বপূর্ণ, কারণ হিসেবটা বছরের পর বছরের।",
  },
  {
    step: "৩",
    title: "কথাবার্তা",
    body: "গর্ভাবস্থা ও জন্ম, বেড়ে ওঠার ধাপ, বাড়ির লোকের উচ্চতা, খাওয়া, ঘুম, স্কুল, আর আপনার সবচেয়ে বড় দুশ্চিন্তাটা কী। বাচ্চার সঙ্গেও কথা বলা হয়, শুধু তাকে নিয়ে নয়।",
  },
  {
    step: "৪",
    title: "পরীক্ষা ও গ্রোথ চার্ট",
    body: "যত্ন করে শারীরিক পরীক্ষা, তারপর স্ক্রিনে একসঙ্গে গ্রোথ চার্টে দাগ কাটা। ডাক্তার যা দেখছেন, আপনিও ঠিক সেটাই দেখবেন।",
  },
  {
    step: "৫",
    title: "পরিকল্পনা",
    body: "আমাদের কী মনে হচ্ছে, কোন পরীক্ষায় উত্তর মিলবে, তাতে কী করতে হবে, আর কবে আবার আসতে হবে। সবটাই বেরোনোর আগে লিখে দেওয়া হয়।",
  },
];

const bringList = [
  "বাচ্চার আগের সব উচ্চতা ও ওজনের হিসেব",
  "পুরনো সব রিপোর্ট, তারিখ অনুযায়ী সাজানো",
  "এখন যা যা ওষুধ চলছে, কৌটো-সহ",
  "বাবা ও মা দু'জনেরই উচ্চতা, সম্ভব হলে মেপে",
  "জন্মের সময়ের ওজন ও কত সপ্তাহে জন্ম",
  "আপনার প্রশ্নগুলো, লিখে আনা",
];

const readMore = [
  { href: "/conditions", label: "যে সব সমস্যা দেখা হয়", en: "Conditions" },
  { href: "/visit", label: "প্রথম দিন কী হয়", en: "Your Visit" },
  { href: "/blog", label: "অভিভাবকদের জন্য লেখা", en: "Blog" },
  { href: "/media", label: "ভিডিও ও সংবাদমাধ্যম", en: "Media" },
  { href: "/publications", label: "গবেষণাপত্র", en: "Publications" },
  { href: "/contact", label: "যোগাযোগ ও ঠিকানা", en: "Contact" },
];

export default function BengaliPage() {
  return (
    <div lang="bn">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="grain relative isolate overflow-hidden pt-28 pb-12 sm:pt-36 sm:pb-16">
        <Container width="wide" className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7">
              <p className="text-[0.95rem] text-marigold">শিশু ও কৈশোরের হরমোন বিশেষজ্ঞ</p>
              <h1 className="font-display mt-5 text-[clamp(2rem,5.5vw,4rem)] leading-[1.25]">
                বেড়ে ওঠা অনেকটা সময়ের ব্যাপার। গোটা পথটাতেই পাশে থাকতে চাই।
              </h1>
              <p className="mt-7 max-w-xl text-base leading-loose text-ink-muted sm:text-lg">
                ডাঃ সায়ন বন্দ্যোপাধ্যায়। MBBS, MD (পেডিয়াট্রিক্স), DM (পেডিয়াট্রিক
                এন্ডোক্রিনোলজি)। শিশুদের হরমোন-সংক্রান্ত সমস্যা নিয়ে কাজ করি: উচ্চতা, থাইরয়েড,
                ডায়াবিটিস, বয়ঃসন্ধি, হাড় ও ওজন।
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                {contact.whatsappHref && (
                  <a
                    href={contact.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-marigold px-6 text-[0.95rem] font-medium text-white transition-colors duration-300 hover:bg-ink hover:text-paper dark:text-paper"
                  >
                    <WhatsAppIcon className="size-[1.05rem] shrink-0" />
                    হোয়াটসঅ্যাপে বলুন
                  </a>
                )}
                <a
                  href={contact.phoneHref}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-line px-6 text-[0.95rem] text-ink transition-colors duration-300 hover:border-marigold hover:text-marigold"
                >
                  ফোন {contact.phoneDisplay}
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-5">
              {/* Same frame as the English hero: one generous radius on the
                  top-left and bottom-right, tight on the other two, so the
                  two landing pages read as one site. */}
              <div className="relative mx-auto aspect-4/5 max-w-sm overflow-hidden rounded-tl-[4.5rem] rounded-tr-2xl rounded-br-[4.5rem] rounded-bl-2xl bg-paper-sunk lg:max-w-none sm:rounded-tl-[6rem] sm:rounded-br-[6rem]">
                <Image
                  src="/portraits/portrait-hero.jpg"
                  alt="ডাঃ সায়ন বন্দ্যোপাধ্যায়"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover object-top"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent mix-blend-multiply dark:from-black/40"
                />
              </div>
            </Reveal>
          </div>
        </Container>

        <Container width="wide">
          <CurveDivider className="mt-14 opacity-70" />
        </Container>
      </header>

      {/* ── Credentials ──────────────────────────────────────── */}
      <section className="border-y border-line bg-paper-raised py-14 sm:py-16">
        <Container width="wide">
          <RevealGroup className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "DM", v: "পেডিয়াট্রিক এন্ডোক্রিনোলজি, PGIMER চণ্ডীগড়" },
              { k: "MD", v: "শিশুরোগ, আর. জি. কর মেডিক্যাল কলেজ, কলকাতা" },
              { k: "ফেলোশিপ", v: "পেডিয়াট্রিক এন্ডোক্রিনোলজি, রিজেন্সি CDER, কানপুর" },
              { k: "০–১৮", v: "সদ্যোজাত থেকে কৈশোর পর্যন্ত" },
            ].map((item) => (
              <RevealItem key={item.k}>
                <p className="font-display text-2xl text-marigold sm:text-3xl">{item.k}</p>
                <p className="mt-2 text-[0.9rem] leading-loose text-ink-muted">{item.v}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* ── Conditions ───────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <Container width="wide">
          <Reveal>
            <p className="text-[0.9rem] text-marigold">কী নিয়ে কাজ</p>
            <h2 className="font-display mt-4 text-[clamp(1.7rem,3.6vw,2.8rem)] leading-[1.3]">
              শিশুর শরীরে যে গ্রন্থিগুলো নিঃশব্দে সব ঠিক রাখে।
            </h2>
          </Reveal>

          <RevealGroup
            as="ul"
            className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2"
          >
            {conditions.map((item) => (
              <RevealItem key={item.title} as="li" className="bg-paper p-7 sm:p-8">
                <h3 className="font-display text-lg leading-snug sm:text-xl">{item.title}</h3>
                <p className="mt-3 text-[0.9rem] leading-loose text-ink-muted">{item.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-8">
            <Link href="/conditions" className="link-underline text-[0.95rem] text-marigold">
              পুরো তালিকা দেখুন (ইংরেজিতে)
            </Link>
          </Reveal>
        </Container>
      </section>

      {/* ── When to see someone ──────────────────────────────── */}
      <section className="border-y border-line bg-paper-raised py-16 sm:py-20">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <p className="text-[0.9rem] text-marigold">কখন দেখানো দরকার</p>
              <h2 className="font-display mt-4 text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.3]">
                এগুলোর একটাও থাকলে দেরি করবেন না।
              </h2>
              <p className="mt-6 text-[0.95rem] leading-loose text-ink-muted">
                হরমোনের সমস্যা সাধারণত হঠাৎ ধরা পড়ে না, ধীরে ধীরে বোঝা যায়। তাই সময়ে দেখানোটাই
                সবচেয়ে বড় কাজ।
              </p>
            </Reveal>

            <RevealGroup as="ul" className="flex flex-col gap-4 lg:col-span-7">
              {redFlags.map((flag) => (
                <RevealItem
                  key={flag}
                  as="li"
                  className="flex items-baseline gap-4 border-b border-line pb-4 text-[0.95rem] leading-loose text-ink-muted"
                >
                  <span aria-hidden="true" className="mt-2.5 block h-px w-3 shrink-0 bg-marigold" />
                  {flag}
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Container>
      </section>

      {/* ── First visit ──────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <Container width="wide">
          <Reveal>
            <p className="text-[0.9rem] text-marigold">প্রথম দিন</p>
            <h2 className="font-display mt-4 text-[clamp(1.7rem,3.6vw,2.8rem)] leading-[1.3]">
              চেম্বারে ঠিক কী কী হয়।
            </h2>
          </Reveal>

          <RevealGroup as="ol" className="mt-12 border-t border-line">
            {visitSteps.map((item) => (
              <RevealItem key={item.step} as="li" className="border-b border-line">
                <div className="grid items-baseline gap-x-8 gap-y-2 py-7 md:grid-cols-12">
                  <span className="font-display text-2xl text-marigold md:col-span-1">
                    {item.step}
                  </span>
                  <h3 className="font-display text-lg md:col-span-3">{item.title}</h3>
                  <p className="text-[0.92rem] leading-loose text-ink-muted md:col-span-8">
                    {item.body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-12 rounded-2xl border border-line bg-paper-raised p-7 sm:p-8">
            <h3 className="font-display text-xl">কী কী সঙ্গে আনবেন</h3>
            <ul className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2">
              {bringList.map((item) => (
                <li
                  key={item}
                  className="flex items-baseline gap-3 text-[0.92rem] leading-loose text-ink-muted"
                >
                  <span aria-hidden="true" className="mt-2.5 block h-px w-2.5 shrink-0 bg-marigold" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* ── Where ────────────────────────────────────────────── */}
      <section className="border-y border-line bg-paper-raised py-16 sm:py-20">
        <Container width="wide">
          <Reveal>
            <p className="text-[0.9rem] text-marigold">কোথায় পাবেন</p>
            <h2 className="font-display mt-4 text-[clamp(1.7rem,3.6vw,2.8rem)] leading-[1.3]">
              কলকাতায় নিয়মিত, জেলায় মাসে একবার।
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              {clinics.map((clinic) => (
                <article key={clinic.id} className="rounded-2xl border border-line bg-paper p-7">
                  <h3 className="font-display text-xl leading-snug">
                    নিওটিয়া ভাগীরথী ওমেন অ্যান্ড চাইল্ড কেয়ার সেন্টার
                  </h3>
                  <p className="mt-3 text-[0.9rem] leading-loose text-ink-muted">
                    পেডিয়াট্রিক এন্ডোক্রিনোলজি বিভাগ, অ্যাকশন এরিয়া ১ডি, নিউ টাউন, কলকাতা ৭০০ ১৫৬
                  </p>
                  <p className="mt-4 text-[0.9rem] leading-loose text-ink-muted">
                    অ্যাপয়েন্টমেন্ট নিয়ে আসতে হয়। সময় জানতে হাসপাতালে ফোন করুন।
                  </p>
                  <a
                    href={clinic.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline mt-5 inline-block text-[0.9rem] text-marigold"
                  >
                    ম্যাপে দেখুন
                  </a>
                </article>
              ))}
            </Reveal>

            <Reveal delay={0.06} className="lg:col-span-7">
              <p className="text-[0.95rem] leading-loose text-ink-muted">
                নীচের কেন্দ্রগুলোয় মাসে একদিন করে বসা হয়। তারিখ প্রতি মাসে বদলায়, তাই রওনা
                দেওয়ার আগে কেন্দ্রে ফোন করে দিন ঠিক করে নেবেন।
              </p>

              <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
                {outreachClinics.map((clinic) => (
                  <li key={clinic.town} className="bg-paper p-5">
                    <p className="font-display text-lg">{townInBengali[clinic.town] ?? clinic.town}</p>
                    <p className="mt-1 text-[0.85rem] leading-relaxed text-ink-muted" lang="en">
                      {clinic.centre}
                    </p>
                    <a
                      href={clinic.phoneHref}
                      className="link-underline mt-2 inline-block font-mono text-[0.8rem] text-ink"
                      lang="en"
                    >
                      {clinic.phoneDisplay}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── Contact ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <Container width="wide">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <p className="text-[0.9rem] text-marigold">যোগাযোগ</p>
              <h2 className="font-display mt-4 text-[clamp(1.7rem,3.6vw,2.8rem)] leading-[1.3]">
                প্রশ্ন থাকলে সরাসরি জিজ্ঞেস করুন।
              </h2>
              <p className="mt-6 text-[0.95rem] leading-loose text-ink-muted">
                সবচেয়ে সহজ রাস্তা হোয়াটসঅ্যাপ, সেটা সরাসরি ডাক্তারবাবুর কাছেই যায়। সমস্যাটা কী,
                কতদিন ধরে, আর আগে কী পরীক্ষা হয়েছে, এটুকু লিখে পাঠালেই হবে। রিপোর্টের ছবিও
                পাঠাতে পারেন। অ্যাপয়েন্টমেন্টের দিনক্ষণ কিন্তু হাসপাতালের খাতায় থাকে, তাই সময়
                পাকা করতে হাসপাতালে ফোন করতে হবে।
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <ul className="flex flex-col gap-px overflow-hidden rounded-2xl border border-line bg-line">
                {contact.whatsappHref && (
                  <li className="bg-paper p-6">
                    <p className="flex items-center gap-2 text-[0.9rem] text-marigold">
                      <WhatsAppIcon className="size-4 shrink-0" />
                      হোয়াটসঅ্যাপ
                    </p>
                    <a
                      href={contact.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline mt-2 inline-block font-display text-xl text-ink"
                      lang="en"
                    >
                      {contact.whatsappDisplay}
                    </a>
                  </li>
                )}
                <li className="bg-paper p-6">
                  <p className="text-[0.9rem] text-marigold">হাসপাতালের ফোন</p>
                  <a
                    href={contact.phoneHref}
                    className="link-underline mt-2 inline-block font-display text-xl text-ink"
                    lang="en"
                  >
                    {contact.phoneDisplay}
                  </a>
                </li>
                <li className="bg-paper p-6">
                  <p className="text-[0.9rem] text-marigold">ইমেল</p>
                  <a
                    href={contact.emailHref}
                    className="link-underline mt-2 inline-block break-all text-[0.95rem] text-ink"
                    lang="en"
                  >
                    {contact.email}
                  </a>
                </li>
              </ul>

              <div className="mt-6 rounded-2xl border border-marigold/30 bg-marigold-wash/50 p-6">
                <p className="text-[0.9rem] text-marigold">জরুরি অবস্থায়</p>
                <p className="mt-3 text-[0.9rem] leading-loose text-ink-muted">
                  এই ওয়েবসাইট তথ্যের জন্য, রোগ নির্ণয়ের জন্য নয়। বাচ্চা যদি ঝিমিয়ে পড়ে, দ্রুত
                  শ্বাস নেয়, বারবার বমি করে, খিঁচুনি হয়, বা সুগার কিছুতেই নামানো না যায়, সঙ্গে
                  সঙ্গে কাছের হাসপাতালের এমার্জেন্সিতে যান।
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── Read more ────────────────────────────────────────── */}
      <section className="border-t border-line bg-paper-sunk py-16 sm:py-20">
        <Container width="wide">
          <Reveal>
            <p className="text-[0.9rem] text-marigold">আরও পড়ুন</p>
            <h2 className="font-display mt-4 text-[clamp(1.6rem,3.2vw,2.4rem)] leading-[1.3]">
              বাকি ওয়েবসাইটটা ইংরেজিতে।
            </h2>
            <p className="mt-5 max-w-2xl text-[0.95rem] leading-loose text-ink-muted">
              এই পাতাটা গোটা সাইটের সংক্ষিপ্ত রূপ। বিস্তারিত লেখা, ব্লগ, ভিডিও আর গবেষণাপত্র সবই
              ইংরেজিতে রয়েছে।
            </p>
          </Reveal>

          <RevealGroup
            as="ul"
            className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
          >
            {readMore.map((item) => (
              <RevealItem key={item.href} as="li" className="group bg-paper">
                <Link
                  href={item.href}
                  className="flex h-full flex-col justify-between gap-4 p-6 transition-colors duration-500 hover:bg-paper-raised"
                >
                  <span className="font-display text-lg leading-snug transition-colors group-hover:text-marigold">
                    {item.label}
                  </span>
                  <span className="label" lang="en">
                    {item.en}
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-12 border-t border-line pt-8">
            <p className="font-deva text-xl text-marigold" lang="sa">
              {site.sanskrit.text}
            </p>
            <p className="mt-2 text-[0.9rem] leading-loose text-ink-muted">
              সবাই নীরোগ হোক।
            </p>
          </Reveal>
        </Container>
      </section>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "বাংলা", href: "/bn" },
        ]}
      />
    </div>
  );
}

/** District towns as they are actually written in Bengali. */
const townInBengali: Record<string, string> = {
  Burdwan: "বর্ধমান",
  Chandipur: "চণ্ডীপুর",
  Kolaghat: "কোলাঘাট",
  Malda: "মালদা",
  Mankundu: "মানকুণ্ডু",
  Serampore: "শ্রীরামপুর",
  Tamluk: "তমলুক",
};
