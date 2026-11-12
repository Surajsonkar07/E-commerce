"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus, ShoppingBag, Truck, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { defaultOptions, priceFor, type Product } from "@/lib/catalog";
import { formatMoney } from "@/lib/format";
import { useHydrated, useShop } from "@/lib/store";
import { cn } from "@/lib/utils";
import { WishButton } from "./wish-button";

function deliveryWindow() {
  const fmt = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const add = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return fmt.format(d);
  };
  return { standard: `${add(2)} – ${add(4)}`, express: add(1) };
}

export function PurchasePanel({ product: p }: { product: Product }) {
  const [selected, setSelected] = useState<Record<string, string>>(() => defaultOptions(p));
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const addRef = useRef<HTMLDivElement>(null);
  const add = useShop((s) => s.addToCart);
  const router = useRouter();
  const unit = priceFor(p, selected);
  const compare = p.compareAt + (unit - p.price);
  const soldOut = p.stock <= 0;

  const hydrated = useHydrated();
  const dates = hydrated ? deliveryWindow() : null;
  useEffect(() => {
    const el = addRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const addToBag = (then?: "checkout") => {
    add({ productId: p.id, slug: p.slug, name: p.name, image: p.image, imageMode: p.imageMode, unitPrice: unit, options: selected }, qty);
    if (then === "checkout") {
      router.push("/checkout");
      return;
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
    toast.success(`${qty} × ${p.name} added`, {
      description: Object.values(selected).join(" · ") || undefined,
      action: { label: "View bag", onClick: () => router.push("/cart") },
    });
  };

  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className="flex items-baseline gap-3 font-mono tabular-nums">
          <motion.span key={unit} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-semibold">
            {formatMoney(unit)}
          </motion.span>
          {compare > unit ? <s className="text-lg text-ink-soft">{formatMoney(compare)}</s> : null}
          {compare > unit ? (
            <span className="rounded-sm bg-accent px-1.5 py-0.5 text-[13px] font-semibold text-accent-ink">Save {formatMoney(compare - unit)}</span>
          ) : null}
        </p>
        <p className="mt-1 text-[13px] text-ink-soft">Price includes VAT. Free standard delivery.</p>
      </div>

      {p.options.map((opt) => (
        <fieldset key={opt.name}>
          <legend className="mb-2.5 flex w-full items-baseline justify-between text-sm">
            <span className="font-medium">{opt.name}</span>
            <span className="text-ink-soft">{selected[opt.name]}</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {opt.values.map((v) => {
              const on = selected[opt.name] === v.label;
              const id = `${p.id}-${opt.name}-${v.label}`.replace(/\W+/g, "-");
              return (
                <label key={v.label} htmlFor={id} className="relative">
                  <input
                    id={id}
                    type="radio"
                    name={opt.name}
                    value={v.label}
                    checked={on}
                    onChange={() => setSelected((s) => ({ ...s, [opt.name]: v.label }))}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      "flex h-11 min-w-11 items-center justify-center gap-2 rounded-md border px-3.5 text-sm transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)]",
                      on ? "border-ink bg-ink text-paper" : "border-line-strong bg-surface hover:border-ink",
                    )}
                  >
                    {v.swatch ? <span className="size-4 rounded-full border border-black/15" style={{ background: v.swatch }} aria-hidden /> : null}
                    {v.label}
                    {v.delta ? <span className={cn("font-mono text-xs", on ? "text-paper/70" : "text-ink-soft")}>{v.delta > 0 ? "+" : "−"}${Math.abs(v.delta)}</span> : null}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div ref={addRef} className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="flex h-12 items-center rounded-md border border-line-strong bg-surface" role="group" aria-label="Quantity">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} className="grid size-12 place-items-center disabled:opacity-40" aria-label="Decrease quantity">
              <Minus className="size-4" />
            </button>
            <output className="w-8 text-center font-mono tabular-nums" aria-live="polite" aria-label={`Quantity ${qty}`}>
              {qty}
            </output>
            <button type="button" onClick={() => setQty((q) => Math.min(Math.min(10, p.stock), q + 1))} disabled={qty >= Math.min(10, p.stock)} className="grid size-12 place-items-center disabled:opacity-40" aria-label="Increase quantity">
              <Plus className="size-4" />
            </button>
          </div>
          <Button size="lg" className="h-12 flex-1" disabled={soldOut} onClick={() => addToBag()}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={String(added)} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.15 }} className="inline-flex items-center gap-2">
                {soldOut ? "Sold out" : added ? (<><Check /> Added</>) : (<><ShoppingBag /> Add to bag</>)}
              </motion.span>
            </AnimatePresence>
          </Button>
        </div>
        <div className="flex gap-3">
          <Button variant="ink" size="lg" className="h-12 flex-1" disabled={soldOut} onClick={() => addToBag("checkout")}>
            <Zap /> Buy now
          </Button>
          <WishButton productId={p.id} name={p.name} withLabel />
        </div>
      </div>

      <div className="rounded-lg border border-line bg-surface">
        <p className="flex items-center gap-3 border-b border-line px-4 py-3 text-sm">
          <span className={cn("size-2 rounded-full", p.stock > 6 ? "bg-success" : p.stock > 0 ? "bg-accent" : "bg-danger")} aria-hidden />
          {p.stock > 6 ? "In stock, ready to ship today" : p.stock > 0 ? `Only ${p.stock} left in stock` : "Out of stock"}
        </p>
        <div className="flex items-start gap-3 px-4 py-3 text-sm">
          <Truck className="mt-0.5 size-4 shrink-0 text-ink-soft" />
          <p>
            <span className="font-medium">Free standard delivery</span> {dates ? <>arrives {dates.standard}</> : "in 2–4 days"}.
            <br />
            <span className="text-ink-soft">Express ($12) {dates ? <>arrives {dates.express}</> : "next day"}. 30-day free returns.</span>
          </p>
        </div>
      </div>

      {/* sticky buy bar on phones once the main button scrolls away */}
      <AnimatePresence>
        {showBar && !soldOut ? (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur-md sm:bottom-0 lg:hidden"
          >
            <div className="mx-auto flex max-w-xl items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="font-mono text-sm">{formatMoney(unit)}</p>
              </div>
              <Button onClick={() => addToBag()} className="h-11">
                <ShoppingBag /> Add
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
