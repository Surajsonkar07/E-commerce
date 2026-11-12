import Link from "next/link";
import { discountPct, getCategory, type Product } from "@/lib/catalog";
import { pad } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Price, Rating, SaleTag } from "./bits";
import { ProductImage } from "./product-image";
import { WishButton } from "./wish-button";
import { QuickAdd } from "./quick-add";

type Props = { product: Product; index?: number; priority?: boolean; className?: string; sizes?: string };

export function ProductCard({ product: p, index, priority, className, sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw" }: Props) {
  const pct = discountPct(p);
  const cat = getCategory(p.category);
  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative">
        <Link href={`/product/${p.slug}`} className="block overflow-hidden rounded-lg" aria-label={p.name} tabIndex={-1}>
          <ProductImage
            src={p.image}
            alt=""
            mode={p.imageMode}
            sizes={sizes}
            priority={priority}
            className="aspect-[4/5]"
            imgClassName="transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
          />
        </Link>
        <div className="pointer-events-none absolute top-3 left-0 flex flex-col items-start gap-1.5">
          {pct > 0 ? <SaleTag pct={pct} /> : null}
          {p.collections.includes("new") ? (
            <span className="ml-3 rounded-sm bg-ink px-1.5 py-0.5 font-mono text-[11px] tracking-wide text-paper uppercase">New</span>
          ) : null}
        </div>
        <WishButton productId={p.id} name={p.name} className="absolute top-2 right-2 z-10" />
        {p.stock > 0 && p.stock <= 6 ? (
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-sm bg-paper/90 px-1.5 py-0.5 font-mono text-[11px] text-ink">
            {p.stock} left
          </span>
        ) : null}
        <QuickAdd product={p} />
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-1">
        <p className="flex items-center justify-between gap-2 font-mono text-[11px] tracking-wide text-ink-soft uppercase">
          <span>{cat?.name}</span>
          {index !== undefined ? <span aria-hidden>No.{pad(index + 1)}</span> : null}
        </p>
        <h3 className="font-sans text-[15px] leading-snug font-medium tracking-normal">
          <Link href={`/product/${p.slug}`} className="after:absolute after:inset-0 after:content-[''] hover:text-primary focus-visible:outline-none [&:focus-visible]:after:rounded-lg [&:focus-visible]:after:outline-2 [&:focus-visible]:after:outline-[var(--focus)]">
            {p.name}
          </Link>
        </h3>
        <Rating value={p.rating} count={p.reviews} />
        <Price price={p.price} compareAt={p.compareAt} className="mt-auto pt-1" />
      </div>
    </article>
  );
}
