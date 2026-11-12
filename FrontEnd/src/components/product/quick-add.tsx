"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Ruler } from "lucide-react";
import { toast } from "sonner";
import { defaultOptions, priceFor, type Product } from "@/lib/catalog";
import { useShop } from "@/lib/store";

const base =
  "absolute right-2 bottom-2 z-10 inline-flex h-11 items-center gap-1.5 rounded-full bg-ink px-4 text-[13px] font-medium text-paper shadow-lg transition-all duration-200 ease-[var(--ease-out-soft)] hover:bg-primary hover:text-primary-ink md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:translate-y-0 md:focus-visible:opacity-100";

export function QuickAdd({ product: p }: { product: Product }) {
  const add = useShop((s) => s.addToCart);
  const router = useRouter();
  const needsSize = p.options.some((o) => o.name === "Size");

  if (p.stock <= 0) return null;
  if (needsSize) {
    return (
      <Link href={`/product/${p.slug}`} className={base} aria-label={`Choose a size for ${p.name}`}>
        <Ruler className="size-4" /> <span className="max-sm:sr-only">Size</span>
      </Link>
    );
  }
  return (
    <button
      type="button"
      className={base}
      aria-label={`Add ${p.name} to bag`}
      onClick={() => {
        const options = defaultOptions(p);
        add({ productId: p.id, slug: p.slug, name: p.name, image: p.image, imageMode: p.imageMode, unitPrice: priceFor(p, options), options });
        toast.success("Added to your bag", {
          description: `${p.name}${Object.values(options).length ? ` · ${Object.values(options).join(" · ")}` : ""}`,
          action: { label: "Checkout", onClick: () => router.push("/cart") },
        });
      }}
    >
      <Plus className="size-4" /> <span className="max-sm:sr-only">Add</span>
    </button>
  );
}
