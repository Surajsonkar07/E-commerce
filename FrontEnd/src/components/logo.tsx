import Link from "next/link";
import { cn } from "@/lib/utils";

export function TagMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={cn("size-7", className)}>
      <path d="M14 8h52l26 26v52a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V14a6 6 0 0 1 6-6z" fill="var(--primary)" />
      <circle cx="72" cy="28" r="7" fill="var(--paper)" />
      <text
        x="44"
        y="77"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="62"
        fontWeight="700"
        fill="var(--primary-ink)"
      >
        s
      </text>
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2 rounded-md", className)}>
      <TagMark className="transition-transform duration-300 group-hover:-rotate-6" />
      <span className="font-display text-[1.6rem] leading-none font-bold tracking-[-0.045em]">sarani</span>
      <span className="sr-only"> home</span>
    </Link>
  );
}
