# Sarani: Product Requirements Document

| | |
|---|---|
| Product | Sarani, an online general store (rebuild of the "Exclusive" Vite storefront in `D:\E-commerce\FrontEnd`) |
| Version | 1.0 (Next.js rebuild) |
| Status | Implemented; see the traceability table in `TRD.md` §10 |
| Last updated | 2026-11-12 |

## 1. Overview

### 1.1 What it is
Sarani is a small online general store based on Bijoy Sarani, Dhaka. It sells a deliberately short catalogue (16 products across 9 departments: gaming, computing, phones, cameras, home, fashion, sport, kids, pets). Customers can browse, filter and search, configure product variants, keep a bag and a wishlist, create an account, check out with cash on delivery or a simulated online payment, and track their orders.

### 1.2 The problem
The original site was a Vite + React prototype built from a Figma template. It had a home page, about, contact, login/sign-up forms, a cart, favourites and a checkout, but:
- the login, sign-up and contact forms did nothing;
- checkout cleared `localStorage` and showed a toast; no order was ever recorded;
- there was no catalogue page, no product page, no search, no filters;
- product data didn't match the photos (e.g. a pair of football boots called "Winter bau" at $22,999.99);
- lorem-ipsum copy, celebrity names on stock team photos, no SEO, no mobile navigation, no dark mode, not installable.

### 1.3 Who it is for
- **Rafi, 24, university student in Dhaka.** Shops on a mid-range Android phone over patchy 4G. Wants a gamepad or keyboard at a fair price, compares two or three options, pays cash on delivery because he doesn't have a card. Needs: fast mobile pages, clear prices, COD.
- **Nusrat, 34, works in an office in Gulshan.** Buys furniture and gifts on her laptop at lunch, often saves things and comes back later. Needs: a wishlist that persists, order history, express delivery, predictable returns.
- **The store owner (Sarani team).** Runs a small catalogue and a 24/7 phone line. Needs: orders and contact messages captured somewhere, a site that looks credible and distinctive, good search visibility for each product, and something that can later be connected to a real payment provider and database.

## 2. Goals, success metrics, non-goals

### 2.1 Goals and metrics
| Goal | Metric (measured on a production build) |
|---|---|
| Every old feature works, and the fake ones become real | 100% of the legacy feature list (F-01, F-09, F-11, F-12, F-13, F-16, F-17) passes its acceptance criteria |
| Shoppers can find a product quickly | Any product reachable in ≤ 2 clicks from home; search returns results as you type (< 300 ms on localhost) |
| Shoppers can buy | A new visitor can go from home → product → bag → account → order confirmation in under 2 minutes |
| Fast on phones | Lighthouse mobile Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 |
| Discoverable | Every product page has unique title/description, canonical URL and valid Product JSON-LD |
| Installable and resilient | Installable as a PWA; bag and wishlist available offline; an offline page instead of the browser error |

### 2.2 Non-goals
- Real payment processing, card capture or PCI scope (payments are simulated by design).
- Seller/admin dashboard, inventory management UI, refunds workflow.
- Multi-currency, multi-language, tax calculation.
- Email delivery (order confirmations, password reset, newsletter sends).
- Product reviews written by customers (ratings are summary data in the catalogue).

## 3. Scope

**In scope for 1.0:** everything in §4: storefront, catalogue, product pages, bag, wishlist, local accounts, checkout with mock payment, orders and tracking, about/contact, newsletter capture, product API, theming, PWA, SEO, accessibility.

**Out of scope:** the non-goals above; a hosted database; social sign-in; password reset; stock decrement after purchase (stock is read from the catalogue file).

## 4. Features

Legend: **(L)** = existed in the old Vite app (must keep working), **(N)** = new.

