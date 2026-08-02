import { cn } from "@/lib/utils";

type Tone = "note" | "warn";

const tones: Record<Tone, { wrap: string; label: string; icon: React.ReactNode }> = {
  note: {
    wrap: "border-teal/30 bg-teal/5",
    label: "text-teal",
    icon: (
      <path d="M12 16v-5M12 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    ),
  },
  warn: {
    wrap: "border-marigold/35 bg-marigold-wash/60",
    label: "text-marigold",
    icon: (
      <path d="M12 9v4M12 17h.01M10.3 3.9 2.4 17.3A2 2 0 0 0 4.1 20.3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    ),
  },
};

/**
 * Used inside MDX as <Callout type="warn" title="…">…</Callout>.
 * Two tones only — a teal aside and a marigold caution — because a third
 * would stop either from meaning anything.
 */
export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: Tone;
  title?: string;
  children: React.ReactNode;
}) {
  const tone = tones[type];

  return (
    <aside className={cn("my-8 rounded-xl border p-5 sm:p-6", tone.wrap)}>
      <div className={cn("flex items-center gap-2.5", tone.label)}>
        <svg
          viewBox="0 0 24 24"
          className="size-4 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {tone.icon}
        </svg>
        <p className="label text-current">{title ?? (type === "warn" ? "Important" : "Note")}</p>
      </div>
      <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed text-ink-muted [&_a]:text-ink [&_strong]:text-ink">
        {children}
      </div>
    </aside>
  );
}
