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

Everything the Vite version had still works (✔), plus what was added (＋):

- ✔ Home page: hero, latest/flash deals with countdown, categories, best sellers, product grid, service promises
- ✔ About page: story, stats, team, service promises
- ✔ Contact page with phone/email and a contact form (＋ now actually sends, validated, stored)
- ✔ Login and sign-up pages (＋ now real local accounts with hashed passwords and sessions)
- ✔ Cart with quantity and remove, persisted (＋ quantity stepper, undo, save for later, promo code `SARANI10`)
- ✔ Favourites / wishlist, persisted (old `/addtofavourite` URL redirects to `/wishlist`)
- ✔ Checkout with billing details, cart totals, free shipping and cash on delivery (＋ validated address, express delivery, demo online payment, review step)
- ✔ Toast notifications for cart and wishlist actions
- ＋ Full catalogue at `/shop`: department, price, rating, on-sale and in-stock filters; six sort orders; search; filter chips; mobile filter sheet
- ＋ Department pages at `/c/[slug]`
- ＋ Product pages with gallery (swipe on mobile, hover magnifier on desktop), variant options with price changes, quantity, buy now, delivery estimate, specs, ratings breakdown, related products, sticky mobile buy bar
- ＋ Header search with live suggestions and keyboard navigation (Ctrl/⌘ K)
- ＋ Order confirmation, order detail with tracking, order history in Account
- ＋ Light / dark / system theme with no flash; designed dark palette
- ＋ Mobile-first layout with a bottom tab bar on phones
- ＋ PWA: manifest, icons (incl. maskable and Apple touch), offline fallback page, service worker caching
- ＋ SEO: per-page metadata, Open Graph image, `sitemap.xml`, `robots.txt`, JSON-LD (Organization, WebSite search, Product with offers/rating/shipping/returns, BreadcrumbList)
- ＋ Loading skeletons, designed empty, error and 404 states; reduced-motion support

## Things for the owner to replace

- Contact details in `src/lib/site.ts` (address, email, phone) were carried over from the original template.
- Team names on the About page are placeholders (the originals were celebrity names on stock photos).
- Product names and descriptions were rewritten to match the photos; prices are illustrative.
- `data/store.json` is a local file store. For a hosted deployment with a read-only filesystem (e.g. Vercel), swap `src/lib/db.ts` for a database.

See `DESIGN.md` for the brand, palette, type and motion rules.
