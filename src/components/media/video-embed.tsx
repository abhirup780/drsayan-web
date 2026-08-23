"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * A YouTube embed that does not load YouTube.
 *
 * Until someone presses play this is a local JPEG and a button — no iframe, no
 * third-party script, no cookie, and none of the ~1MB the YouTube player costs.
 * On click it swaps in a `youtube-nocookie.com` iframe with `autoplay=1`, so
 * the press that loads the player is also the press that starts the video.
 *
 * The poster frames live in public/media and are produced by
 * scripts/prepare-images.mjs. Hot-linking i.ytimg.com instead would give
 * YouTube a request on every page load and defeat the whole arrangement.
 */
export function VideoEmbed({
  videoId,
  title,
  poster,
}: {
  videoId: string;
  title: string;
  poster: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-paper-sunk">
      {playing ? (
        <iframe
          // `nocookie` is the privacy-preserving host; `autoplay` because the
          // click that mounted this iframe was already a request to play.
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          <Image
            src={poster}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.03]"
          />

          {/* Scrim: keeps the play button legible over a bright frame. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-ink/25 transition-colors duration-500 group-hover:bg-ink/35"
          />

          <span
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper/95 shadow-lg transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-110 group-hover:bg-marigold sm:size-20"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="ml-1 size-6 text-ink transition-colors duration-500 group-hover:text-white sm:size-7 dark:group-hover:text-paper"
            >
              <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11.14-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
            </svg>
          </span>

          <span className="label absolute bottom-4 left-4 rounded-full bg-paper/90 px-3 py-1.5 text-ink">
            Loads from YouTube on play
          </span>
        </button>
      )}
    </div>
  );
}
