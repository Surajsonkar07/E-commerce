"use client";

import { useEffect, useState } from "react";
import { pad } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Counts down to the coming Sunday 23:59:59 local time (when the weekly markdowns rotate). */
function endOfWeek() {
  const d = new Date();
  const daysToSunday = (7 - d.getDay()) % 7;
  d.setDate(d.getDate() + daysToSunday);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

export function Countdown({ className }: { className?: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, endOfWeek() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const parts =
    left === null
      ? ["--", "--", "--", "--"]
      : [Math.floor(left / 864e5), Math.floor(left / 36e5) % 24, Math.floor(left / 6e4) % 60, Math.floor(left / 1e3) % 60].map((n) => pad(n, 2));
  const labels = ["days", "hrs", "min", "sec"];

  return (
    <div className={cn("flex items-center gap-1 font-mono tabular-nums", className)} role="timer" aria-label="Time left on this week's markdowns">
      {parts.map((p, i) => (
        <span key={labels[i]} className="flex items-baseline gap-1">
          <span className="rounded-sm bg-ink px-1.5 py-1 text-[15px] font-semibold text-paper">{p}</span>
          <span className="mr-1.5 text-[11px] text-ink-soft">{labels[i]}</span>
        </span>
      ))}
    </div>
  );
}
