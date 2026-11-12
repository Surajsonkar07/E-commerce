"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, Check, CreditCard, Loader2, Lock, Pencil, Rocket, ShoppingBag, Truck } from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { toast } from "sonner";
import { AuthForm } from "@/components/auth/auth-form";
import { LineThumb } from "@/components/cart/line-thumb";
import { Receipt } from "@/components/cart/receipt";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { formatMoney } from "@/lib/format";
import { addressSchema, type AddressInput } from "@/lib/schemas";
import { useLoadSession, useSession } from "@/lib/session";
import { site } from "@/lib/site";
import { useHydrated, useShop } from "@/lib/store";
import { cn } from "@/lib/utils";

const ADDRESS_KEY = "sarani-address";
const COUNTRIES = ["Bangladesh", "India", "Nepal", "Sri Lanka", "United Arab Emirates", "United Kingdom", "United States"];

type Step = 1 | 2 | 3;

function StepShell({ n, title, step, done, summary, onEdit, children }: { n: number; title: string; step: Step; done: boolean; summary?: React.ReactNode; onEdit: () => void; children: React.ReactNode }) {
  const open = step === n;
  return (
    <section className={cn("rounded-lg border bg-surface transition-colors", open ? "border-ink" : "border-line")} aria-labelledby={`step-${n}`}>
      <header className="flex items-center gap-4 p-5 sm:p-6">
        <span className={cn("grid size-8 shrink-0 place-items-center rounded-full font-mono text-sm", done && !open ? "bg-success text-paper" : open ? "bg-ink text-paper" : "bg-sunken text-ink-soft")}>
          {done && !open ? <Check className="size-4" /> : n}
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={`step-${n}`} className="font-sans text-lg font-semibold tracking-normal">
            {title}
          </h2>
          {!open && done && summary ? <div className="mt-0.5 truncate text-sm text-ink-soft">{summary}</div> : null}
        </div>
        {!open && done ? (
          <button type="button" onClick={onEdit} className="inline-flex h-10 items-center gap-1.5 rounded-md px-3 text-sm hover:bg-sunken">
            <Pencil className="size-3.5" /> Edit
          </button>
        ) : null}
      </header>
      <AnimatePresence initial={false}>
        {open ? (
          <m.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
            <div className="border-t border-line p-5 sm:p-6">{children}</div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

export function CheckoutFlow() {
  useLoadSession();
  const hydrated = useHydrated();
  const router = useRouter();
  const { user, status } = useSession();
  const cart = useShop((s) => s.cart);
  const promo = useShop((s) => s.promo);
  const clearCart = useShop((s) => s.clearCart);

  const [step, setStep] = useState<Step>(1);
  const [maxStep, setMaxStep] = useState<Step>(1);
  const [address, setAddress] = useState<AddressInput | null>(null);
  const [delivery, setDelivery] = useState<"standard" | "express">("standard");
  const [payment, setPayment] = useState<"demo" | "cod">("demo");
  const [note, setNote] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  const form = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: { fullName: "", phone: "", line1: "", line2: "", city: "Dhaka", postcode: "", country: "Bangladesh" },
  });
  const e = form.formState.errors;

  // Prefill from the last order on this device, and the account name.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(ADDRESS_KEY);
      if (saved) form.reset(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, [form]);
  useEffect(() => {
    if (user && !form.getValues("fullName")) form.setValue("fullName", user.name);
  }, [user, form]);

  const go = (n: Step) => {
    setStep(n);
    setMaxStep((m) => (n > m ? n : m));
    requestAnimationFrame(() => document.getElementById(`step-${n}`)?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  if (!hydrated || status !== "ready") {
    return (
      <div className="mt-8 grid gap-10 lg:grid-cols-12" aria-busy="true">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <div className="skeleton h-80" />
          <div className="skeleton h-20" />
          <div className="skeleton h-20" />
        </div>
        <div className="skeleton h-80 lg:col-span-5" />
      </div>
    );
  }

  if (!cart.length && !placed) {
    return (
      <div className="mt-10 flex flex-col items-center rounded-xl border border-dashed border-line-strong px-6 py-20 text-center">
        <ShoppingBag className="size-12 text-ink-soft" strokeWidth={1.25} />
        <h2 className="mt-5 text-2xl font-semibold">There&apos;s nothing to check out</h2>
        <p className="mt-2 text-ink-soft">Add something to your bag first.</p>
        <Button asChild className="mt-7">
          <Link href="/shop">Browse the shop</Link>
        </Button>
      </div>
    );
  }

  async function placeOrder() {
    if (!address) return go(1);
    setPlacing(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        lines: cart.map((l) => ({ productId: l.productId, options: l.options, qty: l.qty })),
        address,
        delivery,
        payment,
        promo,
        note: note.trim() || undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setPlacing(false);
      toast.error("We couldn't place your order", { description: data.error });
      return;
    }
    setPlaced(true);
    clearCart();
    router.push(`/order/${data.order.id}?placed=1`);
  }

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="flex flex-col gap-4 lg:col-span-7">
        {!user ? (
          <section className="rounded-lg border border-ink bg-surface p-5 sm:p-6" aria-labelledby="auth-title">
            <h2 id="auth-title" className="font-sans text-lg font-semibold tracking-normal">
              {authMode === "signup" ? "Create an account to check out" : "Sign in to check out"}
            </h2>
            <p className="mt-1 mb-6 text-sm text-ink-soft">We use it to keep your order history and let you track deliveries. Your bag stays as it is.</p>
            <AuthForm mode={authMode} idPrefix="co" onSuccess={() => undefined} onSwitch={() => setAuthMode((m) => (m === "login" ? "signup" : "login"))} />
          </section>
        ) : (
          <p className="flex items-center gap-2 rounded-md bg-sunken px-4 py-3 text-sm">
            <Check className="size-4 text-success" /> Signed in as <span className="font-medium">{user.email}</span>
          </p>
        )}

        <fieldset disabled={!user} className={cn("flex flex-col gap-4", !user && "pointer-events-none opacity-50")} aria-disabled={!user}>
          <StepShell
            n={1}
            title="Delivery address"
            step={step}
            done={!!address}
            onEdit={() => go(1)}
            summary={address ? `${address.fullName}, ${address.line1}, ${address.city} ${address.postcode}` : null}
          >
            <form
              noValidate
              onSubmit={form.handleSubmit((values) => {
                setAddress(values);
                try {
                  localStorage.setItem(ADDRESS_KEY, JSON.stringify(values));
                } catch {
                  /* ignore */
                }
                go(2);
              })}
              className="grid gap-4 sm:grid-cols-2"
            >
              <Field label="Full name" htmlFor="fullName" error={e.fullName?.message}>
                <Input id="fullName" autoComplete="name" aria-invalid={!!e.fullName} {...form.register("fullName")} />
              </Field>
              <Field label="Phone" htmlFor="phone" error={e.phone?.message} hint="For the courier only.">
                <Input id="phone" type="tel" autoComplete="tel" inputMode="tel" aria-invalid={!!e.phone} {...form.register("phone")} />
              </Field>
              <Field label="Street address" htmlFor="line1" error={e.line1?.message} className="sm:col-span-2">
                <Input id="line1" autoComplete="address-line1" aria-invalid={!!e.line1} {...form.register("line1")} />
              </Field>
              <Field label="Apartment, floor (optional)" htmlFor="line2" className="sm:col-span-2">
                <Input id="line2" autoComplete="address-line2" {...form.register("line2")} />
              </Field>
              <Field label="City" htmlFor="city" error={e.city?.message}>
                <Input id="city" autoComplete="address-level2" aria-invalid={!!e.city} {...form.register("city")} />
              </Field>
              <Field label="Postcode" htmlFor="postcode" error={e.postcode?.message}>
                <Input id="postcode" autoComplete="postal-code" aria-invalid={!!e.postcode} {...form.register("postcode")} />
              </Field>
              <Field label="Country" htmlFor="country" className="sm:col-span-2">
                <Select id="country" autoComplete="country-name" {...form.register("country")}>
                  {COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </Field>
              <Button type="submit" size="lg" className="sm:col-span-2 sm:justify-self-start">
                Continue to delivery
              </Button>
            </form>
          </StepShell>

          <StepShell n={2} title="Delivery speed" step={step} done={maxStep > 2} onEdit={() => go(2)} summary={delivery === "express" ? `Express, next working day · ${formatMoney(site.expressFee)}` : "Standard, 2–4 working days · Free"}>
            <div role="radiogroup" aria-label="Delivery speed" className="grid gap-3 sm:grid-cols-2">
              {[
                { v: "standard" as const, icon: Truck, t: "Standard", d: "2–4 working days", price: "Free" },
                { v: "express" as const, icon: Rocket, t: "Express", d: "Next working day, order by 4pm", price: formatMoney(site.expressFee) },
              ].map((o) => (
                <label key={o.v} className={cn("flex cursor-pointer gap-3 rounded-md border p-4 transition-colors", delivery === o.v ? "border-ink bg-sunken" : "border-line-strong hover:border-ink")}>
                  <input type="radio" name="delivery" value={o.v} checked={delivery === o.v} onChange={() => setDelivery(o.v)} className="mt-1 size-4 accent-[var(--primary)]" />
                  <span className="flex-1">
                    <span className="flex items-center justify-between font-medium">
                      <span className="flex items-center gap-2">
                        <o.icon className="size-4" /> {o.t}
                      </span>
                      <span className="font-mono text-sm">{o.price}</span>
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-soft">{o.d}</span>
                  </span>
                </label>
              ))}
            </div>
            <Field label="Note for the courier (optional)" htmlFor="note" className="mt-5">
              <Textarea id="note" value={note} onChange={(ev) => setNote(ev.target.value)} maxLength={300} className="min-h-20" placeholder="Gate code, best time to call…" />
            </Field>
            <Button size="lg" className="mt-5" onClick={() => go(3)}>
              Continue to payment
            </Button>
          </StepShell>

          <StepShell n={3} title="Payment" step={step} done={false} onEdit={() => go(3)}>
            <div role="radiogroup" aria-label="Payment method" className="flex flex-col gap-3">
              {[
                { v: "demo" as const, icon: CreditCard, t: "Pay now (demo)", d: "Simulates an approved online payment. No card details are asked for or stored." },
                { v: "cod" as const, icon: Banknote, t: "Cash on delivery", d: "Pay the courier in cash when your order arrives." },
              ].map((o) => (
                <label key={o.v} className={cn("flex cursor-pointer gap-3 rounded-md border p-4 transition-colors", payment === o.v ? "border-ink bg-sunken" : "border-line-strong hover:border-ink")}>
                  <input type="radio" name="payment" value={o.v} checked={payment === o.v} onChange={() => setPayment(o.v)} className="mt-1 size-4 accent-[var(--primary)]" />
                  <span>
                    <span className="flex items-center gap-2 font-medium">
                      <o.icon className="size-4" /> {o.t}
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-soft">{o.d}</span>
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-6 rounded-md border border-line p-4">
              <p className="eyebrow mb-3">Review</p>
              <ul className="flex flex-col gap-3">
                {cart.map((l) => (
                  <li key={l.key} className="flex items-center gap-3 text-sm">
                    <LineThumb src={l.image} mode={l.imageMode} className="size-12" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{l.name}</span>
                      <span className="block truncate text-ink-soft">{[...Object.values(l.options), `Qty ${l.qty}`].join(" · ")}</span>
                    </span>
                    <span className="font-mono tabular-nums">{formatMoney(l.unitPrice * l.qty)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button size="lg" className="mt-6 w-full" onClick={placeOrder} disabled={placing}>
              {placing ? <Loader2 className="animate-spin" /> : <Lock />}
              {placing ? (payment === "demo" ? "Authorising payment…" : "Placing order…") : "Place order"}
            </Button>
            <p className="mt-3 text-center text-xs text-ink-soft">By placing your order you agree to our 30-day returns policy.</p>
          </StepShell>
        </fieldset>
      </div>

      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-24">
          <Receipt delivery={delivery} compactLines />
        </div>
      </div>
    </div>
  );
}
