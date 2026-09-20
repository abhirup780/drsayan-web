"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Container } from "@/components/ui/container";
import { Cta } from "@/components/ui/cta";
import { SectionHead } from "@/components/ui/section-head";
import { conditionGroups } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * An index, not a card grid. Eight headings on the left; the selected one
 * opens into its full list on the right. It reads like the contents page of
 * a reference book, which is exactly what parents are looking for.
 */
export function ConditionsIndex() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const current = conditionGroups[active];

  return (
    <section id="conditions" className="scroll-mt-24 border-y border-line bg-paper-raised py-16 sm:py-24 lg:py-32">
      <Container width="wide">
        <SectionHead
          index="02"
          eyebrow="Conditions treated"
          title={
            <>
              Eight territories,
              <br className="hidden sm:block" /> one long conversation.
            </>
          }
          lede="If what brings you here is not on this list, it is still worth asking. Much of paediatric endocrinology begins as a question nobody has been able to answer yet."
        />

        <div className="mt-16 grid gap-x-16 gap-y-2 lg:grid-cols-12">
          {/* ── Index column ─────────────────────────────────────── */}
          <ul className="lg:col-span-5" role="list">
            {conditionGroups.map((group, i) => {
              const isActive = i === active;
              return (
                <li key={group.id} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-expanded={isActive}
                    aria-controls={`condition-panel-${group.id}`}
                    className="group flex w-full items-baseline gap-4 py-5 text-left"
                  >
                    <span
                      className={cn(
                        "label shrink-0 transition-colors",
                        isActive && "text-marigold"
                      )}
                    >
                      {group.index}
                    </span>
                    <span
                      className={cn(
                        "font-display text-2xl leading-tight transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] sm:text-[1.75rem]",
                        isActive ? "text-marigold lg:translate-x-2" : "text-ink group-hover:text-marigold"
                      )}
                    >
                      {group.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "ml-auto hidden shrink-0 self-center text-marigold transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] lg:block",
                        isActive ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
                      )}
                    >
                      <svg viewBox="0 0 24 12" className="h-3 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M1 11C6 8 9 6 12 4C15 2 18 1.6 22 1.2" />
                        <circle cx="22" cy="1.2" r="1.4" fill="currentColor" stroke="none" />
                      </svg>
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "ml-auto shrink-0 self-center text-marigold transition-transform duration-300 lg:hidden",
                        isActive && "rotate-45"
                      )}
                    >
                      <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                        <path d="M8 2.5v11M2.5 8h11" />
                      </svg>
                    </span>
                  </button>

                  {/* Inline panel on small screens — the same content, an accordion. */}
                  <div className="lg:hidden">
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          id={`condition-panel-${group.id}`}
                          initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                          exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6">
                            <p className="text-[0.95rem] leading-relaxed text-ink-muted">
                              {group.blurb}
                            </p>
                            <ItemList items={group.items} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* ── Detail column ────────────────────────────────────── */}
          <div className="hidden lg:col-span-7 lg:block">
            <div className="sticky top-28">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  // This AnimatePresence has no `initial={false}`, so the
                  // first mount is server-rendered with `initial` applied.
                  // It must therefore not depend on `reduce`, or the panel
                  // hydrates to a style React refuses to patch and stays at
                  // opacity 0. Reduce lives in the transition instead.
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                  transition={{ duration: reduce ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl border border-line bg-paper p-8"
                >
                  <p className="label">
                    {current.index} / {String(conditionGroups.length).padStart(2, "0")}
                  </p>
                  <h3 className="font-display mt-4 text-3xl">{current.title}</h3>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted">
                    {current.blurb}
                  </p>
                  <ItemList items={current.items} columns />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-4">
          <Cta href="/conditions" variant="outline">
            See every condition in detail
          </Cta>
          <p className="text-sm text-ink-faint">
            Not sure which applies? Describe the concern and the clinic will guide you.
          </p>
        </div>
      </Container>
    </section>
  );
}

function ItemList({ items, columns = false }: { items: string[]; columns?: boolean }) {
  return (
    <ul
      className={cn(
        "mt-7 grid gap-x-8 gap-y-0 border-t border-line",
        columns ? "sm:grid-cols-2" : "grid-cols-1"
      )}
    >
      {items.map((item) => (
        <li
          key={item}
          className="flex items-baseline gap-3 border-b border-line-soft py-2.5 text-[0.9rem] text-ink-muted"
        >
          <span aria-hidden="true" className="mt-2 block h-px w-2.5 shrink-0 bg-marigold" />
          {item}
        </li>
      ))}
    </ul>
  );
}
