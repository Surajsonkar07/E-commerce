# Sarani: Technical Requirements Document

Companion to [`PRD.md`](./PRD.md). Design rules live in [`../DESIGN.md`](../DESIGN.md).

## 1. Architecture

```
 Browser (React 19)
 ├─ Server-rendered HTML (static where possible: /, /c/*, /product/*, /about, /contact, /login …)
 ├─ Client islands: header (search, counts, session), filters, gallery, purchase panel,
 │  cart, wishlist, checkout, forms, motion
 ├─ Zustand stores ── localStorage "sarani-shop" (bag, wishlist, promo)
 │                 └─ in-memory session (GET /api/auth/me)
 └─ Service worker (Serwist, production only): precache + runtime cache + /offline fallback
            │  fetch / navigation
            ▼
 Next.js 16 App Router (Node runtime)
 ├─ Server components ── src/lib/catalog.ts ── data/products.json   (read-only catalogue)
 ├─ Dynamic pages (/shop, /order/[id], /account) read cookies / searchParams
 ├─ Route handlers  /api/*  ── zod validation
 │     ├─ src/lib/auth.ts   scrypt hashes, HMAC-signed session cookie
 │     └─ src/lib/db.ts     JSON store data/store.json (users, orders, messages, subscribers)
 └─ Metadata routes: manifest, sitemap, robots, opengraph-image
 External services: none (payments simulated, no email, fonts self-hosted)
```

## 2. Stack and folder structure

| Package | Version | Why |
|---|---|---|
| next | 16.4.6 | App Router, server components, route handlers, metadata API, `next/image`, `next/font` |
| react / react-dom | 19.3.1 | required by Next 16 |
| typescript | 5.9.3 | strict typing |
| tailwindcss / @tailwindcss/postcss | 4.3.5 | design tokens via `@theme inline`, CSS-first config |
| radix-ui | 1.8.1 | accessible Dialog/Sheet, Accordion, Slot (shadcn-style wrappers in `components/ui`) |
| class-variance-authority, clsx, tailwind-merge | 0.7.1 / 2.1.1 / 3.7.0 | component variants |
| motion | 14.12.0 | interactive animations on product, bag, wishlist, checkout and contact routes only, via `LazyMotion` + `m` (features load async) |
| next-themes | 0.4.6 | light/dark/system without flash |
| zustand | 5.1.0 | persisted bag/wishlist, session store |
| react-hook-form, @hookform/resolvers, zod | 7.91.0 / 7.0.5 / 4.6.7 | forms and shared server/client validation |
| sonner | 2.0.8 | toasts |
| lucide-react | 1.72.0 | icons |
| @serwist/next, serwist | 9.5.13 | service worker (webpack build) |
| geist, @fontsource-variable/bricolage-grotesque | 1.9.2 / 5.3.0 | self-hosted fonts via `next/font/local` (build works offline) |
| server-only | 0.0.1 | guards server modules |
| sharp (dev) | 0.35.5 | asset pipeline script |
| eslint 9 + eslint-config-next | 9.39.5 / 16.4.6 | lint incl. React Compiler rules |

```
FrontEnd/
├─ data/products.json          catalogue seed (committed)
├─ data/store.json             runtime store (git-ignored, created on first write)
├─ docs/PRD.md, docs/TRD.md
├─ public/products/*.webp      product images (generated)
├─ public/images/*.webp        editorial images (generated)
├─ public/icons/*              PWA icons (generated)
├─ scripts/prepare-images.mjs  sharp pipeline: src/assets → public
├─ src/assets/                 original images from the Vite app (kept)
├─ src/app/                    routes (see §3), globals.css, sw.ts, manifest, sitemap, robots, OG image
├─ src/components/
│  ├─ ui/          button, field (Input/Textarea/Select/Field), sheet (Sheet/Dialog), accordion
│  ├─ layout/      site-header (+ MobileTabBar), site-footer, search-dialog, theme-toggle, newsletter-form
│  ├─ catalogue/   catalogue (server), filters (CatalogueShell, client), grid-skeleton
│  ├─ product/     product-card, product-image, bits (Price/Rating/SaleTag), gallery, purchase-panel, quick-add, wish-button
│  ├─ cart/        receipt, line-thumb
│  ├─ auth/        auth-form, auth-page
│  └─ motion (CSS reveals), motion-root (LazyMotion), count-up, countdown, section-heading, breadcrumbs, json-ld, logo, providers
└─ src/lib/        catalog (data) + catalog-core (types/pure helpers, client-safe), db, auth, schemas, pricing, store, session, site, format, utils
```

## 3. Route map

