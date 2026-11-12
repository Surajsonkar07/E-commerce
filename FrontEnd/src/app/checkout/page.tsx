import type { Metadata } from "next";
import { CheckoutFlow } from "./checkout-flow";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="container-x pt-8 lg:pt-12">
      <p className="eyebrow">Step 2 of 3 · Checkout</p>
      <h1 className="mt-2 text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-bold">Checkout</h1>
      <CheckoutFlow />
    </div>
  );
}
