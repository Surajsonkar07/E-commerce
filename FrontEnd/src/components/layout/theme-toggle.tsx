"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useHydrated } from "@/lib/store";
import { cn } from "@/lib/utils";

const order = ["light", "dark", "system"] as const;
const icons = { light: Sun, dark: Moon, system: Monitor };
const labels = { light: "Light theme", dark: "Dark theme", system: "System theme" };

/** Cycles light → dark → system. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const hydrated = useHydrated();
  const current = (hydrated && (theme as (typeof order)[number])) || "system";
  const Icon = icons[current] ?? Monitor;
  const next = order[(order.indexOf(current) + 1) % order.length];
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className={cn("grid size-11 place-items-center rounded-md text-ink transition-colors hover:bg-sunken", className)}
      aria-label={`${labels[current]} (switch to ${labels[next].toLowerCase()})`}
      title={labels[current]}
    >
      <Icon className="size-[19px]" />
    </button>
  );
}

export function ThemeSegment() {
  const { theme, setTheme } = useTheme();
  const hydrated = useHydrated();
  return (
    <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-1 rounded-md bg-sunken p-1">
      {order.map((t) => {
        const Icon = icons[t];
        const active = hydrated && theme === t;
        return (
          <button
            key={t}
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(t)}
            className={cn(
              "flex h-10 items-center justify-center gap-1.5 rounded-[6px] text-sm capitalize transition-colors",
              active ? "bg-surface text-ink shadow-sm" : "text-ink-soft hover:text-ink",
            )}
          >
            <Icon className="size-4" /> {t}
          </button>
        );
      })}
    </div>
  );
}
