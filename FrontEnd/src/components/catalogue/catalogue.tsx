import Link from "next/link";
import { Suspense } from "react";
import { PackageSearch } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { categories, categoryCount, queryProducts, type CatalogQuery } from "@/lib/catalog";
import { CatalogueShell } from "./filters";
import { GridSkeleton } from "./grid-skeleton";

export function Catalogue({ query, fixedCategory }: { query: CatalogQuery; fixedCategory?: string }) {
  const q: CatalogQuery = fixedCategory ? { ...query, categories: [fixedCategory] } : query;
  const list = queryProducts(q);
  const cats = categories.map((c) => ({ ...c, count: categoryCount(c.slug) }));

  return (
    <Suspense fallback={<GridSkeleton />}>
      <CatalogueShell categories={cats} fixedCategory={fixedCategory} total={list.length}>
        {list.length ? (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 2xl:grid-cols-4">
            {list.map((p, i) => (
              <li key={p.id}>
                <ProductCard product={p} index={i} priority={i < 2} headingLevel="h2" sizes="(min-width: 1536px) 20vw, (min-width: 1024px) 26vw, (min-width: 768px) 31vw, 46vw" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-line-strong px-6 py-16 text-center">
            <PackageSearch className="size-10 text-ink-soft" strokeWidth={1.5} />
            <h2 className="mt-4 text-2xl font-semibold">Nothing on this shelf</h2>
            <p className="mt-2 max-w-sm text-ink-soft">
              No products match {query.q ? <>“{query.q}” with </> : null}these filters. Loosen one of them, or browse everything.
            </p>
            <Link href={fixedCategory ? `/c/${fixedCategory}` : "/shop"} className="mt-6 inline-flex h-11 items-center rounded-md bg-ink px-5 text-sm font-medium text-paper">
              Clear filters
            </Link>
          </div>
        )}
      </CatalogueShell>
    </Suspense>
  );
}
