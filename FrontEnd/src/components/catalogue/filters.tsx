"use client";

import { useOptimistic, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, Star, X } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Select } from "@/components/ui/field";
import { PRICE_BANDS, SORTS, type Category } from "@/lib/catalog-core";
import { cn } from "@/lib/utils";

type Props = {
  categories: (Category & { count: number })[];
  fixedCategory?: string;
  total: number;
  children: React.ReactNode;
};

function useFilterParams() {
  const router = useRouter();
  const pathname = usePathname() ?? "/shop";
  const params = useSearchParams() ?? new URLSearchParams();
  const [pending, start] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(params.toString());
  const current = new URLSearchParams(optimistic);

  const update = (mut: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(optimistic);
    mut(next);
    const qs = next.toString();
    start(() => {
      setOptimistic(qs);
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };
  return { current, update, pending };
}

export function CatalogueShell({ categories, fixedCategory, total, children }: Props) {
  const { current, update, pending } = useFilterParams();
  const selectedCats = (current.get("category") ?? "").split(",").filter(Boolean);

  const toggleCat = (slug: string) =>
    update((p) => {
      const set = new Set(selectedCats);
      if (set.has(slug)) set.delete(slug);
      else set.add(slug);
      if (set.size) p.set("category", [...set].join(","));
      else p.delete("category");
    });
  const setOrDelete = (key: string, value?: string) =>
    update((p) => {
      if (value) p.set(key, value);
      else p.delete(key);
    });

  const chips: { label: string; clear: () => void }[] = [];
  const q = current.get("q");
  if (q) chips.push({ label: `“${q}”`, clear: () => setOrDelete("q") });
  for (const c of selectedCats) chips.push({ label: categories.find((x) => x.slug === c)?.name ?? c, clear: () => toggleCat(c) });
  const price = current.get("price") as keyof typeof PRICE_BANDS | null;
  if (price && PRICE_BANDS[price]) chips.push({ label: PRICE_BANDS[price], clear: () => setOrDelete("price") });
  if (current.get("rating")) chips.push({ label: `${current.get("rating")}★ & up`, clear: () => setOrDelete("rating") });
  if (current.get("sale") === "1") chips.push({ label: "On sale", clear: () => setOrDelete("sale") });
  if (current.get("stock") === "1") chips.push({ label: "In stock", clear: () => setOrDelete("stock") });

  const panel = (
    <div className="flex flex-col gap-8">
      {!fixedCategory ? (
        <fieldset>
          <legend className="eyebrow mb-3">Department</legend>
          <ul className="flex flex-col">
            {categories.map((c) => (
              <li key={c.slug}>
                <label className="flex min-h-10 items-center gap-3 text-[15px]">
                  <input type="checkbox" aria-label={c.name} checked={selectedCats.includes(c.slug)} onChange={() => toggleCat(c.slug)} className="size-[18px] accent-[var(--primary)]" />
                  <span className="flex-1">{c.name}</span>
                  <span className="font-mono text-xs text-ink-soft">{c.count}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      ) : null}

      <fieldset>
        <legend className="eyebrow mb-3">Price</legend>
        <div className="flex flex-col">
          {Object.entries(PRICE_BANDS).map(([k, label]) => (
            <label key={k} className="flex min-h-10 items-center gap-3 text-[15px]">
              <input
                type="radio"
                name="price"
                checked={price === k}
                onChange={() => setOrDelete("price", k)}
                onClick={() => price === k && setOrDelete("price")}
                className="size-[18px] accent-[var(--primary)]"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow mb-3">Rating</legend>
        <div className="flex gap-2">
          {[4.5, 4].map((r) => {
            const on = current.get("rating") === String(r);
            return (
              <button
                key={r}
                type="button"
                aria-pressed={on}
                onClick={() => setOrDelete("rating", on ? undefined : String(r))}
                className={cn(
                  "inline-flex h-10 items-center gap-1 rounded-full border px-3.5 font-mono text-sm transition-colors",
                  on ? "border-ink bg-ink text-paper" : "border-line-strong hover:border-ink",
                )}
              >
                <Star className="size-3.5 fill-current stroke-none" /> {r}+
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-1">
        <legend className="eyebrow mb-3">Availability</legend>
        {[
          ["sale", "On sale only"],
          ["stock", "In stock only"],
        ].map(([k, label]) => (
          <label key={k} className="flex min-h-10 items-center justify-between gap-3 text-[15px]">
            {label}
            <input
              type="checkbox"
              role="switch"
              checked={current.get(k) === "1"}
              onChange={(e) => setOrDelete(k, e.target.checked ? "1" : undefined)}
              className="peer relative h-6 w-10 cursor-pointer appearance-none rounded-full bg-line-strong transition-colors before:absolute before:top-0.5 before:left-0.5 before:size-5 before:rounded-full before:bg-surface before:shadow before:transition-transform checked:bg-primary checked:before:translate-x-4"
            />
          </label>
        ))}
      </fieldset>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[232px_minmax(0,1fr)] lg:gap-12">
      <aside aria-label="Filters" className="hidden lg:block">
        <div className="sticky top-24">{panel}</div>
      </aside>
      <div>
      <div className="flex flex-wrap items-center gap-3">
        <Sheet>
          <SheetTrigger className="inline-flex h-11 items-center gap-2 rounded-md border border-line-strong bg-surface px-4 text-sm font-medium hover:border-ink lg:hidden">
            <SlidersHorizontal className="size-4" /> Filters
            {chips.length ? <span className="grid size-5 place-items-center rounded-full bg-primary font-mono text-[11px] text-primary-ink">{chips.length}</span> : null}
          </SheetTrigger>
          <SheetContent side="bottom" aria-describedby="filters-desc">
            <div className="flex h-16 shrink-0 items-center border-b border-line px-5">
              <SheetTitle className="font-display text-xl font-semibold">Filters</SheetTitle>
              <SheetDescription id="filters-desc" className="sr-only">
                Narrow down the products shown
              </SheetDescription>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{panel}</div>
            <div className="flex gap-3 border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                className="h-12 flex-1 rounded-md border border-line-strong text-sm font-medium"
                onClick={() => update((p) => ["category", "price", "rating", "sale", "stock", "q"].forEach((k) => p.delete(k)))}
              >
                Clear all
              </button>
              <SheetClose className="h-12 flex-[2] rounded-md bg-ink text-sm font-medium text-paper">Show {total} results</SheetClose>
            </div>
          </SheetContent>
        </Sheet>

        <p className="text-sm text-ink-soft" aria-live="polite">
          <span className="font-mono text-ink">{total}</span> {total === 1 ? "product" : "products"}
          {pending ? <span className="ml-2 inline-block size-2 animate-pulse rounded-full bg-primary align-middle" aria-label="Updating" /> : null}
        </p>

        <label className="ml-auto flex items-center gap-2 text-sm">
          <span className="whitespace-nowrap text-ink-soft max-sm:sr-only">Sort by</span>
          <Select value={current.get("sort") ?? "featured"} onChange={(e) => setOrDelete("sort", e.target.value === "featured" ? undefined : e.target.value)} className="h-11 w-auto min-w-44">
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </label>
      </div>

      {chips.length ? (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Active filters">
          {chips.map((c) => (
            <li key={c.label}>
              <button type="button" onClick={c.clear} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-sunken pr-2.5 pl-3.5 text-sm hover:bg-line" aria-label={`Remove filter ${c.label}`}>
                {c.label} <X className="size-3.5" />
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="h-9 px-2 text-sm underline underline-offset-4"
              onClick={() => update((p) => ["category", "price", "rating", "sale", "stock", "q"].forEach((k) => p.delete(k)))}
            >
              Clear all
            </button>
          </li>
        </ul>
      ) : null}

        <div className={cn("mt-8 transition-opacity duration-200", pending && "pointer-events-none opacity-55")}>{children}</div>
      </div>
    </div>
  );
}
