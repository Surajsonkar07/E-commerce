import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  mode: "cutout" | "photo";
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  zoom?: number;
  focus?: number[];
};

/** A product shot on its "plinth": cut-outs multiply into a warm tile, photos fill it. */
export function ProductImage({ src, alt, mode, sizes, priority, className, imgClassName, zoom = 1, focus = [50, 50] }: Props) {
  return (
    <div className={cn("relative overflow-hidden", mode === "photo" ? "bg-[#0b0b0c]" : "bg-plinth", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", mode === "cutout" && "cutout", imgClassName)}
        style={zoom !== 1 ? { transform: `scale(${zoom})`, transformOrigin: `${focus[0]}% ${focus[1]}%` } : undefined}
      />
    </div>
  );
}
