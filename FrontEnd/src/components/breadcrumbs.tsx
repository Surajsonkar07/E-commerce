import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 font-mono text-xs text-ink-soft">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-1">
            {it.href ? (
              <Link href={it.href} className="inline-flex min-h-8 items-center hover:text-ink hover:underline">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {it.label}
              </span>
            )}
            {i < items.length - 1 ? <ChevronRight className="size-3" aria-hidden /> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
