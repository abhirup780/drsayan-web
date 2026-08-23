import type { Metadata, Viewport } from "next";
import {
  Fraunces,
  Inter,
  JetBrains_Mono,
  Noto_Serif_Bengali,
  Tiro_Devanagari_Sanskrit,
} from "next/font/google";

import { SiteHeader } from "@/components/chrome/site-header";
import { SiteFooter } from "@/components/chrome/site-footer";
import { ThemeScript } from "@/components/chrome/theme-script";
import { PersonJsonLd } from "@/components/seo/json-ld";
import { isCanonicalDomain, site, verification } from "@/lib/site";

import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-ui",
});

/**
 * Bengali is a first-class language on this site, not a transliteration: the
 * Bengali landing page and the News18 press quote are both set in it. Fraunces
 * has no Bengali coverage, so without this the browser would fall back to
 * whatever the OS happens to ship and the page would lose its typography.
 *
 * Two weights only — regular for text, semibold for headings — because the
 * Bengali subset is heavy and every extra weight is another download.
 */
const bengali = Noto_Serif_Bengali({
  subsets: ["bengali"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-bengali",
});

const deva = Tiro_Devanagari_Sanskrit({
  subsets: ["devanagari"],
  weight: "400",
  display: "swap",
  variable: "--font-deva",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.role}, ${site.city}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "paediatric endocrinologist Kolkata",
    "pediatric endocrinologist West Bengal",
    "child growth specialist Kolkata",
    "short stature treatment",
    "type 1 diabetes children Kolkata",
    "thyroid in children",
    "early puberty",
    "PCOS adolescent",
    "DM pediatric endocrinology PGIMER",
    "Dr Sayan Banerjee",
    // The monthly OPD towns: these are the searches families in the districts
    // actually type, and the reason those clinics exist.
    "child hormone doctor Burdwan",
    "paediatric endocrinologist Malda",
    "child diabetes doctor Serampore",
    "paediatric endocrinologist Tamluk",
    "child growth doctor Kolaghat",
    "paediatric endocrinologist Chandipur",
    "child specialist Mankundu",
  ],
  alternates: {
    canonical: "/",
    // The Bengali summary is a real alternate of the site, not a separate
    // site, so search engines are told which language each version serves.
    languages: {
      "en-IN": "/",
      "bn-IN": "/bn",
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} · ${site.role}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.role}`,
    description: site.description,
  },
  // Indexing switches itself on once the site is on its real domain; see
  // `isCanonicalDomain` in src/lib/site.ts.
  robots: {
    index: isCanonicalDomain,
    follow: isCanonicalDomain,
    googleBot: {
      index: isCanonicalDomain,
      follow: isCanonicalDomain,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Emitted only once a token is set, so a failed verification attempt is
  // never recorded against the property. See `verification` in lib/site.ts.
  ...(verification.google ? { verification: { google: verification.google } } : {}),
  category: "health",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ee" },
    { media: "(prefers-color-scheme: dark)", color: "#101315" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${inter.variable} ${mono.variable} ${deva.variable} ${bengali.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:text-paper"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <PersonJsonLd />
      </body>
    </html>
  );
}
