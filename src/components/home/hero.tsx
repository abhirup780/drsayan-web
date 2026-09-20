"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { GrowthCurve } from "@/components/motif/growth-curve";
import { GrowthFigures } from "@/components/motif/growth-figures";
import { WhatsAppIcon } from "@/components/motif/whatsapp-icon";
import { Container } from "@/components/ui/container";
import { Cta } from "@/components/ui/cta";
import { contact, site } from "@/lib/site";

// The rendered initial state must not depend on `reduce`: the hook is false
// during SSR and true on a reduced-motion device, and React will not patch a
// style mismatch, so the element would stay at opacity 0 forever. Reduce only
// ever zeroes the duration. Same reasoning as `Reveal`.
const rise = (delay: number, reduce: boolean | null) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: reduce ? 0 : 0.9, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] as const },
});

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="grain relative isolate overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 lg:min-h-svh lg:pt-40">
      {/* The percentile fan, drawn across the whole hero at low contrast. */}
      {/* The percentile field is masked away from wherever the copy sits:
          below the text on narrow screens, right of it on wide ones. The
          motif stays present without ever competing with a sentence. */}
      <GrowthCurve
        className="absolute inset-x-0 top-[18%] bottom-0 -z-10 h-[70%] w-full text-ink opacity-35
          [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_62%,black_92%)]
          lg:opacity-45 lg:[mask-image:linear-gradient(to_right,transparent_0%,transparent_40%,black_74%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-40 -z-10 size-[36rem] rounded-full bg-marigold-wash blur-[120px] opacity-60 dark:opacity-25"
      />

      <Container width="wide" className="relative">
        <div className="grid items-center gap-x-10 gap-y-14 lg:grid-cols-12">
          {/* ── Words ─────────────────────────────────────────────── */}
          <div className="lg:col-span-7 xl:col-span-6">
            {/* Each phrase is its own span: bare text between flex children
                becomes an anonymous flex item, which swallows the spaces
                around an interpolated value. */}
            <motion.p
              {...rise(0.05, reduce)}
              className="label flex flex-wrap items-center gap-x-3 gap-y-1.5"
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-marigold opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-marigold" />
              </span>
              <span>Consulting in {site.city} &amp; across West Bengal</span>
              <span aria-hidden="true" className="text-line">
                /
              </span>
              <span>Paediatric &amp; adolescent endocrinology</span>
            </motion.p>

            <motion.h1
              {...rise(0.14, reduce)}
              className="font-display mt-7 text-(length:--text-hero) leading-[0.9]"
            >
              Every child grows
              <br />
              on their{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="italic">own curve</span>
                <motion.svg
                  viewBox="0 0 200 18"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-3 w-full text-marigold sm:-bottom-2 sm:h-4"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M2,15 C40,13 70,10 110,7 C145,4.5 175,3 198,2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: reduce ? 0 : 1.2,
                      delay: reduce ? 0 : 0.9,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </motion.svg>
              </span>
              .
            </motion.h1>

            <motion.p
              {...rise(0.24, reduce)}
              className="mt-8 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg"
            >
              I am <strong className="font-medium text-ink">Dr. Sayan Banerjee</strong>, a
              DM-trained paediatric endocrinologist. I look after children and teenagers whose
              growth, hormones, thyroid, sugar or puberty need a specialist&rsquo;s patience, and I
              explain every step to the people who love them.
            </motion.p>

            <motion.div {...rise(0.32, reduce)} className="mt-10 flex flex-wrap items-center gap-3">
              <Cta href="/contact#book">Book a visit</Cta>
              {contact.whatsappHref && (
                <Cta
                  href={contact.whatsappHref}
                  variant="outline"
                  withArrow={false}
                  icon={<WhatsAppIcon className="size-[1.05rem] shrink-0 text-marigold" />}
                  aria-label={`Message Dr. Banerjee on WhatsApp at ${contact.whatsappDisplay}`}
                >
                  WhatsApp
                </Cta>
              )}
              <Cta href={contact.phoneHref} variant="outline" withArrow={false}>
                Call {contact.phoneDisplay}
              </Cta>
            </motion.div>

            <motion.dl
              {...rise(0.42, reduce)}
              className="mt-12 grid max-w-lg grid-cols-2 gap-x-8 gap-y-5 border-t border-line pt-7 sm:grid-cols-3"
            >
              {[
                { k: "Training", v: "DM, PGIMER Chandigarh" },
                { k: "Focus", v: "Growth · Diabetes · Thyroid" },
                { k: "Practising at", v: "Neotia Bhagirathi, New Town" },
              ].map((item) => (
                <div key={item.k}>
                  <dt className="label">{item.k}</dt>
                  <dd className="mt-1.5 text-[0.9rem] leading-snug text-ink">{item.v}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* ── Portrait ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 1.1, delay: reduce ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none xl:col-span-6"
          >
            <div className="relative flex justify-center lg:justify-end">
              {/* A stadiometer scale — the instrument this whole speciality
                  turns on, standing quietly beside the portrait. */}
              <div
                aria-hidden="true"
                className="relative mr-4 hidden w-10 shrink-0 sm:block lg:mr-6"
              >
                <div className="absolute inset-y-6 right-0 w-px bg-line" />
                {Array.from({ length: 21 }).map((_, i) => {
                  const major = i % 5 === 0;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: reduce ? 0 : 0.5,
                        delay: reduce ? 0 : 0.6 + i * 0.025,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="absolute right-0 flex items-center justify-end gap-1.5"
                      style={{ top: `calc(1.5rem + ${(i / 20) * 100}% - ${(i / 20) * 3}rem)` }}
                    >
                      {major && (
                        <span className="font-mono text-[0.5rem] tracking-widest text-ink-faint">
                          {180 - i * 6}
                        </span>
                      )}
                      <span className={major ? "block h-px w-3 bg-ink-faint" : "block h-px w-1.5 bg-line"} />
                    </motion.div>
                  );
                })}
              </div>

              {/* The frame was capped at 26rem while its column is nearly
                  twice that at xl, so the portrait sat well short of the text
                  column and `items-center` split the difference into dead
                  space above and below. Letting it grow with the column
                  brings the two sides to roughly equal height. */}
              <figure className="w-full max-w-[26rem] lg:max-w-[30rem] xl:max-w-[34rem]">
                {/* Editorial frame.
                    This was a semicircular arch: rounded-t-[13rem] against a
                    26rem width is exactly half the frame, which read as a
                    niche rather than a portrait, and sat oddly against a 12px
                    bottom radius.

                    Now one generous radius on the top-left and bottom-right,
                    tight on the other two. The soft corners fall on the
                    diagonal the growth curve already travels, and the tight
                    bottom-left keeps a square corner under the marigold mark
                    so the badge has something to sit against. */}
                <div className="relative aspect-4/5 overflow-hidden rounded-tl-[4.5rem] rounded-br-[4.5rem] rounded-tr-2xl rounded-bl-2xl bg-paper-sunk sm:rounded-tl-[6rem] sm:rounded-br-[6rem]">
                  <Image
                    src="/portraits/portrait-hero.jpg"
                    alt="Dr. Sayan Banerjee, paediatric endocrinologist, in a light Nehru jacket over a blue shirt."
                    fill
                    priority
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 36vw"
                    className="object-cover object-top"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent mix-blend-multiply dark:from-black/40"
                  />

                  {/* Plotted point resting on the frame — the monogram's mark. */}
                  <motion.span
                    aria-hidden="true"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: reduce ? 0 : 0.6,
                      delay: reduce ? 0 : 1.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="absolute bottom-4 left-4 grid size-14 place-items-center rounded-full bg-marigold text-white shadow-lg sm:size-16 dark:text-paper"
                  >
                    <GrowthFigures className="w-8 sm:w-9" />
                  </motion.span>
                </div>

                <figcaption className="mt-5 flex items-baseline justify-between gap-4 border-t border-line pt-3">
                  <span className="font-display text-base">Dr. Sayan Banerjee</span>
                  <span className="label text-right">MD · DM</span>
                </figcaption>
              </figure>
            </div>
          </motion.div>
        </div>

        {/* ── Sanskrit line + scroll cue ───────────────────────────── */}
        <motion.div
          {...rise(0.6, reduce)}
          className="mt-16 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between lg:mt-24"
        >
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-deva text-lg text-marigold">{site.sanskrit.text}</span>
            <span className="text-sm text-ink-faint italic">{site.sanskrit.translation}</span>
          </p>

          <a
            href="#practice"
            className="group label inline-flex items-center gap-2.5 transition-colors hover:text-marigold"
          >
            Scroll
            <span className="grid size-7 place-items-center rounded-full border border-line transition-colors group-hover:border-marigold">
              <svg viewBox="0 0 12 12" className="size-2.5 animate-bounce" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 1.5v9M2.5 7 6 10.5 9.5 7" />
              </svg>
            </span>
          </a>
        </motion.div>
      </Container>
    </section>
  );
}
