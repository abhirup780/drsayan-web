"use client";

import { useState } from "react";

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

/**
 * Share links for anything with a title and a URL.
 *
 * Articles pass a `slug` and the URL is built from it; videos pass their
 * YouTube `url` directly, because the thing worth forwarding is the video
 * itself rather than the page that happens to embed it.
 */
export function ShareRow({
  title,
  slug,
  url: explicitUrl,
  labels = EN,
  className = "",
}: {
  title: string;
  slug?: string;
  url?: string;
  labels?: Labels;
  className?: string;
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
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
    },
    {
      label: labels.email,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${className}`}>
      <span className="label">{labels.share}</span>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline text-[0.85rem] text-ink-muted transition-colors hover:text-marigold"
        >
          {link.label}
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        className="link-underline text-[0.85rem] text-ink-muted transition-colors hover:text-marigold"
      >
        {copied ? labels.copied : labels.copy}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? labels.copied : ""}
      </span>
    </div>
  );
}