### F-01 Home page (L, extended)
As a shopper I want a front page that shows what's on offer today so that I can start browsing without searching.
- [ ] Hero with the store promise, two calls to action (shop all, this week's markdowns) and featured product tiles that link to their product pages.
- [ ] A ticker of store promises (free delivery, 30-day returns, COD, promo code, 24/7 help) that pauses under reduced motion.
- [ ] Department rail listing all 9 departments with product counts, linking to `/c/[slug]`.
- [ ] "This week's markdowns" (the old flash-sale row) showing the `deals` collection with a live countdown to Sunday 23:59.
- [ ] Feature band for the pick of the month (Aurora 6 Pro) with specs and price.
- [ ] Best sellers (the old "This month") as a ranked list.
- [ ] "Newest on the shelves" grid (the old "Explore our products") with a link to all products.
- [ ] Service promises (the old "Free and fast delivery / Customer service / Money back guarantee" row).
- [ ] Newsletter sign-up (see F-18).

### F-02 Catalogue listing (N)
As a shopper I want to see every product in one place so that I can compare them.
- [ ] `/shop` lists all products in a responsive grid (2 columns on phones, 3 on tablets/laptops, 4 on wide screens).
- [ ] Each card shows image, department, name, rating with count, price, compare-at price, discount tag, "New" and low-stock labels.
- [ ] Each card has a wishlist toggle and a quick add (or "choose size" link when a size must be picked).
- [ ] The product count is shown and announced to screen readers when it changes.

### F-03 Filters (N)
As a shopper I want to narrow the list so that I only see what fits my budget and needs.
- [ ] Filter by department (multi-select), price band (under $50, $50–150, $150–500, $500+), minimum rating (4+, 4.5+), on sale only, in stock only.
- [ ] Filters are stored in the URL (shareable, back button works) and shown as removable chips with "Clear all".
- [ ] Desktop: sticky sidebar. Phones: bottom sheet with "Show N results".
- [ ] An empty result shows a designed empty state with a way to clear filters.

### F-04 Sort (N)
- [ ] Sort by featured (default), newest, price low→high, price high→low, top rated, biggest saving; the choice is kept in the URL.

### F-05 Search (N)
As a shopper I want to type what I'm looking for so that I don't have to browse.
- [ ] Header search opens a dialog (also on Ctrl/⌘ K) with live results (image, name, blurb, price) as you type, arrow-key navigation, Enter to open.
- [ ] "See all results" and the search field on `/shop` go to `/shop?q=…`; search matches name, blurb, description, department, SKU and highlights; all words must match.
- [ ] Suggested searches are shown before typing; a helpful message when nothing matches.

### F-06 Department pages (N)
- [ ] `/c/[slug]` for each of the 9 departments with name, blurb, count, links to sibling departments, and the same filters/sort (minus department).
- [ ] Unknown slugs show the 404 page.

### F-07 Product page and gallery (N)
As a shopper I want a detailed page for each product so that I can decide whether to buy it.
- [ ] `/product/[slug]` shows breadcrumb, department, SKU, name, blurb, rating, price, compare-at price and saving.
- [ ] Gallery with three views (front, detail, close-up): swipeable with dots on phones; thumbnails plus hover magnifier on desktop.
- [ ] Accordions: description + highlights, specifications, delivery & returns, rating breakdown.
- [ ] Stock status and an estimated delivery window (standard and express).
- [ ] "You might also like": four related products (same department first).

### F-08 Variants and quantity (N)
- [ ] Each option group (size, colour, storage, switch, etc.) is a labelled radio group; colours show swatches; price deltas are shown on the option.
- [ ] The price updates when options change; quantity stepper limited to 1–10 and to stock.
- [ ] "Add to bag" confirms with a toast and button state; "Buy now" adds and goes to checkout.
- [ ] On phones a sticky buy bar appears once the main button scrolls out of view.

### F-09 Bag / cart (L, extended)
As a shopper I want a bag that remembers what I picked so that I can buy it later.
- [ ] Items keep their chosen options; the same product with different options is a separate line.
- [ ] Change quantity, remove with "Undo", or move to wishlist ("Save for later").
- [ ] The bag persists across reloads and browser restarts (localStorage) and works offline.
- [ ] Header and bottom tab bar show the item count.
- [ ] Receipt-style summary: subtotal, promo, delivery (free standard), total; checkout button.
- [ ] Designed empty state.

### F-10 Promo codes (N)
- [ ] `SARANI10` gives 10% off the subtotal; invalid codes show an error; the code can be removed; the server recomputes the discount on the order.

### F-11 Wishlist (L, extended)
- [ ] A heart on every card and product page toggles the item; state persists in localStorage.
- [ ] `/wishlist` lists saved products with full cards; empty state when none.
- [ ] The old `/addtofavourite` URL redirects to `/wishlist`.

### F-12 Accounts (L; previously non-functional)
As a returning shopper I want an account so that my orders are kept together.
- [ ] Sign up with name, email, password (8+ chars); sign in with email and password; sign out.
- [ ] Validation errors appear beside the field; server errors (duplicate email, wrong password) are shown in the form.
- [ ] Passwords are stored hashed (scrypt); sessions are httpOnly signed cookies valid for 30 days.
- [ ] `/login` and `/signup` honour `?next=` (same-site paths only).

### F-13 Checkout (L; previously non-functional)
As a shopper I want to pay and give my address so that my order gets delivered.
- [ ] Requires an account: guests can sign in or sign up inline without losing their bag.
- [ ] Step 1 delivery address (name, phone, street, optional apartment, city, postcode, country) with validation; remembered on this device.
- [ ] Step 2 delivery speed: standard (free, 2–4 days) or express ($12, next day), plus an optional courier note.
- [ ] Step 3 payment: "Pay now (demo)" (simulated approval, no card fields) or "Cash on delivery"; review of items; place order.
- [ ] The server recomputes every price from the catalogue, validates options and stock, and stores the order; the bag is cleared and the shopper lands on the confirmation.

### F-14 Order confirmation and tracking (N)
- [ ] `/order/[id]` shows a confirmation banner right after purchase, a tracking timeline (placed, packed, out for delivery, delivered), items, totals, payment status, delivery address and note.
- [ ] Only the owner of the order can view it; signed-out visitors are sent to sign in and back.

### F-15 Order history (N)
- [ ] `/account` shows profile, order count and total spent, theme preference, sign out, and every order (newest first) with status, date, item count and total, linking to the order.

### F-16 About page (L, rewritten)
- [ ] Story of the store with real copy (no lorem ipsum), the original stats (10.5k sellers, 45.5k customers, 25k annual sales, 33k monthly products) counting up, a timeline, team (placeholder names), and delivery & returns.

### F-17 Help and contact (L; form previously non-functional)
- [ ] Phone, email, address and hours (from the original site), clickable phone/email.
- [ ] Contact form (name, email, optional phone, question) with validation; stored server-side; shows a reference number.
- [ ] FAQ accordion (order tracking, cash payment, returns, international delivery).

### F-18 Newsletter (L, extended)
- [ ] Email sign-up on the home page and in the footer; validated; duplicates acknowledged without error; stored server-side.

### F-19 Product API (N)
- [ ] Public JSON endpoints for products (search/filter/sort/limit), a single product and departments; account, order, contact and newsletter endpoints as in the TRD.

### F-20 Light, dark and system theme (N)
- [ ] Theme switch (light → dark → system) in the header and a segmented control in the menu and account page; no flash of the wrong theme on load; dark palette designed separately.

### F-21 PWA and offline (N)
- [ ] Web app manifest with name, colours, 192/512 and maskable icons, Apple touch icon, shortcuts.
- [ ] Service worker in production: precaches the app shell, caches static assets, network-first for pages and API; an offline page for uncached pages.

### F-22 SEO (N)
- [ ] Unique titles and descriptions; canonical URLs; Open Graph image; `sitemap.xml` with all products/departments; `robots.txt` excluding private pages.
- [ ] JSON-LD: Organization and WebSite (with SearchAction) on home; Product (offer, rating, shipping, returns) and BreadcrumbList on product pages; BreadcrumbList on department pages.

### F-23 Responsive layout and mobile navigation (N)
- [ ] Works without horizontal scroll from 360 px to 1536 px+; touch targets ≥ 44 px.
- [ ] Phones: menu drawer with departments and theme; bottom tab bar (home, shop, saved, bag, account) hidden at checkout.

### F-24 Feedback states and motion (L toasts, extended)
- [ ] Toasts for cart, wishlist, auth, promo and form actions (replaces react-toastify).
- [ ] Skeletons for route loading and client-only views; designed empty states; `error.tsx` with retry; branded 404.
- [ ] Route fade, staggered reveals, hover/press states, animated counts; all respect reduced motion.

### F-25 Accessibility (N)
- [ ] Skip link, landmarks, one h1 per page, labelled controls, visible focus, keyboard-operable dialogs/sheets/accordions, alt text, prices readable by screen readers ("Sale price … was …").

## 5. User flows and screens

### 5.1 Main journeys
**Browse and buy (new customer, phone)**
1. Home → taps a department in the rail → department page.
2. Filters "On sale", sorts by price → taps a product.
3. Picks a size → Add to bag → toast "View bag".
4. Bag → applies `SARANI10` → Checkout.
5. Creates an account inline → address → standard delivery → Cash on delivery → Place order.
6. Confirmation page with tracking.

**Search and save (returning customer, laptop)**
1. Presses Ctrl K → types "oak" → arrow down → Enter → product page.
2. Saves to wishlist → later opens `/wishlist` → quick add → bag.

**Check an order**
1. Account (header) → sign in if needed → Order history → order → tracking timeline.

**Ask for help**
1. Help (header) → reads FAQ → sends a message → reference number shown.

### 5.2 Screen inventory
| Route | Purpose | Key elements |
|---|---|---|
| `/` | Front of store | hero, ticker, departments, markdowns + countdown, feature band, best sellers, newest grid, promises, newsletter |
| `/shop` | Whole catalogue | heading/search, filters (sidebar/sheet), sort, chips, grid, empty state |
| `/c/[slug]` | One department | blurb, sibling department pills, filters, grid |
| `/product/[slug]` | Product detail | gallery, price, options, quantity, add/buy/save, stock & delivery, accordions, related, sticky buy bar |
| `/cart` | Bag | lines with options/qty/save/remove, receipt summary, promo, checkout |
| `/wishlist` | Saved items | product cards, empty state |
| `/checkout` | Buy | inline auth, address, delivery, payment, review, receipt |
| `/order/[id]` | Confirmation & tracking | banner, timeline, items, totals, address |
| `/account` | Profile & history | profile, stats, theme, sign out, orders |
| `/login`, `/signup` | Accounts | form, illustration |
| `/about` | Story | story, stats, timeline, team, returns |
| `/contact` | Help | contact details, FAQ, form |
| `/offline` | Offline fallback | message, link home |
| 404 / error | Recovery | department links / retry |

## 6. Content and data
- **Products (16)** with id, slug, SKU, name, department, price, compare-at price, rating, review count, stock, date added, collections (`deals`, `bestsellers`, `new`, `featured`), image, one-line blurb, description, highlights, specs and option groups. Names and copy were rewritten to match the original photos (e.g. f1.png → Ember Wired Gamepad, p6.png → Volt Firm-Ground Boots).
- **Departments (9)** with slug, name and blurb.
- **Images:** the original PNGs in `src/assets`, converted to WebP; about, sign-in and team photos reused.
- **Store details:** address, email and phone from the original site (owner to confirm).
- **Runtime data:** users, orders, contact messages, newsletter subscribers in a local JSON store.
- **Promo:** `SARANI10`, 10% off.

## 7. Non-functional requirements
- **Responsive:** checked at 360, 390, 768, 1024, 1280, 1536 px; no horizontal scroll.
- **Theme:** light, dark, system; WCAG AA text contrast in both.
- **PWA/offline:** installable on Android and iOS; offline fallback; bag and wishlist available offline.
- **Performance:** Lighthouse mobile ≥ 90 Performance; static generation for home, department and product pages; WebP/AVIF images via `next/image`; self-hosted fonts; no client JS for content that doesn't need it.
- **Accessibility:** Lighthouse ≥ 95; keyboard and screen-reader usable (F-25).
- **SEO:** Lighthouse ≥ 95 (F-22).
- **Security/privacy:** no card data collected; passwords hashed; signed httpOnly session cookie; all input validated with zod on the server; server-side pricing; private pages excluded from indexing; no secrets in the repo.

## 8. Risks, assumptions, open questions
- **Assumption:** prices in USD as on the original site.
- **Assumption:** checkout requires an account (needed for order history); guests sign up inline.
- **Risk:** the JSON file store suits a single local/VM deployment, not a read-only serverless host. Owner decision needed on a database before going live.
- **Risk:** without `AUTH_SECRET` in production a built-in development secret is used.
- **Open:** real store address, phone and email (original values look like template placeholders: "exclusive@gmail.com").
- **Open:** real team names and photos (original used celebrity names on stock photos).
- **Open:** real payment provider (e.g. SSLCommerz, bKash, Stripe) and its keys.
- **Open:** final prices and stock levels; whether stock should decrement on purchase.
- **Open:** delivery countries and express fee.
