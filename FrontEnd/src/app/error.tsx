"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-x py-20 lg:py-28">
      <p className="eyebrow">Something slipped</p>
      <h1 className="mt-4 max-w-2xl text-[clamp(2.5rem,7vw,5rem)] leading-[0.92] font-bold">That didn&apos;t load properly.</h1>
      <p className="mt-6 max-w-lg text-[17px] text-ink-soft">
        It&apos;s on our side, not yours. Your bag is safe. Try again, and if it keeps happening, tell us at the help desk.
        {error.digest ? <span className="mt-2 block font-mono text-xs">Ref {error.digest}</span> : null}
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button size="lg" onClick={reset}>
          <RotateCcw /> Try again
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/contact">Help desk</Link>
        </Button>
      </div>
    </div>
  );
}
