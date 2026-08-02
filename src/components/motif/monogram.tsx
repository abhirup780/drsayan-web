import { GrowthFiguresAccent } from "./growth-figures";

/**
 * The site mark, used beside the wordmark in the header and footer.
 *
 * It is the three growing figures rather than an abstract curve: a parent
 * arriving on this site should recognise what the practice does without
 * having to decode a symbol first.
 *
 * Kept as its own component so every consumer imports one stable name; the
 * geometry lives in `growth-figures.tsx`. Callers set the width and the
 * height follows the aspect ratio, so pass `w-*` rather than `size-*`.
 */
export function Monogram({ className }: { className?: string }) {
  return <GrowthFiguresAccent className={className} />;
}
