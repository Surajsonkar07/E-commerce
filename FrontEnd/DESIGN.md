# Sarani — design notes

**Brand idea.** Sarani is a small, modern general store named after Bijoy Sarani, the Dhaka street in the original site's address. It stocks one good version of each thing and prices it plainly. The visual language borrows from the shop counter: **price tags, ledgers, receipts and catalogue numbers**, not from SaaS templates.

## Palette (OKLCH, defined in `src/app/globals.css`)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `0.975 0.008 75` warm off-white | `0.185 0.012 60` warm charcoal | page background |
| `--surface` | `0.995 0.004 75` | `0.225 0.014 60` | cards, receipts, inputs |
| `--sunken` | `0.948 0.011 75` | `0.16 0.011 60` | chips, hover fills |
| `--ink` | `0.22 0.018 50` | `0.95 0.01 80` | text, inverse buttons |
| `--ink-soft` | `0.45 0.02 55` | `0.74 0.016 70` | secondary text (AA on paper) |
| `--primary` vermilion | `0.55 0.185 33` | `0.70 0.16 38` | primary actions, active states, the tag mark |
| `--accent` ochre | `0.83 0.135 84` | `0.80 0.125 84` | sale tags, highlights, rating stars |
| `--plinth` | `0.945 0.012 75` | `0.875 0.012 75` | product image tiles |

Dark mode is tuned separately, not inverted: the vermilion is lifted for contrast and the text on it turns dark; product tiles (the "plinth") stay light in dark mode, like goods on a lit counter, so the white-background product cut-outs still blend via `mix-blend-mode: multiply`.

Text contrast: ink/paper and ink-soft/paper pass WCAG AA in both themes; primary buttons use `--primary-ink` (white in light, near-black in dark) for ≥ 4.5:1.

## Type

- **Display:** Bricolage Grotesque (variable, opsz + wdth): headlines, tight tracking (−0.02 to −0.045em), leading 0.9–1.05.
- **UI:** Geist, 15–17 px body.
- **Mono:** Geist Mono for prices, SKUs, counts, eyebrows and receipts: tabular figures everywhere money appears.
- Scale (fluid with `clamp`): eyebrow 11.5 px mono caps · body 15/17 · h3 18 · h2 28→44 · h1 36→88.

## Shape & space

- 4/8 px spacing grid; page gutter 16 / 24 / 40 px; max width 88rem on a 12-column grid.
- Radius: 4 (chips), 8 (controls), 14 (cards), 20 (feature panels). Buttons are rectangular-ish (8 px); filters and tags are pills.
- Section headers are "ledger" style: a full-width ink rule, a `§0n` catalogue number in vermilion, a mono eyebrow, then the headline.
- Sale badges are swing-tags (clipped polygon with a punched hole). Order summaries are receipts (dashed rules, mono figures, a torn bottom edge).
- Layouts vary by content: split editorial hero with a bento of product tiles, a marquee ticker, a horizontal department rail, product grid, a dark full-bleed feature band, a ranked best-seller ledger, a definition-list promise block, a timeline on About.

## Motion

- 150–300 ms, ease-out `cubic-bezier(0.22, 1, 0.36, 1)`; springs only for tiny confirmations (badge counts, heart).
- Route change: CSS fade-up 260 ms (no JS wait). Sections: staggered reveal on scroll (`Stagger`/`Reveal`). Stats count up on About.
- Hover: product images scale 1.06, quick-add slides up; press: buttons scale 0.98.
- Sheets slide from the side/bottom; accordions animate height; cart rows collapse on removal.
- Everything respects `prefers-reduced-motion` (global CSS override + `MotionConfig reducedMotion="user"`).

## Icons & imagery

- `lucide-react` line icons at 1.75–2 px stroke; never emoji.
- Product photos are the originals from `src/assets`, trimmed, squared and converted to WebP by `scripts/prepare-images.mjs`.
- PWA icon: the vermilion tag with a serif "s", also used as the logo mark.
