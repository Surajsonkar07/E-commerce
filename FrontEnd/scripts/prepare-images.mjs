// One-off asset pipeline: turns the original PNGs in src/assets into
// optimised WebP files under public/, and draws the PWA icons.
// Run with: node scripts/prepare-images.mjs
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = (f) => path.join(root, "src/assets", f);
const out = (f) => path.join(root, "public", f);

await mkdir(out("products"), { recursive: true });
await mkdir(out("images"), { recursive: true });
await mkdir(out("icons"), { recursive: true });

// Cut-out product shots: flatten on white, trim the border, pad to a square
// with breathing room and upscale gently (the originals are ~180 px wide).
const cutouts = {
  "ember-wired-gamepad": "f1.png",
  "prism-mechanical-keyboard": "f2.png",
  "curve-27-gaming-monitor": "f3.png",
  "linden-lounge-chair": "f4.png",
  "weekender-canvas-duffle": "bag.png",
  "coral-field-parka": "shirt.png",
  "halo-240-liquid-cooler": "music.png",
  "oakline-side-table": "table.png",
  "filet-dry-dog-food": "p1.png",
  "snapshot-dslr-kit": "p2.png",
  "nightline-15-gaming-laptop": "p3.png",
  "roadster-kids-ride-on": "p5.png",
  "volt-football-boots": "p6.png",
  "shadow-wireless-gamepad": "p7.png",
  "spruce-bomber-jacket": "p8.png",
};

const SIZE = 640;
for (const [slug, file] of Object.entries(cutouts)) {
  let img = sharp(src(file)).flatten({ background: "#ffffff" });
  if (file === "p2.png") {
    // the camera shot shipped with a baked-in "Add to cart" bar and icons
    // ...and sat on a light grey card: lift that grey to white so it blends.
    img = sharp(
      await img
        .extract({ left: 40, top: 20, width: 185, height: 175 })
        .linear(1.09, -4)
        .toBuffer(),
    );
  }
  const trimmed = await img.trim({ background: "#ffffff", threshold: 18 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  const inner = Math.round(SIZE * 0.78);
  const scale = Math.min(inner / meta.width, inner / meta.height);
  const w = Math.round(meta.width * scale);
  const h = Math.round(meta.height * scale);
  await sharp(trimmed)
    .resize(w, h, { kernel: "lanczos3" })
    .sharpen({ sigma: 0.6 })
    .extend({
      top: Math.floor((SIZE - h) / 2),
      bottom: Math.ceil((SIZE - h) / 2),
      left: Math.floor((SIZE - w) / 2),
      right: Math.ceil((SIZE - w) / 2),
      background: "#ffffff",
    })
    .webp({ quality: 86 })
    .toFile(out(`products/${slug}.webp`));
  console.log("product", slug);
}

// Photo-style product (dark studio shot), cropped square.
await sharp(src("hero.png"))
  .resize(SIZE, SIZE, { fit: "cover", position: "centre", kernel: "lanczos3" })
  .webp({ quality: 86 })
  .toFile(out("products/aurora-6-pro.webp"));
// Wide version for the home page feature.
await sharp(src("hero.png")).webp({ quality: 84 }).toFile(out("images/aurora-wide.webp"));

// Editorial photos.
await sharp(src("about.png")).webp({ quality: 80 }).toFile(out("images/about.webp"));
await sharp(src("login_image.png")).webp({ quality: 78 }).toFile(out("images/sign-in.webp"));
for (const n of [1, 2, 3]) {
  await sharp(src(`team${n}.png`)).webp({ quality: 80 }).toFile(out(`images/team-${n}.webp`));
}

// PWA icons: a vermilion price tag carrying a lowercase "s".
const tag = (size, { maskable = false } = {}) => {
  const pad = maskable ? size * 0.2 : size * 0.08;
  const s = size - pad * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${maskable ? "#c8432b" : "#f7f2ea"}" rx="${maskable ? 0 : size * 0.22}"/>
  <g transform="translate(${pad} ${pad}) scale(${s / 100})">
    ${maskable ? "" : '<path d="M14 8h52l26 26v52a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V14a6 6 0 0 1 6-6z" fill="#c8432b"/>'}
    <circle cx="72" cy="28" r="6" fill="${maskable ? "#f7f2ea" : "#f7f2ea"}"/>
    <text x="46" y="76" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-weight="700" fill="#f7f2ea">s</text>
  </g>
</svg>`;
};
const icons = [
  ["icon-192.png", 192, false],
  ["icon-512.png", 512, false],
  ["icon-maskable-512.png", 512, true],
  ["apple-touch-icon.png", 180, true],
];
for (const [name, size, maskable] of icons) {
  await sharp(Buffer.from(tag(size, { maskable }))).png().toFile(out(`icons/${name}`));
  console.log("icon", name);
}
await writeFile(out("icons/tag.svg"), tag(512));
console.log("done");
