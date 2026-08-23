/**
 * One-off asset pipeline: turns the raw photographs in ./dr-sayan-pic into
 * web-sized JPEGs under public/portraits, and the raw video poster frames in
 * ./media-source into web-sized JPEGs under public/media. Re-run it whenever a
 * source image is replaced.
 *
 * Run with: node scripts/prepare-images.mjs
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(here, "../dr-sayan-pic");
const out = path.resolve(here, "../public/portraits");

const jobs = [
  { in: "pic1.png", out: "portrait-hero.jpg", width: 1400, quality: 88 },
  { in: "pic1.png", out: "portrait-hero-sm.jpg", width: 720, quality: 84 },
  { in: "pic2.jpeg", out: "portrait-clinic.jpg", width: 1400, quality: 84 },
  { in: "pic3.jpeg", out: "portrait-studio.jpg", width: 1200, quality: 84 },
  { in: "conference pic.jpg", out: "portrait-conference.jpg", width: 1600, quality: 84 },
  // Speaking at the RSSDIWB 2026 annual conference. Used on /media.
  { in: "lecture-rssdiwb-2026.jpg", out: "portrait-lecture.jpg", width: 1280, quality: 84 },
];

await mkdir(out, { recursive: true });

for (const job of jobs) {
  const file = path.join(src, job.in);
  await sharp(file)
    .rotate()
    .resize({ width: job.width, withoutEnlargement: true })
    .jpeg({ quality: job.quality, mozjpeg: true, progressive: true })
    .toFile(path.join(out, job.out));
  const meta = await sharp(path.join(out, job.out)).metadata();
  console.log(`✓ ${job.out}  ${meta.width}×${meta.height}`);
}

/**
 * Video poster frames.
 *
 * These are YouTube's own `maxresdefault` thumbnails, downloaded once and
 * served from our origin. Hot-linking i.ytimg.com would hand YouTube a
 * request — and a cookie opportunity — on every page load, which defeats the
 * point of the click-to-load embed on /media.
 *
 * Refresh a frame with:
 *   curl -L -o media-source/<name>.jpg https://i.ytimg.com/vi/<videoId>/maxresdefault.jpg
 */
const mediaSrc = path.resolve(here, "../media-source");
const mediaOut = path.resolve(here, "../public/media");

const mediaJobs = [
  { in: "video-diabetes-in-children.jpg", out: "video-diabetes-in-children.jpg", width: 1280, quality: 82 },
  { in: "video-dka-silent-emergency.jpg", out: "video-dka-silent-emergency.jpg", width: 1280, quality: 82 },
  {
    in: "video-bengali-podcast-diabetes.jpg",
    out: "video-bengali-podcast-diabetes.jpg",
    width: 1280,
    quality: 82,
  },
];

await mkdir(mediaOut, { recursive: true });

for (const job of mediaJobs) {
  await sharp(path.join(mediaSrc, job.in))
    .resize({ width: job.width, withoutEnlargement: true })
    .jpeg({ quality: job.quality, mozjpeg: true, progressive: true })
    .toFile(path.join(mediaOut, job.out));
  const meta = await sharp(path.join(mediaOut, job.out)).metadata();
  console.log(`✓ media/${job.out}  ${meta.width}×${meta.height}`);
}
