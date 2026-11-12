import Image from "next/image";
import { cn } from "@/lib/utils";

export function LineThumb({ src, mode, className }: { src: string; mode: "cutout" | "photo"; className?: string }) {
  return (
    <span className={cn("relative block shrink-0 overflow-hidden rounded-md", mode === "photo" ? "bg-[#0b0b0c]" : "bg-plinth", className)}>
      <Image src={src} alt="" fill sizes="112px" className={cn("object-cover", mode === "cutout" && "cutout")} />
    </span>
  );
}
