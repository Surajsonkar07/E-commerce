import { MotionRoot } from "@/components/motion-root";
import type { Metadata } from "next";
import { CartView } from "./cart-view";

export const metadata: Metadata = { title: "Your bag", robots: { index: false } };

export default function CartPage() {
  return (
    <MotionRoot>
    <div className="container-x pt-8 lg:pt-12">
      <p className="eyebrow">Step 1 of 3 · Bag</p>
      <h1 className="mt-2 text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-bold">Your bag</h1>
      <CartView />
    </div>
    </MotionRoot>
  );
}
