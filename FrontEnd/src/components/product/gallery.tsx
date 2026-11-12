"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { cn } from "@/lib/utils";

type View = { label: string; zoom: number; focus: number[] };

export function Gallery({ src, alt, mode, focus }: { src: string; alt: string; mode: "cutout" | "photo"; focus: number[] }) {
  const views: View[] = [
    { label: "Front", zoom: 1, focus: [50, 50] },
    { label: "Detail", zoom: 1.8, focus },
    { label: "Close-up", zoom: 2.6, focus: [Math.min(90, focus[0] + 8), Math.max(10, focus[1] - 6)] },
  ];
  const [active, setActive] = useState(0);
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const plinth = mode === "photo" ? "bg-[#0b0b0c]" : "bg-plinth";

  const img = (v: View, sizes: string, priority = false, extra?: React.CSSProperties) => (
    <Image
      src={src}
      alt={v.zoom === 1 ? alt : `${alt}, ${v.label.toLowerCase()} view`}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover transition-transform duration-300 ease-out", mode === "cutout" && "cutout")}
      style={{ transform: `scale(${v.zoom})`, transformOrigin: `${v.focus[0]}% ${v.focus[1]}%`, ...extra }}
    />
  );

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse">
      {/* Mobile: swipe between views */}
      <div className="relative lg:hidden">
        <div
          ref={scroller}
          className="flex snap-x snap-mandatory overflow-x-auto rounded-xl [scrollbar-width:none]"
          onScroll={(e) => {
            const el = e.currentTarget;
            setActive(Math.round(el.scrollLeft / el.clientWidth));
          }}
          aria-label="Product images"
          role="region"
        >
          {views.map((v, i) => (
            <div key={v.label} className={cn("relative aspect-square w-full shrink-0 snap-center overflow-hidden", plinth)}>
              {img(v, "100vw", i === 0)}
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {views.map((v, i) => (
            <button
              key={v.label}
              type="button"
              aria-label={`Show ${v.label.toLowerCase()} view`}
              aria-current={i === active}
              onClick={() => scroller.current?.scrollTo({ left: i * scroller.current.clientWidth, behavior: "smooth" })}
              className="grid h-6 w-8 place-items-center"
            >
              <span className={cn("block h-1.5 rounded-full transition-all", i === active ? "w-6 bg-ink" : "w-1.5 bg-ink/30")} />
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: large stage with a hover magnifier */}
      <div
        className={cn("relative hidden aspect-square flex-1 cursor-zoom-in overflow-hidden rounded-xl lg:block", plinth)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setLens({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseLeave={() => setLens(null)}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <m.div key={active} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {img(
              views[active],
              "(min-width: 1280px) 40vw, 50vw",
              active === 0,
              lens ? { transform: `scale(${Math.max(2, views[active].zoom * 1.2)})`, transformOrigin: `${lens.x}% ${lens.y}%` } : undefined,
            )}
          </m.div>
        </AnimatePresence>
        <p className="pointer-events-none absolute bottom-3 left-3 rounded-sm bg-paper/90 px-2 py-1 font-mono text-[11px] text-ink">{views[active].label}</p>
      </div>
      <div className="hidden gap-3 lg:flex lg:flex-col" role="tablist" aria-label="Product views">
        {views.map((v, i) => (
          <button
            key={v.label}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`${v.label} view`}
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            className={cn(
              "relative size-20 overflow-hidden rounded-md ring-offset-2 ring-offset-paper transition-shadow xl:size-24",
              plinth,
              i === active ? "ring-2 ring-ink" : "opacity-80 hover:opacity-100",
            )}
          >
            {img(v, "96px")}
          </button>
        ))}
      </div>
    </div>
  );
}
