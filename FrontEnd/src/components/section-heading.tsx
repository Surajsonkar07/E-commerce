import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  action?: { href: string; label: string };
  aside?: React.ReactNode;
  className?: string;
  id?: string;
};

/** Ledger-style section header: catalogue number, eyebrow, title and an optional action. */
export function SectionHeading({ index, eyebrow, title, action, aside, className, id }: Props) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 border-t border-ink pt-4 md:flex-row md:items-end md:justify-between", className)}>
      <div>
        <p className="eyebrow flex gap-3">
          {index ? <span className="text-primary">§{index}</span> : null}
          <span>{eyebrow}</span>
        </p>
        <h2 id={id} className="mt-2 text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.02] font-semibold">
          {title}
        </h2>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {aside}
        {action ? (
          <Link href={action.href} className="group inline-flex h-11 items-center gap-1.5 text-[15px] font-medium underline decoration-line-strong underline-offset-[6px] hover:decoration-primary">
            {action.label}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
