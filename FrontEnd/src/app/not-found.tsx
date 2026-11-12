import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/catalog";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="container-x py-20 lg:py-28">
      <p className="eyebrow">Error 404 · Shelf empty</p>
      <h1 className="mt-4 max-w-3xl text-[clamp(2.75rem,8vw,6rem)] leading-[0.9] font-bold tracking-[-0.045em]">
        We looked on every shelf.
      </h1>
      <p className="mt-6 max-w-lg text-[17px] text-ink-soft">That page doesn&apos;t exist, or the product has been retired. Try a department instead:</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link href={`/c/${c.slug}`} className="inline-flex h-10 items-center rounded-full border border-line-strong px-4 text-sm hover:border-ink">
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
      <Button asChild size="lg" className="mt-10">
        <Link href="/">Back to the front of the store</Link>
      </Button>
    </div>
  );
}
