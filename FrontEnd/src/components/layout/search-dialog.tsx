"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/sheet";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

type Hit = { id: string; slug: string; name: string; price: number; image: string; imageMode: "cutout" | "photo"; blurb: string };

const suggestions = ["gamepad", "oak", "jacket", "monitor", "phone"];

export function SearchDialog({ className, compact }: { className?: string; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const router = useRouter();
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!q.trim()) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?limit=6&q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        const data = (await res.json()) as { products: Hit[] };
        setHits(data.products);
        setActive(-1);
      } catch {
        /* aborted */
      } finally {
        setLoading(false);
      }
    }, 140);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  const results = q.trim() ? hits : [];

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setQ("");
      }}
    >
      <DialogTrigger asChild>
        {compact ? (
          <button type="button" aria-label="Search the store" className={cn("grid size-11 place-items-center rounded-md hover:bg-sunken", className)}>
            <Search className="size-[19px]" />
          </button>
        ) : (
          <button
            type="button"
            className={cn(
              "flex h-11 w-full items-center gap-2.5 rounded-md border border-line bg-surface px-3.5 text-sm text-ink-soft transition-colors hover:border-line-strong",
              className,
            )}
          >
            <Search className="size-4" />
            <span className="flex-1 text-left">Search 16 things we stock…</span>
            <kbd className="hidden rounded border border-line bg-sunken px-1.5 font-mono text-[11px] lg:inline">Ctrl K</kbd>
          </button>
        )}
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle className="sr-only">Search the store</DialogTitle>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const hit = results[active];
            if (hit) go(`/product/${hit.slug}`);
            else if (q.trim()) go(`/shop?q=${encodeURIComponent(q.trim())}`);
          }}
          className="flex items-center gap-3 border-b border-line px-4"
        >
          {loading ? <Loader2 className="size-5 animate-spin text-ink-soft" /> : <Search className="size-5 text-ink-soft" />}
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, -1));
              }
            }}
            placeholder="Search products, categories, SKUs"
            aria-label="Search products"
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `hit-${results[active].id}` : undefined}
            className="h-16 flex-1 bg-transparent text-base outline-none placeholder:text-ink-soft/70 focus-visible:outline-none"
          />
          {q ? (
            <button type="button" onClick={() => setQ("")} className="grid size-9 place-items-center rounded-md text-ink-soft hover:bg-sunken" aria-label="Clear search">
              <X className="size-4" />
            </button>
          ) : null}
        </form>

        {q.trim() ? (
          results.length ? (
            <ul id="search-results" role="listbox" ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
              {results.map((h, i) => (
                <li key={h.id} id={`hit-${h.id}`} role="option" aria-selected={i === active}>
                  <Link
                    href={`/product/${h.slug}`}
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => setActive(i)}
                    className={cn("flex items-center gap-3 rounded-md p-2", i === active && "bg-sunken")}
                  >
                    <span className={cn("relative size-14 shrink-0 overflow-hidden rounded-md", h.imageMode === "photo" ? "bg-black" : "bg-plinth")}>
                      <Image src={h.image} alt="" fill sizes="56px" className={cn("object-cover", h.imageMode === "cutout" && "cutout")} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{h.name}</span>
                      <span className="block truncate text-[13px] text-ink-soft">{h.blurb}</span>
                    </span>
                    <span className="font-mono text-sm tabular-nums">{formatMoney(h.price)}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button type="button" onClick={() => go(`/shop?q=${encodeURIComponent(q.trim())}`)} className="flex w-full items-center justify-between rounded-md p-3 text-sm font-medium hover:bg-sunken">
                  See all results for “{q.trim()}” <ArrowRight className="size-4" />
                </button>
              </li>
            </ul>
          ) : !loading ? (
            <p className="p-6 text-sm text-ink-soft">Nothing matches “{q.trim()}”. Try a broader word, like “chair” or “gaming”.</p>
          ) : (
            <div className="h-24" />
          )
        ) : (
          <div className="p-4">
            <p className="eyebrow mb-3">People often look for</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} type="button" onClick={() => setQ(s)} className="h-9 rounded-full border border-line px-3.5 text-sm hover:border-ink">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
