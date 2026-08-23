"use client";

import { useState } from "react";

import { CheckIcon, LinkIcon, MailIcon, XIcon } from "@/components/motif/share-icons";
import { WhatsAppIcon } from "@/components/motif/whatsapp-icon";
import { site } from "@/lib/site";

type Labels = {
  share: string;
  copy: string;
  copied: string;
  email: string;
};

const EN: Labels = {
  share: "Share",
  copy: "Copy link",
  copied: "Link copied",
  email: "Email",
};

/** Bengali strings for the /bn page. WhatsApp and X stay as brand names. */
export const SHARE_LABELS_BN: Labels = {
  share: "শেয়ার করুন",
  copy: "লিঙ্ক কপি করুন",
  copied: "কপি হয়েছে",
  email: "ইমেল",
};

/** The site's circular icon button, as used by the theme toggle and header. */
const button =
  "grid size-9 shrink-0 place-items-center rounded-full border border-line text-ink-muted transition-colors hover:border-marigold hover:text-marigold";

/**
 * Share links for anything with a title and a URL.
 *
 * Articles pass a `slug` and the URL is built from it; videos pass their
 * YouTube `url` directly, because the thing worth forwarding is the video
 * itself rather than the page that happens to embed it.
 *
 * The labels are not dropped for the icons, only moved: each button keeps its
 * name in `aria-label` and in a tooltip, so the row stays usable for screen
 * readers and for anyone who does not recognise a glyph.
 */
export function ShareRow({
  title,
  slug,
  url: explicitUrl,
  labels = EN,
  className = "",
  /**
   * Set to "bn" alongside SHARE_LABELS_BN. Without it the `:lang(bn) .label`
   * rule never matches the "Share" eyebrow, so Bengali renders in JetBrains
   * Mono (which has no Bengali glyphs) with 0.18em Latin tracking.
   */
  lang,
}: {
  title: string;
  slug?: string;
  url?: string;
  labels?: Labels;
  className?: string;
  lang?: string;
}) {
  const [copied, setCopied] = useState(false);
  const url = explicitUrl ?? `${site.url}/blog/${slug}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked — the other share links still work */
    }
  }

  const links = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
      icon: <WhatsAppIcon className="size-[1.05rem]" />,
    },
    {
      key: "email",
      label: labels.email,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
      icon: <MailIcon className="size-[1.05rem]" />,
    },
    {
      key: "x",
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      icon: <XIcon className="size-[0.95rem]" />,
    },
  ];

  return (
    <div lang={lang} className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span className="label mr-1">{labels.share}</span>

      {links.map((link) => (
        <a
          key={link.key}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          title={link.label}
          className={button}
        >
          {link.icon}
        </a>
      ))}

      <button
        type="button"
        onClick={copy}
        aria-label={copied ? labels.copied : labels.copy}
        title={copied ? labels.copied : labels.copy}
        className={copied ? `${button} border-marigold text-marigold` : button}
      >
        {copied ? (
          <CheckIcon className="size-[1.05rem]" />
        ) : (
          <LinkIcon className="size-[1.05rem]" />
        )}
      </button>

      {/* The tick is the visual confirmation; this is the same news for
          anyone not looking at it. */}
      <span aria-live="polite" className="sr-only">
        {copied ? labels.copied : ""}
      </span>
    </div>
  );
}
