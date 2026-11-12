"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useHydrated, useShop } from "@/lib/store";
import { cn } from "@/lib/utils";

export function WishButton({ productId, name, className, withLabel }: { productId: string; name: string; className?: string; withLabel?: boolean }) {
  const hydrated = useHydrated();
  const saved = useShop((s) => s.wishlist.includes(productId)) && hydrated;
  const toggle = useShop((s) => s.toggleWish);
  const router = useRouter();

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      onClick={(e) => {
        e.preventDefault();
        const added = toggle(productId);
        toast(added ? "Saved to your wishlist" : "Removed from your wishlist", {
          description: name,
          action: added ? { label: "View", onClick: () => router.push("/wishlist") } : undefined,
        });
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-colors",
        withLabel
          ? "h-12 rounded-md border border-line-strong px-4 text-sm font-medium hover:border-ink"
          : "size-11 rounded-full bg-paper/90 text-ink shadow-sm backdrop-blur hover:bg-paper",
        className,
      )}
    >
      <motion.span key={String(saved)} initial={{ scale: saved ? 0.6 : 1 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
        <Heart className={cn("size-[18px]", saved ? "fill-primary stroke-primary" : "")} />
      </motion.span>
      {withLabel ? <span>{saved ? "Saved" : "Save"}</span> : null}
    </button>
  );
}
