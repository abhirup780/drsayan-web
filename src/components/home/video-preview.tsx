import { ShareRow } from "@/components/blog/share-row";
import { VideoEmbed } from "@/components/media/video-embed";
import { Container } from "@/components/ui/container";
import { Cta } from "@/components/ui/cta";
import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { mediaAppearances } from "@/lib/site";

/**
 * One recorded talk on the landing page.
 *
 * Deliberately one, not the whole shelf. Both talks are about diabetes, which
 * is one of eight condition groups this practice covers — running both here
 * would tell a parent worried about their child's height that they are on a
 * diabetes clinic's website. The rest live on /media.
 *
 * The embed is the same click-to-load facade used there, so this costs one
 * local JPEG and nothing from YouTube until somebody presses play.
 */
export function VideoPreview({ index = "07" }: { index?: string }) {
  // Explicitly English: the Bengali podcast belongs on /bn and /media, not
  // fronting an English landing page. Matching on language rather than on
  // array position means reordering `mediaAppearances` cannot break this.
  const video = mediaAppearances.find(
    (item) => item.kind === "video" && item.lang === "en" && item.videoId
  );
  if (!video?.videoId || !video.poster) return null;

  return (
    <section className="border-t border-line bg-paper-raised py-16 sm:py-24 lg:py-32">
      <Container width="wide">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <SectionHead
              index={index}
              eyebrow="In his own words"
              title="Ten minutes, no jargon."
              lede="Recorded at the hospital for families rather than for colleagues. Nothing loads from YouTube until you press play."
            />

            <p className="mt-8 border-l-2 border-marigold/40 pl-5 text-[0.95rem] leading-relaxed text-ink-muted">
              {video.note}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Cta href="/media" variant="outline">
                All talks &amp; press
              </Cta>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-7">
            <VideoEmbed videoId={video.videoId} title={video.title} poster={video.poster} />
            <p className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
              <span className="font-display text-lg leading-snug">{video.title}</span>
              <span className="label shrink-0">{video.outlet}</span>
            </p>
            <ShareRow
              title={video.title}
              url={video.url}
              className="mt-4 border-t border-line pt-4"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