| Route | Type | Rendering |
|---|---|---|
| `/` | page | static |
| `/shop` | page | dynamic (searchParams) |
| `/c/[slug]` | page | dynamic (reads filter searchParams); 9 slugs from `generateStaticParams`, unknown → 404 |
| `/product/[slug]` | page | SSG for 16 slugs, `dynamicParams = false` |
| `/cart`, `/wishlist`, `/checkout` | page + client view | static shell, client data |
| `/order/[id]` | page | dynamic (cookie); signed-out → redirect to `/login?next=` |
| `/account` | page | dynamic (cookie); signed-out → redirect to `/login?next=/account` |
| `/login`, `/signup`, `/about`, `/contact`, `/offline` | page | static |
| `/addtofavourite` | redirect (308) → `/wishlist` | config |
| `/manifest.webmanifest`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | metadata routes | static |
| `/api/products`, `/api/products/[slug]`, `/api/categories` | route handlers | dynamic / SSG |
| `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` | route handlers | dynamic |
| `/api/orders`, `/api/orders/[id]` | route handlers | dynamic |
| `/api/contact`, `/api/newsletter` | route handlers | dynamic |

Special files: `layout.tsx`, `template.tsx` (CSS route transition), `loading.tsx` (root, `/shop`, `/product/[slug]`), `error.tsx`, `not-found.tsx`.

## 4. Data model

Catalogue (`data/products.json`, typed in `src/lib/catalog.ts`):
```ts
Category { slug: string; name: string; blurb: string }
Product {
  id: string            // "p-2001"
  slug: string          // unique, URL key
  sku: string           // "SR-2001"
  name, blurb, description: string
  category: Category["slug"]
  price, compareAt: number      // USD
  rating: number (0–5); reviews: number; stock: number
  createdAt: "YYYY-MM-DD"
  collections: ("deals"|"bestsellers"|"new"|"featured")[]
  image: string; imageMode: "cutout"|"photo"; focus: [x%, y%]   // gallery zoom focus
  highlights: string[]; specs: Record<string,string>
  options: { name: string; values: { label: string; delta?: number; swatch?: string }[] }[]
}
```

Runtime store (`data/store.json`, typed in `src/lib/db.ts`):
```ts
User    { id; name; email (unique, lower-case); passwordHash "scrypt$salt$hash"; createdAt }
Order   { id "SR-…"; userId → User.id; email; createdAt;
          lines: { productId → Product.id; slug; name; image; options; unitPrice; qty }[];
          address: { fullName; phone; line1; line2?; city; postcode; country };
          delivery: "standard"|"express"; payment: "cod"|"demo";
          paymentStatus: "paid"|"due-on-delivery";
          subtotal; shipping; discount; total; note? }
Message { id; name; email; phone?; message; createdAt }
Subscriber { email (unique); createdAt }
```
Client (localStorage `sarani-shop`, version 1): `{ cart: CartLine[]; wishlist: Product.id[]; promo?: string }` where `CartLine = { key = productId|opt=val&…; productId; slug; name; image; imageMode; unitPrice; options; qty (1–10) }`. Address prefill: localStorage `sarani-address`.

## 5. API contracts

All bodies are JSON. Errors are `{ "error": string }` with the status shown.

| Method & path | Auth | Request | Success | Errors |
|---|---|---|---|---|
| `GET /api/products` | – | query: `q`, `category` (comma list), `price` (`0-50`,`50-150`,`150-500`,`500-`), `rating` (1–5), `sale=1`, `stock=1`, `sort` (`featured`,`newest`,`price-asc`,`price-desc`,`rating`,`discount`), `limit` (1–100) | 200 `{ total, query, products: ProductSummary[] }` | invalid params are ignored |
| `GET /api/products/:slug` | – | – | 200 `{ product: Product }` | 404 |
| `GET /api/categories` | – | – | 200 `{ categories: (Category & { count })[] }` | – |
| `POST /api/auth/signup` | – | `{ name, email, password }` (signUpSchema) | 201 `{ user }` + `Set-Cookie sarani_session` | 400 validation, 409 email exists |
| `POST /api/auth/login` | – | `{ email, password }` | 200 `{ user }` + cookie | 400, 401 wrong credentials |
| `POST /api/auth/logout` | – | – | 200 `{ ok }`, cookie cleared | – |
| `GET /api/auth/me` | cookie | – | 200 `{ user \| null }` (no-store) | – |
| `GET /api/orders` | required | – | 200 `{ orders: Order[] }` newest first | 401 |
| `POST /api/orders` | required | `{ lines: {productId, options, qty}[], address, delivery, payment, promo?, note? }` (orderSchema) | 201 `{ order }` | 400 validation, 401, 409 unknown product / insufficient stock |
| `GET /api/orders/:id` | required (owner) | – | 200 `{ order }` | 401, 404 |
| `POST /api/contact` | – | `{ name, email, phone?, message }` | 201 `{ ok, id }` | 400 |
| `POST /api/newsletter` | – | `{ email }` | 200 `{ ok, already }` | 400 |

