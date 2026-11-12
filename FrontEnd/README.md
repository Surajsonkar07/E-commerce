# Sarani — general store (Next.js)

An online general store: gaming gear, computing, phones, cameras, home goods, fashion, sport, kids and pets. It was a Vite + React prototype (the "Exclusive" template) and is now a full Next.js App Router store with a product API, local accounts, a mock checkout and order tracking.

The app lives in this folder (`FrontEnd/`), which is where the Vite app was, so the git history stays in one place.

## Run it

Requires Node 20.9+ (tested on Node 24).

```bash
npm install
cp .env.example .env.local   # optional in development
npm run dev                  # http://localhost:3000 (Turbopack, no service worker)
```

Production build (includes the PWA service worker, which needs webpack):

```bash
npm run build                # next build --webpack
npm start
```

Other scripts: `npm run lint`, `npm run typecheck`, `node scripts/prepare-images.mjs` (regenerates product WebPs and PWA icons from `src/assets`).

### Environment variables

| Name | Needed | What it does |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | production | Public base URL for canonical links, sitemap, Open Graph and JSON-LD. Defaults to `http://localhost:3000`. |
| `AUTH_SECRET` | production | Signs session cookies. A built-in development secret is used if unset (a warning is logged in production). |

No third-party keys are needed: payments are simulated and nothing is emailed.

## How it works

- **Catalogue:** `data/products.json` (16 products, 9 departments, options/variants, specs). Read by server components and by the API.
- **Store data:** users, orders, contact messages and newsletter sign-ups are written to `data/store.json` (created on first write, git-ignored) through `src/lib/db.ts`, a small JSON store with serialised, atomic writes.
- **Auth:** email + password, hashed with scrypt; an HMAC-signed, httpOnly session cookie (30 days). Pages stay static; the header asks `/api/auth/me`.
- **Cart & wishlist:** Zustand, persisted to `localStorage`, so they survive reloads and work offline.
- **Checkout:** prices are always recomputed on the server from the catalogue. Payment is mocked: "Pay now (demo)" is approved after a short simulated authorisation and never asks for card details; "Cash on delivery" marks the order as due on delivery.
- **Order tracking:** a simulated timeline (placed → packed → out for delivery → delivered) based on the time since the order was placed.

### API (Route Handlers)

| Method & path | Purpose |
|---|---|
| `GET /api/products?q=&category=a,b&price=50-150&rating=4&sale=1&stock=1&sort=price-asc&limit=` | Search, filter and sort products |
| `GET /api/products/:slug` | One product with options and specs |
| `GET /api/categories` | Departments with product counts |
| `POST /api/auth/signup` · `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/me` | Local accounts |
| `GET /api/orders` · `POST /api/orders` · `GET /api/orders/:id` | Order history, place order, order detail (signed in) |
| `POST /api/contact` | Help-desk messages |
| `POST /api/newsletter` | Friday list sign-ups |

## Features

Specified in [`docs/PRD.md`](docs/PRD.md) (acceptance criteria) and [`docs/TRD.md`](docs/TRD.md) (routes, APIs, traceability). **(L)** = existed in the old Vite app. Status as of 2026-11-12, checked on a production build (`next start`):

| ID | Feature | Status | How it was verified |
|---|---|---|---|
| F-01 | Home page (L) | ✅ verified | Browser at 1024 px and 375 px, light and dark |
| F-02 | Catalogue `/shop` | ✅ verified | Browser: grid, cards, quick add, counts |
| F-03 | Filters | ✅ verified | Browser: department + sort → URL `?category=gaming&sort=price-asc`, chips; headless: mobile filter sheet |
| F-04 | Sort | ✅ verified | Browser + `GET /api/products?sort=price-asc` |
| F-05 | Search | ✅ verified | Browser: Ctrl K → "oak" → ↓ Enter opens the product; `/shop?q=` |
| F-06 | Department pages | ✅ verified | HTTP 200 for `/c/*`, browser at 360 px, unknown slug → 404 |
| F-07 | Product page and gallery | ✅ verified | Browser mobile (swipe dots) and desktop (thumbnails, magnifier) |
| F-08 | Variants and quantity | ✅ verified | Headless: 512 GB option $899 → $1,199; qty 2 added to bag; sticky bar code path |
| F-09 | Bag (L) | ✅ verified | Browser: add, qty, totals, persisted across reloads |
| F-10 | Promo codes | ✅ verified | Browser: `sarani10` → −$18.00; API recomputes discount server-side |
| F-11 | Wishlist (L) | ✅ verified | Headless: two hearts → persisted after reload → `/addtofavourite` redirects to `/wishlist` showing both |
| F-12 | Accounts (L, was fake) | ✅ verified | API: validation, duplicate email 409, wrong password 401, cookie session; browser: inline sign-in at checkout |
| F-13 | Checkout (L, was fake) | ✅ verified | Browser: sign in → address → delivery → cash on delivery → order placed; API: tampered qty/stock rejected, prices recomputed |
| F-14 | Order confirmation and tracking | ✅ verified | Browser: confirmation banner, timeline, items, totals |
| F-15 | Order history | ✅ verified | Browser: account shows 2 orders and total spent |
| F-16 | About (L) | ✅ verified | Browser desktop |
| F-17 | Help and contact (L, form was fake) | ✅ verified | Browser + `POST /api/contact` returns a reference |
| F-18 | Newsletter (L) | ✅ verified | API: first sign-up stored, duplicate acknowledged |
| F-19 | Product API | ✅ verified | `curl` on every endpoint in the TRD |
| F-20 | Light / dark / system theme | ✅ verified | Browser dark mode; headless: stored theme applied before first paint |
| F-21 | PWA and offline | ✅ verified | Headless Chrome: SW registers and controls the page; with the server stopped, a visited page loads from cache and unvisited pages show `/offline`. (The desktop app's built-in browser pane refuses service workers; that is a pane limitation.) |
| F-22 | SEO | ✅ verified | Lighthouse SEO 100; Product + BreadcrumbList JSON-LD on product pages; Organization + WebSite on home; sitemap has 29 URLs |
| F-23 | Responsive and mobile nav | ✅ verified | Headless: no horizontal scroll at 360 px on 12 pages; drawer and bottom tab bar in browser |
| F-24 | Feedback states and motion | ✅ verified | Toasts, skeletons, empty states, 404 seen in browser; reduced motion handled in CSS and `MotionConfig` |
| F-25 | Accessibility | ✅ verified | Lighthouse Accessibility 100 on home, shop and product |

**Not yet at target:** Lighthouse mobile **Performance** measured 51–76 (target ≥ 90) on this shared machine while other projects were building; identical runs varied by 15+ points. Accessibility, Best Practices and SEO are 100. See TRD §10 for what was optimised and re-measure on an idle machine or the deployed site.

## Things for the owner to replace

- Contact details in `src/lib/site.ts` (address, email, phone) were carried over from the original template.
- Team names on the About page are placeholders (the originals were celebrity names on stock photos).
- Product names and descriptions were rewritten to match the photos; prices are illustrative.
- `data/store.json` is a local file store. For a hosted deployment with a read-only filesystem (e.g. Vercel), swap `src/lib/db.ts` for a database.

See `DESIGN.md` for the brand, palette, type and motion rules.
