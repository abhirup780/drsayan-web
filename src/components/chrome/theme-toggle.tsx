"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * The theme lives on <html> as a class, written before first paint by
 * ThemeScript. This subscribes to that external source of truth rather than
 * duplicating it in React state, so the button can never disagree with the
 * page it is sitting on.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

const isDark = () => document.documentElement.classList.contains("dark");

export function ThemeToggle({ className = "" }: { className?: string }) {
  // There is no <html> during server render; light is the safe first paint.
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* private mode — the choice simply will not persist */
    }
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
      className={`group relative grid size-9 place-items-center rounded-full border border-line text-ink-faint transition-colors hover:border-marigold hover:text-marigold ${className}`}
    >
      {/* A sun that becomes a moon: one circle and one mask, no icon swap. */}
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <defs>
          <mask id="theme-toggle-mask">
            <rect width="24" height="24" fill="white" />
            <circle
              cx={dark ? 16 : 26}
              cy={dark ? 7 : 0}
              r="8"
              fill="black"
              className="transition-all duration-500 [transition-timing-function:var(--ease-out-expo)]"
            />
          </mask>
        </defs>
        <circle
          cx="12"
          cy="12"
          r={dark ? 8 : 5}
          fill="currentColor"
          mask="url(#theme-toggle-mask)"
          className="transition-all duration-500 [transition-timing-function:var(--ease-out-expo)]"
        />
        <g
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          className="origin-center transition-all duration-500 [transition-timing-function:var(--ease-out-expo)]"
          style={{ opacity: dark ? 0 : 1, transform: dark ? "scale(0.4)" : "scale(1)" }}
        >
          <line x1="12" y1="1.5" x2="12" y2="3.5" />
          <line x1="12" y1="20.5" x2="12" y2="22.5" />
          <line x1="1.5" y1="12" x2="3.5" y2="12" />
          <line x1="20.5" y1="12" x2="22.5" y2="12" />
          <line x1="4.6" y1="4.6" x2="6" y2="6" />
          <line x1="18" y1="18" x2="19.4" y2="19.4" />
          <line x1="19.4" y1="4.6" x2="18" y2="6" />
          <line x1="6" y1="18" x2="4.6" y2="19.4" />
        </g>
      </svg>
    </button>
  );
}
