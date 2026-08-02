import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

type Props = {
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
  id?: string;
};

/**
 * The recurring section masthead: an index number, a mono eyebrow, a hairline
 * rule and a display-serif title. Repeating it verbatim is what makes the page
 * feel like a printed periodical rather than a stack of unrelated blocks.
 */
export function SectionHead({
  index,
  eyebrow,
  title,
  lede,
  className,
  align = "left",
  id,
}: Props) {
  return (
    <Reveal className={cn(align === "center" && "text-center", className)}>
      <div
        className={cn(
          "flex items-baseline gap-4",
          align === "center" && "justify-center"
        )}
      >
        {index && <span className="label text-marigold">{index}</span>}
        <span className="label">{eyebrow}</span>
        {align === "left" && <span className="rule mt-auto mb-1.5 hidden flex-1 sm:block" />}
      </div>

      <h2
        id={id}
        className={cn(
          "font-display mt-5 text-(length:--text-display) leading-[0.98]",
          align === "center" && "mx-auto max-w-3xl"
        )}
      >
        {title}
      </h2>

      {lede && (
        <p
          className={cn(
            "mt-5 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {lede}
        </p>
      )}
    </Reveal>
  );
}
