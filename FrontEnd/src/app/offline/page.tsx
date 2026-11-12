import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata: Metadata = { title: "You're offline", robots: { index: false } };
export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <WifiOff className="size-12 text-ink-soft" strokeWidth={1.25} />
      <h1 className="mt-6 text-4xl font-bold">You&apos;re offline</h1>
      <p className="mt-3 max-w-md text-ink-soft">
        This page isn&apos;t saved on your device yet. Your bag and wishlist are safe; reconnect and we&apos;ll pick up where you left off.
      </p>
      <Link href="/" className="mt-8 inline-flex h-11 items-center rounded-md bg-ink px-5 text-sm font-medium text-paper">
        Try the home page
      </Link>
    </div>
  );
}
