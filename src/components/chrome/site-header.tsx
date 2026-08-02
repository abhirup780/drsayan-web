"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Monogram } from "@/components/motif/monogram";
import { ThemeToggle } from "@/components/chrome/theme-toggle";
import { contact, nav, site } from "@/lib/site";
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
        <div className="mx-auto flex h-16 w-full max-w-[92rem] items-center gap-6 px-5 sm:h-20 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 text-ink"
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

          <nav aria-label="Primary" className="ml-auto hidden items-center gap-7 lg:flex">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "link-underline text-[0.9rem] transition-colors",
                    active ? "text-marigold" : "text-ink-muted hover:text-ink"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:gap-3">
            <ThemeToggle />
            <a
              href={contact.phoneHref}
              className="hidden h-9 items-center rounded-full border border-line px-4 text-[0.8125rem] text-ink transition-colors hover:border-marigold hover:text-marigold md:inline-flex"
            >
              {contact.phoneDisplay}
            </a>
            <Link
              href="/contact#book"
              className="hidden h-9 items-center rounded-full bg-ink px-4 text-[0.8125rem] font-medium text-paper transition-colors hover:bg-marigold hover:text-white sm:inline-flex dark:hover:text-ink"
            >
              Book a visit
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-9 place-items-center rounded-full border border-line text-ink transition-colors hover:border-marigold lg:hidden"
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
              {[{ href: "/", label: "Home" }, ...nav].map((item, i) => (
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
                    <span className="font-display text-3xl">{item.label}</span>
                  </Link>
                </motion.div>
              ))}

              <div className="mt-8 flex flex-col gap-3">
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
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
