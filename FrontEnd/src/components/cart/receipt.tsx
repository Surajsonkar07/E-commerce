"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";
import { toast } from "sonner";
import { formatMoney } from "@/lib/format";
import { PROMOS, totals } from "@/lib/pricing";
import { cartSubtotal, useShop } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Receipt-style order summary used by the bag and checkout. */
export function Receipt({ delivery = "standard", children, className, compactLines }: { delivery?: "standard" | "express"; children?: React.ReactNode; className?: string; compactLines?: boolean }) {
  const subtotal = useShop(cartSubtotal);
  const cart = useShop((s) => s.cart);
  const promo = useShop((s) => s.promo);
  const setPromo = useShop((s) => s.setPromo);
  const [code, setCode] = useState("");
  const t = totals(subtotal, delivery, promo);

  return (
    <section aria-label="Order summary" className={cn("relative rounded-lg bg-surface p-5 shadow-card sm:p-6", className)}>
      <h2 className="font-mono text-xs tracking-[0.1em] uppercase">Order summary</h2>
      <div className="rule-dashed my-4" />
      {compactLines ? (
        <ul className="mb-4 flex flex-col gap-2 text-sm">
          {cart.map((l) => (
            <li key={l.key} className="flex justify-between gap-3">
              <span className="min-w-0 truncate">
                <span className="font-mono text-ink-soft">{l.qty}×</span> {l.name}
              </span>
              <span className="font-mono tabular-nums">{formatMoney(l.unitPrice * l.qty)}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <dl className="flex flex-col gap-2.5 font-mono text-sm tabular-nums">
        <div className="flex justify-between">
          <dt className="text-ink-soft">Subtotal</dt>
          <dd>{formatMoney(t.subtotal)}</dd>
        </div>
        {t.discount ? (
          <div className="flex justify-between text-success">
            <dt className="flex items-center gap-1.5">
              {t.promo}
              <button type="button" onClick={() => setPromo(undefined)} className="grid size-6 place-items-center rounded hover:bg-sunken" aria-label="Remove promo code">
                <X className="size-3.5" />
              </button>
            </dt>
            <dd>−{formatMoney(t.discount)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt className="text-ink-soft">{delivery === "express" ? "Express delivery" : "Standard delivery"}</dt>
          <dd>{t.shipping ? formatMoney(t.shipping) : "Free"}</dd>
        </div>
      </dl>
      <div className="rule-dashed my-4" />
      <p className="flex items-baseline justify-between">
        <span className="font-medium">Total</span>
        <span className="font-mono text-2xl font-semibold tabular-nums">{formatMoney(t.total)}</span>
      </p>

      {!t.promo ? (
        <form
          className="mt-5 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const c = code.trim().toUpperCase();
            if (PROMOS[c]) {
              setPromo(c);
              setCode("");
              toast.success(`${c} applied`, { description: PROMOS[c].label });
            } else toast.error("That code isn't valid", { description: "Codes are case-insensitive. Try SARANI10." });
          }}
        >
          <label htmlFor="promo" className="sr-only">
            Promo code
          </label>
          <div className="relative flex-1">
            <Tag className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft" />
            <input
              id="promo"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Promo code"
              autoComplete="off"
              className="h-11 w-full rounded-md border border-line-strong bg-paper pr-3 pl-9 font-mono text-sm uppercase placeholder:normal-case focus-visible:border-ink"
            />
          </div>
          <button type="submit" className="h-11 rounded-md border border-ink px-4 text-sm font-medium hover:bg-ink hover:text-paper">
            Apply
          </button>
        </form>
      ) : null}
      {children ? <div className="mt-5">{children}</div> : null}
      {/* torn receipt edge */}
      <span aria-hidden className="absolute inset-x-0 -bottom-2 h-2 bg-[radial-gradient(circle_at_6px_0,var(--surface)_5px,transparent_5.5px)] bg-[length:12px_8px]" />
    </section>
  );
}
