/**
 * Glyphs for the share row.
 *
 * All in `currentColor`, never in brand colours. WhatsApp green, X black and
 * a blue envelope would put four foreign colours into a row that sits inside
 * a warm-paper, marigold palette, and would make the loudest thing on a video
 * card its share buttons. The shapes carry the recognition on their own.
 *
 * Drawn on a 24 unit grid to match WhatsAppIcon, so they optically align at
 * the same rendered size.
 */

export function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="M3 7l8.4 5.6a1.5 1.5 0 0 0 1.7 0L21 7" />
    </svg>
  );
}

export function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M17.53 3h3.05l-6.66 7.62L21.75 21h-6.13l-4.8-6.28L5.32 21H2.26l7.12-8.14L2.25 3h6.29l4.34 5.74L17.53 3Zm-1.07 16.16h1.69L7.62 4.75H5.8l10.66 14.41Z" />
    </svg>
  );
}

export function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M10 13.5a3.5 3.5 0 0 0 5.1.4l3-3a3.6 3.6 0 0 0-5.1-5.1l-1.7 1.7" />
      <path d="M14 10.5a3.5 3.5 0 0 0-5.1-.4l-3 3a3.6 3.6 0 0 0 5.1 5.1l1.7-1.7" />
    </svg>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4.5 12.5l5 5 10-10" />
    </svg>
  );
}
