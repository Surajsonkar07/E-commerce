"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { getProductById, type Product } from "@/lib/catalog";
import { useHydrated, useShop } from "@/lib/store";

export function WishlistView() {
  const hydrated = useHydrated();
  const ids = useShop((s) => s.wishlist);
  const items = ids.map(getProductById).filter((p): p is Product => Boolean(p));

  if (!hydrated) {
    return (
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4" aria-busy="true">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton aspect-[4/5]" />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mt-10 flex flex-col items-center rounded-xl border border-dashed border-line-strong px-6 py-20 text-center">
        <Heart className="size-12 text-ink-soft" strokeWidth={1.25} />
        <h2 className="mt-5 text-2xl font-semibold">Nothing saved yet</h2>
        <p className="mt-2 max-w-sm text-ink-soft">Tap the heart on anything you like and it will wait for you here, even after you close the browser.</p>
        <Button asChild className="mt-7">
          <Link href="/shop">Browse the shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <p className="mt-3 text-ink-soft">
        <span className="font-mono text-ink">{items.length}</span> saved {items.length === 1 ? "item" : "items"}. Prices update automatically if they drop.
      </p>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence initial={false}>
          {items.map((p, i) => (
            <motion.li key={p.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
              <ProductCard product={p} index={i} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </>
  );
}
