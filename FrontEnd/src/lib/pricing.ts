import { site } from "./site";

/** Promo codes the demo store accepts. */
export const PROMOS: Record<string, { label: string; pct: number }> = {
  SARANI10: { label: "10% off your first order", pct: 10 },
};

export const round2 = (n: number) => Math.round(n * 100) / 100;

export function totals(subtotal: number, delivery: "standard" | "express", promo?: string) {
  const code = promo?.trim().toUpperCase();
  const p = code ? PROMOS[code] : undefined;
  const discount = p ? round2((subtotal * p.pct) / 100) : 0;
  const shipping = delivery === "express" ? site.expressFee : 0;
  return { subtotal: round2(subtotal), discount, shipping, total: round2(subtotal - discount + shipping), promo: p ? code : undefined };
}

/** Simulated fulfilment timeline, derived from how long ago the order was placed. */
export function orderProgress(createdAt: string, delivery: "standard" | "express") {
  const hours = (Date.now() - new Date(createdAt).getTime()) / 36e5;
  const steps = delivery === "express" ? [0, 2, 8, 24] : [0, 6, 24, 72];
  const labels = ["Order placed", "Packed", "Out for delivery", "Delivered"];
  const reached = steps.filter((h) => hours >= h).length;
  return labels.map((label, i) => ({
    label,
    done: i < reached,
    at: new Date(new Date(createdAt).getTime() + steps[i] * 36e5).toISOString(),
  }));
}
