import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, CircleDot } from "lucide-react";
import { LineThumb } from "@/components/cart/line-thumb";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/auth";
import { getProduct } from "@/lib/catalog";
import { read } from "@/lib/db";
import { formatDate, formatMoney } from "@/lib/format";
import { orderProgress } from "@/lib/pricing";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ placed?: string }> };

export const metadata: Metadata = { title: "Your order", robots: { index: false } };

export default async function OrderPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { placed } = await searchParams;
  const user = await currentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/order/${id}`)}`);
  const order = await read((s) => s.orders.find((o) => o.id === id && o.userId === user.id));
  if (!order) notFound();
  const progress = orderProgress(order.createdAt, order.delivery);
  const isNew = placed === "1";

  return (
    <div className="container-x pt-8 lg:pt-12">
      <div className={cn("rounded-xl p-6 sm:p-10", isNew ? "bg-ink text-paper" : "bg-surface shadow-card")}>
        <p className={cn("font-mono text-xs tracking-[0.08em] uppercase", isNew ? "text-accent" : "text-ink-soft")}>
          {isNew ? "Step 3 of 3 · Confirmed" : `Order placed ${formatDate(order.createdAt)}`}
        </p>
        <h1 className="mt-3 text-[clamp(2rem,5vw,3.5rem)] leading-[0.98] font-bold">
          {isNew ? <>Thank you, {order.address.fullName.split(" ")[0]}. It&apos;s on its way.</> : <>Order {order.id}</>}
        </h1>
        <p className={cn("mt-4 max-w-xl text-[17px]", isNew ? "text-paper/75" : "text-ink-soft")}>
          {isNew ? (
            <>
              Order <span className="font-mono text-paper">{order.id}</span> is confirmed.{" "}
              {order.paymentStatus === "paid" ? "Your demo payment was approved." : `Please have ${formatMoney(order.total)} in cash ready for the courier.`} We&apos;ll keep this page updated as it moves.
            </>
          ) : (
            <>{order.lines.reduce((n, l) => n + l.qty, 0)} items · {formatMoney(order.total)} · {order.paymentStatus === "paid" ? "Paid" : "Cash on delivery"}</>
          )}
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <h2 className="eyebrow mb-5">Tracking</h2>
          <ol className="relative flex flex-col gap-6 border-l border-line pl-6">
            {progress.map((s, i) => (
              <li key={s.label} className="relative">
                <span className={cn("absolute top-0.5 -left-[33px] grid size-[18px] place-items-center rounded-full bg-paper", s.done ? "text-success" : "text-line-strong")}>
                  {s.done ? <CheckCircle2 className="size-[18px]" /> : <CircleDot className="size-[18px]" />}
                </span>
                <p className={cn("font-medium", !s.done && "text-ink-soft")}>{s.label}</p>
                <p className="font-mono text-xs text-ink-soft">
                  {s.done ? new Date(s.at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : i === progress.length - 1 ? `Expected ${formatDate(s.at)}` : "Pending"}
                </p>
              </li>
            ))}
          </ol>

          <h2 className="eyebrow mt-12 mb-3">Items</h2>
          <ul className="border-t border-line">
            {order.lines.map((l) => {
              const p = getProduct(l.slug);
              return (
                <li key={`${l.productId}-${JSON.stringify(l.options)}`} className="flex items-center gap-4 border-b border-line py-4">
                  <LineThumb src={l.image} mode={p?.imageMode ?? "cutout"} className="size-16 sm:size-20" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/product/${l.slug}`} className="font-medium hover:text-primary">
                      {l.name}
                    </Link>
                    <p className="text-sm text-ink-soft">{[...Object.values(l.options), `Qty ${l.qty}`].join(" · ")}</p>
                  </div>
                  <p className="font-mono tabular-nums">{formatMoney(l.unitPrice * l.qty)}</p>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="flex flex-col gap-4 lg:col-span-5">
          <section className="rounded-lg bg-surface p-5 shadow-card sm:p-6" aria-label="Totals">
            <dl className="flex flex-col gap-2.5 font-mono text-sm tabular-nums">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd>{formatMoney(order.subtotal)}</dd>
              </div>
              {order.discount ? (
                <div className="flex justify-between text-success">
                  <dt>Promo</dt>
                  <dd>−{formatMoney(order.discount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt className="text-ink-soft">{order.delivery === "express" ? "Express delivery" : "Standard delivery"}</dt>
                <dd>{order.shipping ? formatMoney(order.shipping) : "Free"}</dd>
              </div>
            </dl>
            <div className="rule-dashed my-4" />
            <p className="flex items-baseline justify-between">
              <span className="font-medium">{order.paymentStatus === "paid" ? "Paid" : "Due on delivery"}</span>
              <span className="font-mono text-2xl font-semibold">{formatMoney(order.total)}</span>
            </p>
          </section>
          <section className="rounded-lg border border-line p-5 sm:p-6" aria-label="Delivery details">
            <h2 className="eyebrow mb-2">Delivering to</h2>
            <address className="text-[15px] leading-relaxed not-italic">
              {order.address.fullName}
              <br />
              {order.address.line1}
              {order.address.line2 ? (
                <>
                  <br />
                  {order.address.line2}
                </>
              ) : null}
              <br />
              {order.address.city} {order.address.postcode}, {order.address.country}
              <br />
              <span className="font-mono text-sm text-ink-soft">{order.address.phone}</span>
            </address>
            {order.note ? <p className="mt-3 text-sm text-ink-soft">Note: {order.note}</p> : null}
          </section>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/account#orders">All orders</Link>
            </Button>
            <Button asChild>
              <Link href="/shop">Keep shopping</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
