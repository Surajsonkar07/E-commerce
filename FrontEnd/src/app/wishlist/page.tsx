import { MotionRoot } from "@/components/motion-root";
import type { Metadata } from "next";
import { WishlistView } from "./wishlist-view";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false } };

export default function WishlistPage() {
  return (
    <MotionRoot>
    <div className="container-x pt-8 lg:pt-12">
      <p className="eyebrow">Saved on this device</p>
      <h1 className="mt-2 text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-bold">Wishlist</h1>
      <WishlistView />
    </div>
    </MotionRoot>
  );
}
