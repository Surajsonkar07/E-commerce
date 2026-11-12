import type { Metadata } from "next";
import { Search } from "lucide-react";
import { Catalogue } from "@/components/catalogue/catalogue";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { parseQuery, products } from "@/lib/catalog";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = parseQuery(await searchParams);
  return {
    title: q ? `Search: ${q}` : "Shop all products",
    description: `Browse all ${products.length} products at Sarani: gaming, computing, phones, home, fashion and more. Filter by department, price and rating.`,
    alternates: { canonical: "/shop" },
    robots: q ? { index: false, follow: true } : undefined,
  };
}

export default async function ShopPage({ searchParams }: Props) {
  const query = parseQuery(await searchParams);
  return (
    <div className="container-x pt-6 pb-8 lg:pt-10">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Shop" }]} />
      <header className="mt-4 mb-8 flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">The whole store</p>
          <h1 className="mt-2 text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.95] font-bold">
            {query.q ? (
              <>
                Results for <span className="text-primary">“{query.q}”</span>
              </>
            ) : (
              "Shop all"
            )}
          </h1>
        </div>
        <form action="/shop" role="search" className="relative w-full md:max-w-sm">
          <label htmlFor="shop-q" className="sr-only">
            Search products
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-soft" />
          <input
            id="shop-q"
            name="q"
            type="search"
            defaultValue={query.q}
            placeholder="Search by name, use or SKU"
            className="h-12 w-full rounded-md border border-line-strong bg-surface pr-4 pl-10 text-[15px] placeholder:text-ink-soft/70 focus-visible:border-ink"
          />
        </form>
      </header>
      <Catalogue query={query} />
    </div>
  );
}
