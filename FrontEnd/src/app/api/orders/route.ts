import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { getProductById, priceFor } from "@/lib/catalog";
import { newId, read, write, type Order, type OrderLine } from "@/lib/db";
import { totals } from "@/lib/pricing";
import { orderSchema } from "@/lib/schemas";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in to see your orders" }, { status: 401 });
  const orders = await read((s) =>
    s.orders.filter((o) => o.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );
  return NextResponse.json({ orders }, { headers: { "Cache-Control": "no-store" } });
}

/**
 * Place an order. Prices are always recomputed on the server from the
 * catalogue; the client's prices are never trusted. Payment is mocked:
 * "demo" is approved after a short simulated authorisation, "cod" is due on delivery.
 */
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Please sign in to place your order" }, { status: 401 });

  const parsed = orderSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid order" }, { status: 400 });
  const input = parsed.data;

  const lines: OrderLine[] = [];
  for (const l of input.lines) {
    const p = getProductById(l.productId);
    if (!p) return NextResponse.json({ error: "One of the items is no longer sold" }, { status: 409 });
    if (p.stock < l.qty) return NextResponse.json({ error: `Only ${p.stock} of ${p.name} left in stock` }, { status: 409 });
    // keep only option values that exist on the product
    const options: Record<string, string> = {};
    for (const opt of p.options) {
      const chosen = l.options[opt.name];
      options[opt.name] = opt.values.some((v) => v.label === chosen) ? chosen : opt.values[0].label;
    }
    lines.push({ productId: p.id, slug: p.slug, name: p.name, image: p.image, options, unitPrice: priceFor(p, options), qty: l.qty });
  }

  const subtotal = lines.reduce((n, l) => n + l.unitPrice * l.qty, 0);
  const t = totals(subtotal, input.delivery, input.promo);

  if (input.payment === "demo") await new Promise((r) => setTimeout(r, 700)); // simulated authorisation

  const order: Order = {
    id: newId("SR-"),
    userId: user.id,
    email: user.email,
    createdAt: new Date().toISOString(),
    lines,
    address: { ...input.address, line2: input.address.line2 || undefined },
    delivery: input.delivery,
    payment: input.payment,
    paymentStatus: input.payment === "demo" ? "paid" : "due-on-delivery",
    subtotal: t.subtotal,
    shipping: t.shipping,
    discount: t.discount,
    total: t.total,
    note: input.note || undefined,
  };
  await write((s) => {
    s.orders.push(order);
  });
  return NextResponse.json({ order }, { status: 201 });
}
