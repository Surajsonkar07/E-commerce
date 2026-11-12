import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Banknote, Headphones, RotateCcw, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/countdown";
import { JsonLd } from "@/components/json-ld";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Price, Rating, SaleTag } from "@/components/product/bits";
import { ProductCard } from "@/components/product/product-card";
import { ProductImage } from "@/components/product/product-image";
import { SectionHeading } from "@/components/section-heading";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { categories, categoryCount, discountPct, getProduct, inCollection, products, queryProducts } from "@/lib/catalog";
import { formatMoney, pad } from "@/lib/format";
import { absoluteUrl, site } from "@/lib/site";

export default function HomePage() {
  const aurora = getProduct("aurora-6-pro")!;
  const chair = getProduct("linden-lounge-chair")!;
  const pad1 = getProduct("ember-wired-gamepad")!;
  const deals = inCollection("deals");
  const best = inCollection("bestsellers");
  const explore = queryProducts({ sort: "newest" }).filter((p) => !p.collections.includes("deals")).slice(0, 8);
  const catCover = (slug: string) => products.find((p) => p.category === slug && p.imageMode === "cutout") ?? products.find((p) => p.category === slug)!;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": absoluteUrl("/#org"),
              name: site.name,
              url: site.url,
              logo: absoluteUrl("/icons/icon-512.png"),
              email: site.email,
              telephone: site.phone,
              address: { "@type": "PostalAddress", streetAddress: "111 Bijoy Sarani", addressLocality: "Dhaka", postalCode: "1515" },
            },
            {
              "@type": "WebSite",
              url: site.url,
              name: site.name,
              publisher: { "@id": absoluteUrl("/#org") },
              potentialAction: { "@type": "SearchAction", target: `${absoluteUrl("/shop")}?q={search_term_string}`, "query-input": "required name=search_term_string" },
            },
          ],
        }}
      />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="container-x grid gap-10 pt-8 pb-14 md:pt-12 lg:grid-cols-12 lg:gap-10 lg:pt-16 lg:pb-20" aria-labelledby="hero-title">
        <div className="flex flex-col justify-center lg:col-span-5">
          <p className="eyebrow flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-primary" aria-hidden /> The November ledger · {products.length} things in stock
          </p>
          <h1 id="hero-title" className="mt-5 text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.92] font-bold tracking-[-0.045em]">
            Good things,
            <br />
            <span className="relative inline-block">
              fairly priced
              <svg className="absolute -bottom-2 left-0 w-full text-accent" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden>
                <path d="M2 9C60 3 140 2 298 7" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
            .
          </h1>
          <p className="mt-7 max-w-md text-[17px] leading-relaxed text-ink-soft">
            Sarani is a small general store. We stock one good version of each thing (a chair, a gamepad, a phone) and tell you plainly what it costs and when it arrives.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/shop">
                Browse the shop <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/shop?sale=1&sort=discount">This week&apos;s markdowns</Link>
            </Button>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-5">
            {[
              ["Delivery", "Free, always"],
              ["Returns", "30 days"],
              ["Pay", "Card or cash"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="eyebrow">{k}</dt>
                <dd className="mt-1 text-[15px] font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="grid grid-cols-6 grid-rows-[auto_auto] gap-3 sm:gap-4 lg:col-span-7">
          <Link href={`/product/${aurora.slug}`} className="group relative col-span-6 overflow-hidden rounded-xl sm:col-span-4 sm:row-span-2">
            <ProductImage
              src="/images/aurora-wide.webp"
              alt={`${aurora.name}, ${aurora.blurb}`}
              mode="photo"
              priority
              sizes="(min-width: 1024px) 38vw, (min-width: 640px) 62vw, 100vw"
              className="aspect-[4/3] h-full sm:aspect-auto sm:min-h-[420px]"
              imgClassName="transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/80 to-transparent p-5 text-white">
              <div>
                <p className="font-mono text-[11px] tracking-[0.08em] text-white/70 uppercase">Pick of the month</p>
                <p className="mt-1 font-display text-2xl font-semibold">{aurora.name}</p>
              </div>
              <p className="shrink-0 rounded-md bg-white px-3 py-2 font-mono text-sm font-semibold text-black">
                from {formatMoney(aurora.price)}
              </p>
            </div>
          </Link>
          {[chair, pad1].map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="group relative col-span-3 overflow-hidden rounded-xl sm:col-span-2">
              <ProductImage
                src={p.image}
                alt={p.name}
                mode="cutout"
                sizes="(min-width: 1024px) 19vw, (min-width: 640px) 31vw, 50vw"
                className="aspect-square h-full"
                imgClassName="transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-3 left-0">
                <SaleTag pct={discountPct(p)} />
              </span>
              <span className="absolute right-3 bottom-3 left-3 flex items-center justify-between rounded-md bg-paper/92 px-2.5 py-1.5 text-[13px] backdrop-blur">
                <span className="truncate font-medium">{p.name.split(" ").slice(0, 2).join(" ")}</span>
                <span className="font-mono">{formatMoney(p.price)}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Promise ticker ───────────────────────────────── */}
      <div className="overflow-hidden border-y border-line bg-surface py-3" aria-label="Store promises">
        <div className="flex w-max animate-marquee gap-10 font-mono text-[13px] whitespace-nowrap text-ink-soft motion-reduce:animate-none">
          {[0, 1].map((k) => (
            <ul key={k} className="flex gap-10" aria-hidden={k === 1}>
              {[
                "Free standard delivery on every order",
                "30-day returns, no forms",
                "Cash on delivery available",
                "New customers: SARANI10 takes 10% off",
                "Packed in Dhaka, checked twice",
                "Help desk open 24/7",
              ].map((t) => (
                <li key={t} className="flex items-center gap-10">
                  {t} <span className="text-primary">✦</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* ── Departments ──────────────────────────────────── */}
      <section className="container-x mt-20" aria-labelledby="dept-title">
        <SectionHeading index="01" eyebrow="Departments" id="dept-title" title="Browse by department" action={{ href: "/shop", label: "Shop everything" }} />
        <Stagger className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-9">
          {categories.map((c) => {
            const cover = catCover(c.slug);
            return (
              <StaggerItem key={c.slug} className="w-[38vw] shrink-0 snap-start sm:w-auto">
                <Link href={`/c/${c.slug}`} className="group block">
                  <ProductImage src={cover.image} alt="" mode={cover.imageMode} sizes="(min-width: 1024px) 10vw, (min-width: 640px) 30vw, 38vw" className="aspect-square rounded-lg" imgClassName="transition-transform duration-500 group-hover:scale-110" />
                  <p className="mt-2.5 flex items-baseline justify-between gap-2">
                    <span className="text-[15px] font-medium group-hover:text-primary">{c.name}</span>
                    <span className="font-mono text-xs text-ink-soft">{pad(categoryCount(c.slug), 2)}</span>
                  </p>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* ── Weekly markdowns ─────────────────────────────── */}
      <section className="container-x mt-24" aria-labelledby="deals-title">
        <SectionHeading
          index="02"
          eyebrow="Markdowns · rotate every Sunday"
          id="deals-title"
          title={
            <>
              This week&apos;s <em className="font-[inherit] text-primary not-italic">markdowns</em>
            </>
          }
          aside={<Countdown />}
          action={{ href: "/shop?sale=1&sort=discount", label: "All deals" }}
        />
        <Stagger className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {deals.map((p, i) => (
            <StaggerItem key={p.id}>
              <ProductCard product={p} index={i} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ── Feature band ─────────────────────────────────── */}
      <section className="mt-24 bg-[#0d0b10] text-white" aria-labelledby="feature-title">
        <div className="container-x grid items-center gap-8 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <Reveal className="order-2 lg:order-1">
            <p className="font-mono text-xs tracking-[0.08em] text-[oklch(0.8_0.125_84)] uppercase">§03 · Pick of the month</p>
            <h2 id="feature-title" className="mt-3 text-[clamp(2.25rem,5vw,4rem)] leading-[0.95] font-bold">
              {aurora.name}.<br />
              <span className="text-white/60">Night shots without a tripod.</span>
            </h2>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-white/75">{aurora.description}</p>
            <dl className="mt-8 grid max-w-lg grid-cols-2 border-t border-white/15">
              {Object.entries(aurora.specs).map(([k, v]) => (
                <div key={k} className="border-b border-white/15 py-3 pr-4">
                  <dt className="font-mono text-[11px] tracking-[0.08em] text-white/55 uppercase">{k}</dt>
                  <dd className="mt-1 text-[15px]">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link href={`/product/${aurora.slug}`} className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-6 font-medium text-black transition-transform hover:bg-[oklch(0.8_0.125_84)] active:scale-[0.98]">
                See the Aurora <ArrowRight className="size-4" />
              </Link>
              <p className="font-mono text-white/80">
                {formatMoney(aurora.price)} <s className="text-white/45">{formatMoney(aurora.compareAt)}</s>
              </p>
            </div>
          </Reveal>
          <Reveal className="relative order-1 lg:order-2" delay={0.05}>
            <Image src="/images/aurora-wide.webp" alt="" width={496} height={328} sizes="(min-width: 1024px) 45vw, 100vw" className="h-auto w-full rounded-xl" />
          </Reveal>
        </div>
      </section>

      {/* ── Best sellers as a ranked ledger ──────────────── */}
      <section className="container-x mt-24 grid gap-10 lg:grid-cols-12" aria-labelledby="best-title">
        <div className="lg:col-span-4">
          <SectionHeading index="04" eyebrow="Best sellers · this month" id="best-title" title="What people keep coming back for" className="mb-0" />
          <p className="mt-4 max-w-sm text-ink-soft">Ranked by units sold in the last 30 days. The duffle has been number one since it landed.</p>
        </div>
        <ol className="lg:col-span-8">
          {best.map((p, i) => (
            <li key={p.id} className="border-b border-line first:border-t">
              <Link href={`/product/${p.slug}`} className="group grid grid-cols-[auto_72px_1fr_auto] items-center gap-4 py-4 sm:grid-cols-[3rem_96px_1fr_auto] sm:gap-6">
                <span className="font-display text-3xl font-bold text-line-strong tabular-nums transition-colors group-hover:text-primary sm:text-4xl">{pad(i + 1, 2)}</span>
                <ProductImage src={p.image} alt="" mode={p.imageMode} sizes="96px" className="aspect-square rounded-md" />
                <span className="min-w-0">
                  <span className="block truncate text-[16px] font-medium group-hover:text-primary sm:text-lg">{p.name}</span>
                  <span className="mt-0.5 hidden truncate text-sm text-ink-soft sm:block">{p.blurb}</span>
                  <Rating value={p.rating} count={p.reviews} className="mt-1" />
                </span>
                <span className="flex flex-col items-end gap-1">
                  <Price price={p.price} compareAt={p.compareAt} className="flex-col items-end gap-0 sm:flex-row sm:items-baseline sm:gap-2" />
                  <ArrowUpRight className="hidden size-5 text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink sm:block" />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Explore ──────────────────────────────────────── */}
      <section className="container-x mt-24" aria-labelledby="explore-title">
        <SectionHeading index="05" eyebrow="Explore" id="explore-title" title="Newest on the shelves" action={{ href: "/shop", label: `View all ${products.length}` }} />
        <Stagger className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
          {explore.map((p, i) => (
            <StaggerItem key={p.id}>
              <ProductCard product={p} index={i} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ── Promise (delivery, help, returns) ────────────── */}
      <section className="container-x mt-24" aria-labelledby="promise-title" id="promise">
        <div className="grid gap-10 rounded-xl bg-surface p-6 shadow-card sm:p-10 lg:grid-cols-12 lg:p-14">
          <div className="lg:col-span-5">
            <p className="eyebrow">§06 · The small print, made large</p>
            <h2 id="promise-title" className="mt-3 text-[clamp(1.9rem,3.6vw,2.75rem)] leading-[1.02] font-semibold">
              What you can count on with every order
            </h2>
          </div>
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-7">
            {[
              { icon: Truck, t: "Free & fast delivery", d: "Standard delivery is free on everything, in 2–4 days. Express arrives next day for $12." },
              { icon: RotateCcw, t: "Money-back guarantee", d: "Changed your mind? Send it back within 30 days for a full refund. We pay the return postage." },
              { icon: Headphones, t: "Customer service, 24/7", d: `A real person answers at ${site.phone}, day or night.` },
              { icon: Banknote, t: "Pay how you like", d: "Pay online at checkout, or in cash when the courier arrives." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="flex gap-4">
                <Icon className="mt-0.5 size-6 shrink-0 text-primary" strokeWidth={1.75} />
                <div>
                  <dt className="font-medium">{t}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-ink-soft">{d}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────── */}
      <section className="container-x mt-24" aria-labelledby="nl-title">
        <Reveal className="flex flex-col items-start justify-between gap-6 border-y border-ink py-10 md:flex-row md:items-center">
          <div>
            <h2 id="nl-title" className="text-3xl font-semibold">Get the Friday list</h2>
            <p className="mt-1 text-ink-soft">New arrivals and one honest deal, once a week.</p>
          </div>
          <NewsletterForm />
        </Reveal>
      </section>
    </>
  );
}
