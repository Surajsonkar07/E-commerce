import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { Stagger, StaggerItem } from "@/components/motion";
import { Rating } from "@/components/product/bits";
import { Gallery } from "@/components/product/gallery";
import { ProductCard } from "@/components/product/product-card";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { SectionHeading } from "@/components/section-heading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getCategory, getProduct, products, related } from "@/lib/catalog";
import { absoluteUrl, site } from "@/lib/site";
import { isoDateFromNow } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const title = `${p.name} — ${p.blurb}`;
  return {
    title: p.name,
    description: `${p.blurb} ${p.description}`.slice(0, 158),
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { title, type: "website", url: `/product/${p.slug}`, images: [{ url: p.image, width: 640, height: 640, alt: p.name }] },
    twitter: { card: "summary_large_image", title, images: [p.image] },
  };
}

export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const cat = getCategory(p.category)!;
  const more = related(p);
  const url = absoluteUrl(`/product/${p.slug}`);
  const validUntil = isoDateFromNow(30);

  return (
    <div className="container-x pt-6 lg:pt-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Product",
              "@id": `${url}#product`,
              name: p.name,
              sku: p.sku,
              mpn: p.sku,
              description: p.description,
              image: [absoluteUrl(p.image)],
              category: cat.name,
              brand: { "@type": "Brand", name: site.name },
              aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviews, bestRating: 5 },
              offers: {
                "@type": "Offer",
                url,
                priceCurrency: "USD",
                price: p.price.toFixed(2),
                priceValidUntil: validUntil,
                availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                itemCondition: "https://schema.org/NewCondition",
                seller: { "@type": "Organization", name: site.name },
                shippingDetails: {
                  "@type": "OfferShippingDetails",
                  shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "USD" },
                  deliveryTime: {
                    "@type": "ShippingDeliveryTime",
                    handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
                    transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 4, unitCode: "DAY" },
                  },
                },
                hasMerchantReturnPolicy: {
                  "@type": "MerchantReturnPolicy",
                  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
                  merchantReturnDays: 30,
                  returnFees: "https://schema.org/FreeReturn",
                },
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
                { "@type": "ListItem", position: 2, name: cat.name, item: absoluteUrl(`/c/${cat.slug}`) },
                { "@type": "ListItem", position: 3, name: p.name, item: url },
              ],
            },
          ],
        }}
      />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: `/c/${cat.slug}`, label: cat.name }, { label: p.name }]} />

      <div className="mt-5 grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-24">
            <Gallery src={p.image} alt={p.name} mode={p.imageMode} focus={p.focus} />
          </div>
        </div>

        <div className="lg:col-span-5">
          <p className="eyebrow flex justify-between">
            <Link href={`/c/${cat.slug}`} className="hover:text-ink hover:underline">
              {cat.name}
            </Link>
            <span>SKU {p.sku}</span>
          </p>
          <h1 className="mt-3 text-[clamp(2rem,4vw,3rem)] leading-[1] font-bold">{p.name}</h1>
          <p className="mt-3 text-[17px] text-ink-soft">{p.blurb}</p>
          <a href="#details" className="mt-3 inline-block">
            <Rating value={p.rating} count={p.reviews} />
          </a>
          <div className="rule-dashed my-7" />
          <PurchasePanel product={p} />

          <Accordion type="multiple" defaultValue={["about"]} className="mt-10 border-t border-line" id="details">
            <AccordionItem value="about">
              <AccordionTrigger>About this {cat.name === "Fashion" ? "piece" : "product"}</AccordionTrigger>
              <AccordionContent>
                <p>{p.description}</p>
                <ul className="mt-4 flex flex-col gap-2">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-ink">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                      {h}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="specs">
              <AccordionTrigger>Specifications</AccordionTrigger>
              <AccordionContent>
                <dl className="divide-y divide-line">
                  {Object.entries({ ...p.specs, SKU: p.sku }).map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[40%_1fr] gap-4 py-2.5">
                      <dt className="font-mono text-xs tracking-wide text-ink-soft uppercase">{k}</dt>
                      <dd className="text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="delivery">
              <AccordionTrigger>Delivery & returns</AccordionTrigger>
              <AccordionContent>
                Standard delivery is free and takes 2–4 working days. Express is $12 and arrives the next working day if you order before 4pm. Not right? Return it within 30 days for a full refund; we send a prepaid label.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="reviews">
              <AccordionTrigger>
                Ratings <span className="ml-auto pr-3 font-mono text-sm text-ink-soft">{p.rating.toFixed(1)} / 5</span>
              </AccordionTrigger>
              <AccordionContent>
                <RatingBars rating={p.rating} count={p.reviews} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <section className="mt-24" aria-labelledby="related-title">
        <SectionHeading eyebrow="Pairs well with" id="related-title" title="You might also like" action={{ href: `/c/${cat.slug}`, label: `More in ${cat.name}` }} />
        <Stagger className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {more.map((r) => (
            <StaggerItem key={r.id}>
              <ProductCard product={r} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </div>
  );
}

/** Star distribution, derived deterministically from the average so it stays consistent. */
function RatingBars({ rating, count }: { rating: number; count: number }) {
  const weights = [5, 4, 3, 2, 1].map((s) => Math.exp(-Math.pow(s - rating, 2) * 1.6));
  const sum = weights.reduce((a, b) => a + b, 0);
  const counts = weights.map((w) => Math.round((w / sum) * count));
  return (
    <div className="flex flex-col gap-2">
      <p className="mb-2 text-ink">
        Rated <span className="font-mono">{rating.toFixed(1)}</span> out of 5 from <span className="font-mono">{count}</span> verified purchases.
      </p>
      {[5, 4, 3, 2, 1].map((s, i) => (
        <div key={s} className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-3 font-mono text-xs">
          <span>{s} ★</span>
          <span className="h-2 overflow-hidden rounded-full bg-sunken">
            <span className="block h-full rounded-full bg-accent" style={{ width: `${(counts[i] / count) * 100}%` }} />
          </span>
          <span className="text-right text-ink-soft">{counts[i]}</span>
        </div>
      ))}
    </div>
  );
}