`POST /api/orders` rules: every unit price is recomputed from the catalogue with option deltas; unknown option values fall back to the first value; promo applied server-side (`SARANI10` = 10%); express adds $12; `demo` payment waits ~700 ms (simulated authorisation) and is marked `paid`; `cod` is `due-on-delivery`.

## 6. State, auth, validation
- **Server state:** catalogue imported at build time; runtime data via `read()`/`write()` in `db.ts`. Writes are serialised through a promise queue and saved with write-to-temp + rename.
- **Client state:** `useShop` (Zustand + persist) for bag/wishlist/promo; `useSession` (Zustand) loads `/api/auth/me` once and is updated by the auth form and sign-out. `useHydrated()` (`useSyncExternalStore`) gates any UI that depends on persisted state to avoid hydration mismatches.
- **URL state:** catalogue filters/sort/search live in `searchParams`, updated with `router.replace` inside a transition (`useOptimistic` for instant controls).
- **Auth:** scrypt (16-byte salt, 64-byte key); session token `userId.expiry.HMAC-SHA256` in an httpOnly, SameSite=Lax cookie (`Secure` in production), 30 days. Pages needing the user (`/account`, `/order/[id]`) call `currentUser()` and redirect to `/login?next=…`; `next` must be a same-site path.
- **Roles:** one role (customer). No admin UI in 1.0.
- **Validation:** `src/lib/schemas.ts` (zod 4) shared by forms (react-hook-form resolver) and route handlers: `signUpSchema`, `signInSchema`, `addressSchema`, `orderSchema`, `contactSchema`, `newsletterSchema`.

## 7. Integrations and environment
| Variable | Purpose | When missing |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | absolute URLs for canonical, sitemap, OG, JSON-LD | defaults to `http://localhost:3000` |
| `AUTH_SECRET` | HMAC key for session cookies | built-in development secret; warning logged in production |

No external services. Future payment provider and email service would be added behind `POST /api/orders` and new env vars.

## 8. Design system implementation
- Tokens in `src/app/globals.css`: OKLCH CSS variables for `paper, surface, sunken, ink, ink-soft, line, line-strong, primary, primary-ink, primary-soft, accent, accent-ink, success, danger, plinth, focus`, with a separately tuned `.dark` set, exposed to Tailwind through `@theme inline` (`bg-paper`, `text-ink`, …). Radius scale 4/8/14/20; shadow token `shadow-card`.
- Fonts: Bricolage Grotesque (weight-axis file only, 41 KB, `--font-bricolage`), Geist Sans variable (`--font-geist-sans`), Geist Mono variable (`--font-geist-mono`, not preloaded), all via `next/font/local` from npm packages, so builds never call Google Fonts.
- Components: shadcn-style wrappers over Radix (`Button` with cva variants primary/ink/outline/ghost/accent/link; `Sheet`, `Dialog`, `Accordion`, `Field`), plus store components (ProductCard, SaleTag, Price, Rating, Receipt, SectionHeading).
- Motion: CSS keyframes for route/page-in, sheets, accordions, shimmer, marquee and the badge/heart "pop"; scroll reveals are CSS scroll-driven animations (`animation-timeline: view()`, no JS; unsupported browsers simply show content); `motion` (lazy `m` + `LazyMotion` in `MotionRoot`) only for the gallery crossfade, price tick, sticky buy bar, bag/wishlist removal, checkout steps and contact confirmation. Durations 150–300 ms, `cubic-bezier(0.22,1,0.36,1)`; global `prefers-reduced-motion` override and `MotionConfig reducedMotion="user"`.
- Full rules: `DESIGN.md`.

## 9. PWA
- `src/app/manifest.ts`: id `/`, start URL `/?source=pwa`, standalone, portrait, background `#f9f5ef`, theme `#c8432b`, icons 192/512 (any) + 512 maskable, shortcuts (shop, bag, orders). Apple touch icon 180 px and `appleWebApp` metadata; `theme-color` per colour scheme.
- `src/app/sw.ts` (Serwist): precache build assets + `/offline`; `defaultCache` runtime strategies (cache-first for fonts/images/static, network-first for pages and `/api`); navigation preload; `skipWaiting` + `clientsClaim`; document fallback to `/offline`. Built only by `next build --webpack`; disabled in `next dev`.

## 10. Quality, security, testing, deployment

