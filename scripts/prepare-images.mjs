/**
 * One-off asset pipeline: turns the raw photographs in ./dr-sayan-pic into
 * web-sized JPEGs under public/portraits. Re-run it whenever a source
 * photograph is replaced.
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
