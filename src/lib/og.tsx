import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };

const PAPER = "#f7f4ee";
const INK = "#14181b";
const MARIGOLD = "#b85c17";
const FAINT = "#78838a";

/**
 * Loads a face for the social card from Google Fonts.
 *
 * The spoofed User-Agent matters: to a modern browser string Google serves
 * woff2, which satori cannot parse. To this one it serves ttf.
 *
 * If the network is unavailable at build time the card still renders — just
 * in the runtime's default font — rather than failing the whole build over a
 * decoration.
 */
async function loadFont(
  family: string,
  name: string
): Promise<{ name: string; data: ArrayBuffer }[]> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}&display=swap`,
      { headers: { "User-Agent": "Mozilla/5.0 (compatible; og-image-generator)" } }
    ).then((r) => r.text());

    const url = /src:\s*url\((https:[^)]+\.(?:woff2|ttf))\)/.exec(css)?.[1];
    if (!url) return [];

    const data = await fetch(url).then((r) => r.arrayBuffer());
    return [{ name, data }];
  } catch {
    return [];
  }
}

/** The percentile fan, redrawn at social-card scale. */
function Curves() {
  return (
    <svg
      width="1200"
      height="360"
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      style={{ position: "absolute", left: 0, bottom: 0 }}
    >
      {[
        { d: "M0,26 C22,20 44,15 68,10 C82,7 92,5 100,3.5", w: 0.28, o: 0.25 },
        { d: "M0,28 C22,23 44,18 68,13 C82,10 92,8 100,6.5", w: 0.55, o: 1, c: MARIGOLD },
        { d: "M0,30 C22,26 44,21 68,16 C82,13.5 92,11.5 100,10", w: 0.28, o: 0.25 },
      ].map((curve, i) => (
        <path
          key={i}
          d={curve.d}
          fill="none"
          stroke={curve.c ?? INK}
          strokeWidth={curve.w}
          strokeOpacity={curve.o}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

/**
 * Renders a social card.
 *
 * LATIN SCRIPT ONLY. Do not pass Bengali (or Devanagari) text here, however
 * tempting it is for the /bn card. `next/og` renders through satori, which
 * has no HarfBuzz and therefore does no complex text shaping: Bengali
 * pre-base vowel signs are not reordered and conjuncts are not formed, so
 * বেড়ে comes out as বড়ে with the e-kar stranded after its consonant. The
 * font loads fine; the glyphs are simply placed in logical rather than
 * visual order, and the result is misspelt to a Bengali reader.
 *
 * Loading Noto Serif Bengali does not help, because the problem is shaping,
 * not coverage. A genuine Bengali card needs a pre-rendered PNG produced by
 * something with a shaping engine, dropped into /public and referenced from
 * that page's `openGraph.images`.
 */
export async function renderOgImage({
  eyebrow,
  title,
  meta,
}: {
  eyebrow: string;
  title: string;
  meta?: string;
}) {
  const fonts = await loadFont("Fraunces:opsz,wght@9..144,400;9..144,600", "Fraunces");
  const display = fonts.length > 0 ? "Fraunces" : "serif";

  const caps = { letterSpacing: 5, textTransform: "uppercase" as const };
  const capsSmall = { letterSpacing: 3, textTransform: "uppercase" as const };

  const name = site.name;
  const quals = site.qualifications;
  // City alone. "Paediatric Endocrinologist · Kolkata" is ~540px at this
  // size, which either wrapped into the qualifications beside it or, once
  // pinned, ran off the right edge. The role is already in the eyebrow on
  // every card, so the corner just stamps the place.
  const badge = site.city;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          padding: "72px 80px",
          position: "relative",
        }}
      >
        <Curves />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: MARIGOLD,
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 22,
              color: FAINT,
              display: "flex",
              ...caps,
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 960 }}>
          <div
            style={{
              fontFamily: display,
              fontSize: title.length > 68 ? 62 : 78,
              lineHeight: 1.04,
              letterSpacing: -1.8,
              color: INK,
              display: "flex",
            }}
          >
            {title}
          </div>
          {meta && (
            <div
              style={{
                marginTop: 28,
                fontSize: 26,
                color: FAINT,
                display: "flex",
              }}
            >
              {meta}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid rgba(20,24,27,0.16)`,
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: display, fontSize: 32, color: INK, display: "flex" }}>
              {name}
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 21,
                color: FAINT,
                display: "flex",
              }}
            >
              {quals}
            </div>
          </div>
          {/* The badge wraps to two lines at this length and its second line
              collided with the qualifications beside it. Pinning it to the
              right and letting the name block take the slack keeps the two
              apart. */}
          <div
            style={{
              fontSize: 20,
              color: MARIGOLD,
              display: "flex",
              flexShrink: 0,
              textAlign: "right",
              marginLeft: 40,
              ...capsSmall,
            }}
          >
            {badge}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: fonts.map((f) => ({
        name: f.name,
        data: f.data,
        style: "normal" as const,
        weight: 400 as const,
      })),
    }
  );
}