**Performance budget:** Lighthouse mobile ≥ 90; LCP < 2.5 s, CLS < 0.05 on a production build. Static generation for product pages; WebP images (AVIF disabled: on-the-fly AVIF encoding was slow) with explicit `sizes`; LCP image `priority`; ~110 KB of preloaded fonts; route transition in CSS; no `motion` or `zod` in the home/shop bundles (bag/wishlist/account links use `prefetch={false}`; client components import `catalog-core`, not product data); `optimizePackageImports` for lucide/motion/radix.

Measured (Lighthouse 12 mobile, `next start`, on this shared 7 GB machine while other projects were building): Accessibility 100, Best Practices 100, SEO 100 on home, shop and product pages; **Performance 51–76** with large run-to-run variance (TBT 460–2,130 ms on identical builds). Re-measure on an idle machine or the deployed site before signing off the ≥ 90 target.

**Security:** zod validation on every route handler; server-side pricing; scrypt + timing-safe compares; signed httpOnly cookies; `poweredByHeader: false`; JSON-LD output escapes `<`; no card data; private routes `noindex` and disallowed in robots. Rate limiting is not implemented (local store); add it at the proxy or with a KV store before going public.

**Testing strategy:** `npm run typecheck`, `npm run lint`, `npm run build` must pass; manual browser checks of every route at 390 px and 1280 px in light and dark; API smoke tests with `curl` (signup → login → order → history); Lighthouse on `next start`.

**Deployment:** any Node host (`npm run build && npm start`) with a writable `data/` directory and `AUTH_SECRET` set. For Vercel/serverless, replace `src/lib/db.ts` with a database (e.g. Postgres/SQLite via Turso) first; the API contracts stay the same.

### Traceability

| PRD ID | Routes / pages | Components | API / lib |
|---|---|---|---|
| F-01 Home | `/` | SectionHeading, ProductCard, Countdown, ProductImage, Stagger/Reveal, NewsletterForm | catalog.inCollection, queryProducts |
| F-02 Catalogue | `/shop` | Catalogue, CatalogueShell, ProductCard, QuickAdd, WishButton, GridSkeleton | catalog.queryProducts |
| F-03 Filters | `/shop`, `/c/[slug]` | CatalogueShell (sidebar + Sheet, chips) | catalog.parseQuery, PRICE_BANDS |
| F-04 Sort | `/shop`, `/c/[slug]` | CatalogueShell (Select) | catalog.SORTS |
| F-05 Search | header, `/shop?q=` | SearchDialog, shop search form | `GET /api/products?q=` |
| F-06 Departments | `/c/[slug]` | Catalogue (fixedCategory), department pills | catalog.getCategory |
| F-07 Product page | `/product/[slug]` | Gallery, Accordion, RatingBars, ProductCard (related) | catalog.getProduct, related |
| F-08 Variants | `/product/[slug]` | PurchasePanel (options, qty, sticky bar) | catalog.priceFor, defaultOptions; store.addToCart |
| F-09 Bag | `/cart`, header counts | CartView, Receipt, LineThumb | lib/store |
| F-10 Promo | `/cart`, `/checkout` | Receipt promo form | lib/pricing PROMOS, totals; `POST /api/orders` |
| F-11 Wishlist | `/wishlist`, `/addtofavourite` redirect | WishButton, WishlistView | lib/store.toggleWish; next.config redirects |
| F-12 Accounts | `/login`, `/signup`, checkout inline | AuthForm, AuthPage, SignOutButton | `/api/auth/*`, lib/auth, lib/session |
| F-13 Checkout | `/checkout` | CheckoutFlow, StepShell, Receipt | `POST /api/orders`, orderSchema |
| F-14 Order & tracking | `/order/[id]` | order page | `GET /api/orders/:id`, pricing.orderProgress |
| F-15 Order history | `/account` | account page | `GET /api/orders` |
| F-16 About | `/about` | CountUp, Stagger | – |
| F-17 Contact | `/contact` | ContactForm, Accordion | `POST /api/contact` |
| F-18 Newsletter | `/`, footer | NewsletterForm | `POST /api/newsletter` |
| F-19 Product API | `/api/products*`, `/api/categories` | – | route handlers |
| F-20 Theme | all | ThemeToggle, ThemeSegment, Providers | next-themes, globals.css `.dark` |
| F-21 PWA | `/manifest.webmanifest`, `/offline`, `sw.js` | – | manifest.ts, sw.ts, next.config (Serwist) |
| F-22 SEO | all public pages, `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | JsonLd, Breadcrumbs | metadata API |
| F-23 Responsive & mobile nav | all | SiteHeader (Sheet), MobileTabBar, PurchasePanel sticky bar | – |
| F-24 Feedback & motion | all | Toaster, loading.tsx, error.tsx, not-found.tsx, template.tsx, motion.tsx | – |
| F-25 Accessibility | all | skip link, Field, Radix primitives | – |
