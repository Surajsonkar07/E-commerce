import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Package } from "lucide-react";
import { LineThumb } from "@/components/cart/line-thumb";
import { ThemeSegment } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/auth";
import { getProduct } from "@/lib/catalog";
import { read } from "@/lib/db";
import { formatDate, formatMoney } from "@/lib/format";
import { orderProgress } from "@/lib/pricing";
import { SignOutButton } from "./sign-out-button";

export const metadata: Metadata = { title: "Your account", robots: { index: false } };

export default async function AccountPage() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/account");
  const orders = await read((s) => s.orders.filter((o) => o.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  const spent = orders.reduce((n, o) => n + o.total, 0);

  return (
    <div className="container-x pt-8 lg:pt-12">
      <p className="eyebrow">Member since {formatDate(user.createdAt)}</p>
      <h1 className="mt-2 text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-bold">Hello, {user.name.split(" ")[0]}</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <aside className="flex flex-col gap-4 lg:col-span-4">
          <section className="rounded-lg bg-surface p-5 shadow-card sm:p-6" aria-label="Profile">
            <dl className="flex flex-col gap-4">
              <div>
                <dt className="eyebrow">Name</dt>
                <dd className="mt-1">{user.name}</dd>
              </div>
              <div>
                <dt className="eyebrow">Email</dt>
                <dd className="mt-1 break-all">{user.email}</dd>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-line pt-4">
                <div>
                  <dt className="eyebrow">Orders</dt>
                  <dd className="mt-1 font-mono text-2xl">{orders.length}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Spent</dt>
                  <dd className="mt-1 font-mono text-2xl">{formatMoney(spent)}</dd>
                </div>
              </div>
            </dl>
          </section>
          <section className="rounded-lg border border-line p-5 sm:p-6" aria-labelledby="pref-title">
            <h2 id="pref-title" className="eyebrow mb-3">
              Appearance
            </h2>
            <ThemeSegment />
          </section>
          <SignOutButton />
        </aside>

        <section className="lg:col-span-8" aria-labelledby="orders-title" id="orders">
          <h2 id="orders-title" className="border-b border-ink pb-3 font-sans text-lg font-semibold tracking-normal">
            Order history
          </h2>
          {orders.length ? (
            <ul>
              {orders.map((o) => {
                const prog = orderProgress(o.createdAt, o.delivery);
                const status = [...prog].reverse().find((s) => s.done)?.label ?? "Order placed";
                return (
                  <li key={o.id} className="border-b border-line">
                    <Link href={`/order/${o.id}`} className="group flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
                      <div className="flex -space-x-3">
                        {o.lines.slice(0, 3).map((l) => (
                          <LineThumb key={l.productId + JSON.stringify(l.options)} src={l.image} mode={getProduct(l.slug)?.imageMode ?? "cutout"} className="size-14 ring-2 ring-paper" />
                        ))}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-sm">{o.id}</p>
                        <p className="text-sm text-ink-soft">
                          {formatDate(o.createdAt)} · {o.lines.reduce((n, l) => n + l.qty, 0)} items · {o.paymentStatus === "paid" ? "Paid" : "Cash on delivery"}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <span className="rounded-full bg-sunken px-3 py-1 text-xs font-medium">{status}</span>
                        <span className="font-mono font-semibold">{formatMoney(o.total)}</span>
                        <ArrowUpRight className="size-4 text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-line-strong px-6 py-16 text-center">
              <Package className="size-10 text-ink-soft" strokeWidth={1.25} />
              <p className="mt-4 text-lg font-medium">No orders yet</p>
              <p className="mt-1 text-ink-soft">When you place one, you can track it here.</p>
              <Button asChild className="mt-6">
                <Link href="/shop">Start shopping</Link>
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
