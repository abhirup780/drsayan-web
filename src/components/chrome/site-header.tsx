"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Monogram } from "@/components/motif/monogram";
import { WhatsAppIcon } from "@/components/motif/whatsapp-icon";
import { ThemeToggle } from "@/components/chrome/theme-toggle";
import { bengaliPage, contact, nav, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openedOn, setOpenedOn] = useState(pathname);
  const reduce = useReducedMotion();

  // Close the sheet the moment the route changes. Adjusting state during
  // render (rather than in an effect) avoids a flash of the open menu on the
  // page the visitor has just navigated to.
  if (openedOn !== pathname) {
    setOpenedOn(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the sheet while it is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)]",
          scrolled
            ? "border-b border-line bg-paper/85 backdrop-blur-xl supports-backdrop-filter:bg-paper/70"
            : "border-b border-transparent"
        )}
      >
        {/* ── Utility strip ─────────────────────────────────────
            Contact details, language and theme live here rather than in the
            main bar. Seven nav items plus two phone numbers plus a CTA does
            not fit on one line at any realistic width — it was wrapping every
            label onto two lines. Giving the numbers their own row also gives
            them more prominence, not less.

            It collapses to nothing on scroll, so the header shrinks to the
            compact bar once you are reading. */}
        <div
          className={cn(
            // The row must clear the 36px ThemeToggle with room to spare —
            // at h-9 the button exactly filled it and its border was clipped
            // by the overflow-hidden this collapse animation needs.
            "hidden overflow-hidden border-b border-line-soft bg-paper-sunk/80 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] lg:block",
            scrolled ? "h-0 opacity-0" : "h-11 opacity-100"
          )}
        >
          <div className="mx-auto flex h-11 w-full max-w-[92rem] items-center justify-end gap-5 px-8">
            {contact.whatsappHref && (
              <a
                href={contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Message Dr. Banerjee on WhatsApp at ${contact.whatsappDisplay}`}
                className="link-underline flex shrink-0 items-center gap-2 text-[0.8rem] whitespace-nowrap text-ink-muted transition-colors hover:text-marigold"
              >
                <WhatsAppIcon className="size-3.5 shrink-0 text-marigold" />
                {contact.whatsappDisplay}
              </a>
            )}

            <span aria-hidden="true" className="h-3 w-px shrink-0 bg-line" />

            <a
              href={contact.phoneHref}
              className="link-underline shrink-0 text-[0.8rem] whitespace-nowrap text-ink-muted transition-colors hover:text-marigold"
            >
              {contact.phoneDisplay}
            </a>

            <ThemeToggle />
          </div>
        </div>

        <div className="mx-auto flex h-16 w-full max-w-[92rem] items-center gap-6 px-5 sm:h-20 sm:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 text-ink"
            aria-label={`${site.name}, home`}
          >
            <Monogram className="w-9 shrink-0 sm:w-10" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-[0.98rem] tracking-tight sm:text-[1.05rem]">
                Dr. Sayan Banerjee
              </span>
              <span className="label mt-1 hidden text-[0.58rem] sm:block">
                {site.shortRole} · {site.city}
              </span>
            </span>
          </Link>

          <nav aria-label="Primary" className="ml-auto hidden items-center gap-5 lg:flex xl:gap-7">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "link-underline shrink-0 text-[0.9rem] whitespace-nowrap transition-colors",
                    active ? "text-marigold" : "text-ink-muted hover:text-ink"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* The Bengali page sits with the other pages rather than in the
                contact strip: it is a page of the site, not a utility. The
                capsule sets it apart from the English links without needing a
                divider, and gives the language switch the weight it deserves
                on a practice serving Bengali-speaking families. */}
            <Link
              href={bengaliPage.href}
              lang="bn"
              className={cn(
                "inline-flex h-8 shrink-0 items-center rounded-full border px-4 text-[0.95rem] leading-none whitespace-nowrap transition-colors",
                pathname === bengaliPage.href
                  ? "border-marigold bg-marigold text-white dark:text-paper"
                  : "border-marigold/40 text-marigold hover:border-marigold hover:bg-marigold hover:text-white dark:hover:text-paper"
              )}
            >
              {bengaliPage.label}
            </Link>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-6 lg:gap-3">
            {/* Below lg the utility strip is hidden, so language and theme
                fall back into the main bar alongside the menu button. */}
            {/* Visible at every width including the narrowest phones. On a
                practice serving Bengali-speaking families the language switch
                earns bar space ahead of a theme toggle, so below sm the
                toggle moves into the menu and this stays. Compact sizing
                keeps the row inside 375px. */}
            <Link
              href={bengaliPage.href}
              lang="bn"
              className={cn(
                "inline-flex h-9 shrink-0 items-center rounded-full border px-3 text-[0.8rem] whitespace-nowrap transition-colors sm:px-3.5 sm:text-[0.85rem] lg:hidden",
                pathname === bengaliPage.href
                  ? "border-marigold bg-marigold text-white dark:text-paper"
                  : "border-marigold/40 text-marigold hover:border-marigold"
              )}
            >
              {bengaliPage.label}
            </Link>
            <span className="hidden sm:block lg:hidden">
              <ThemeToggle />
            </span>

            {contact.whatsappHref && (
              <a
                href={contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Message Dr. Banerjee on WhatsApp at ${contact.whatsappDisplay}`}
                className="hidden size-9 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors hover:border-marigold hover:text-marigold sm:grid lg:hidden"
              >
                <WhatsAppIcon className="size-4 shrink-0 text-marigold" />
              </a>
            )}

            <Link
              href="/contact#book"
              className="hidden h-9 shrink-0 items-center rounded-full bg-ink px-4 text-[0.8125rem] font-medium whitespace-nowrap text-paper transition-colors hover:bg-marigold hover:text-white sm:inline-flex dark:hover:text-paper"
            >
              Book a visit
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors hover:border-marigold lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-current transition-all duration-300 [transition-timing-function:var(--ease-out-expo)]",
                    open ? "top-1.5 rotate-45" : "top-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-current transition-all duration-300 [transition-timing-function:var(--ease-out-expo)]",
                    open ? "top-1.5 -rotate-45" : "top-3"
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            className="fixed inset-0 z-40 bg-paper lg:hidden"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav
              aria-label="Mobile"
              className="flex h-full flex-col justify-center gap-1 px-6 pt-20 pb-10"
            >
              {[{ href: "/", label: "Home" }, ...nav, bengaliPage].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    className="flex items-baseline gap-4 border-b border-line-soft py-4"
                  >
                    <span className="label w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className="font-display text-3xl"
                      lang={item.href === bengaliPage.href ? "bn" : undefined}
                    >
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}

              <div className="mt-8 flex flex-col gap-3">
                {contact.whatsappHref && (
                  <a
                    href={contact.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-marigold text-[0.9375rem] font-medium text-white dark:text-paper"
                  >
                    <WhatsAppIcon className="size-[1.05rem] shrink-0" />
                    WhatsApp {contact.whatsappDisplay}
                  </a>
                )}
                <Link
                  href="/contact#book"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-ink text-[0.9375rem] font-medium text-paper"
                >
                  Book a visit
                </Link>
                <a
                  href={contact.phoneHref}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-line text-[0.9375rem] text-ink"
                >
                  Call {contact.phoneDisplay}
                </a>

                {/* The toggle is hidden from the bar below sm so the Bengali
                    pill can keep its place there, so it lives here instead
                    and is never unreachable on a phone. */}
                <div className="mt-2 flex items-center justify-between border-t border-line pt-5 sm:hidden">
                  <span className="label">Appearance</span>
                  <ThemeToggle />
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
