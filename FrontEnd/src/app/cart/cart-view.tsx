"use client";

import Link from "next/link";
import { ArrowRight, Heart, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LineThumb } from "@/components/cart/line-thumb";
import { Receipt } from "@/components/cart/receipt";
import { formatMoney } from "@/lib/format";
import { cartCount, useHydrated, useShop, type CartLine } from "@/lib/store";

export function CartView() {
  const hydrated = useHydrated();
  const cart = useShop((s) => s.cart);
  const count = useShop(cartCount);
  const { setQty, remove, addToCart, toggleWish, wishlist } = useShop();

  if (!hydrated) {
    return (
      <div className="mt-10 grid gap-10 lg:grid-cols-12" aria-busy="true">
        <div className="flex flex-col gap-4 lg:col-span-8">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="skeleton size-24" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-5 w-1/2" />
                <div className="skeleton h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
        <div className="skeleton h-72 lg:col-span-4" />
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="mt-10 flex flex-col items-center rounded-xl border border-dashed border-line-strong px-6 py-20 text-center">
        <ShoppingBag className="size-12 text-ink-soft" strokeWidth={1.25} />
        <h2 className="mt-5 text-2xl font-semibold">Your bag is empty</h2>
        <p className="mt-2 max-w-sm text-ink-soft">Nothing in here yet. The markdowns change every Sunday, so it&apos;s a good place to start.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/shop?sale=1&sort=discount">See the markdowns</Link>
          </Button>
          {wishlist.length ? (
            <Button asChild variant="outline">
              <Link href="/wishlist">Your wishlist ({wishlist.length})</Link>
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  const removeWithUndo = (l: CartLine) => {
    remove(l.key);
    toast(`Removed ${l.name}`, {
      action: { label: "Undo", onClick: () => addToCart({ productId: l.productId, slug: l.slug, name: l.name, image: l.image, imageMode: l.imageMode, unitPrice: l.unitPrice, options: l.options }, l.qty) },
    });
  };

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-8">
        <p className="flex justify-between border-b border-ink pb-3 font-mono text-xs tracking-wide text-ink-soft uppercase">
          <span>
            {count} {count === 1 ? "item" : "items"}
          </span>
          <span>Total</span>
        </p>
        <ul>
          <AnimatePresence initial={false}>
            {cart.map((l) => (
              <motion.li
                key={l.key}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                className="overflow-hidden border-b border-line"
              >
                <div className="flex gap-4 py-5 sm:gap-6">
                  <Link href={`/product/${l.slug}`} tabIndex={-1} aria-hidden>
                    <LineThumb src={l.image} mode={l.imageMode} className="size-24 sm:size-28" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Link href={`/product/${l.slug}`} className="font-medium hover:text-primary sm:text-lg">
                          {l.name}
                        </Link>
                        {Object.keys(l.options).length ? (
                          <p className="mt-0.5 text-sm text-ink-soft">{Object.entries(l.options).map(([k, v]) => `${k}: ${v}`).join(" · ")}</p>
                        ) : null}
                        <p className="mt-0.5 font-mono text-[13px] text-ink-soft">{formatMoney(l.unitPrice)} each</p>
                      </div>
                      <p className="font-mono font-semibold tabular-nums">{formatMoney(l.unitPrice * l.qty)}</p>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
                      <div className="flex h-10 items-center rounded-md border border-line-strong" role="group" aria-label={`Quantity of ${l.name}`}>
                        <button type="button" onClick={() => (l.qty <= 1 ? removeWithUndo(l) : setQty(l.key, l.qty - 1))} className="grid size-10 place-items-center" aria-label="Decrease quantity">
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-7 text-center font-mono text-sm tabular-nums" aria-live="polite">
                          {l.qty}
                        </span>
                        <button type="button" onClick={() => setQty(l.key, l.qty + 1)} disabled={l.qty >= 10} className="grid size-10 place-items-center disabled:opacity-40" aria-label="Increase quantity">
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!wishlist.includes(l.productId)) toggleWish(l.productId);
                          remove(l.key);
                          toast.success("Moved to your wishlist");
                        }}
                        className="inline-flex h-10 items-center gap-1.5 rounded-md px-3 text-sm text-ink-soft hover:bg-sunken hover:text-ink"
                      >
                        <Heart className="size-4" /> <span className="max-sm:sr-only">Save for later</span>
                      </button>
                      <button type="button" onClick={() => removeWithUndo(l)} className="inline-flex h-10 items-center gap-1.5 rounded-md px-3 text-sm text-ink-soft hover:bg-sunken hover:text-danger">
                        <Trash2 className="size-4" /> <span className="max-sm:sr-only">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <Link href="/shop" className="mt-6 inline-flex h-11 items-center text-sm underline underline-offset-4">
          ← Keep shopping
        </Link>
      </div>
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-24">
          <Receipt>
            <Button asChild size="lg" className="w-full">
              <Link href="/checkout">
                Checkout <ArrowRight />
              </Link>
            </Button>
            <p className="mt-3 text-center text-xs text-ink-soft">Demo store: payment is simulated, no card details are collected.</p>
          </Receipt>
        </div>
      </div>
    </div>
  );
}
