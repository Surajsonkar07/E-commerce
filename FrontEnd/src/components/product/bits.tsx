import { Star } from "lucide-react";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Price({ price, compareAt, className, size = "md" }: { price: number; compareAt?: number; className?: string; size?: "md" | "lg" }) {
  const onSale = compareAt && compareAt > price;
  return (
    <p className={cn("flex items-baseline gap-2 font-mono tabular-nums", className)}>
      <span className={cn("font-semibold text-ink", size === "lg" ? "text-2xl" : "text-[15px]")}>
        <span className="sr-only">{onSale ? "Sale price " : "Price "}</span>
        {formatMoney(price)}
      </span>
      {onSale ? (
        <s className={cn("text-ink-soft", size === "lg" ? "text-base" : "text-[13px]")}>
          <span className="sr-only">was </span>
          {formatMoney(compareAt)}
        </s>
      ) : null}
    </p>
  );
}

export function Rating({ value, count, className }: { value: number; count?: number; className?: string }) {
  return (
    <p className={cn("flex items-center gap-1.5 text-[13px] text-ink-soft", className)}>
      <span className="relative inline-flex" aria-hidden>
        <span className="flex gap-px text-line-strong">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="size-3.5 fill-current stroke-none" />
          ))}
        </span>
        <span className="absolute inset-0 flex gap-px overflow-hidden text-accent" style={{ width: `${(value / 5) * 100}%` }}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="size-3.5 shrink-0 fill-current stroke-none" />
          ))}
        </span>
      </span>
      <span className="font-mono tabular-nums">
        {value.toFixed(1)}
        {count !== undefined ? <span className="text-ink-soft/80"> ({count})</span> : null}
      </span>
      <span className="sr-only">
        Rated {value} out of 5{count !== undefined ? ` from ${count} reviews` : ""}
      </span>
    </p>
  );
}

/** Swing-tag shaped discount label with a punched hole. */
export function SaleTag({ pct, className }: { pct: number; className?: string }) {
  if (pct <= 0) return null;
  return (
    <span
      className={cn(
        "relative inline-flex h-7 items-center pr-2.5 pl-5 font-mono text-[12px] font-semibold text-accent-ink",
        "bg-accent [clip-path:polygon(10px_0,100%_0,100%_100%,10px_100%,0_50%)]",
        "before:absolute before:top-1/2 before:left-[9px] before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-plinth",
        className,
      )}
    >
      −{pct}%
    </span>
  );
}
