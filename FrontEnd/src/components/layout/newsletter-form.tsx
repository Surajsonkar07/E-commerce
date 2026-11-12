"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function NewsletterForm({ className, tone = "paper" }: { className?: string; tone?: "paper" | "ink" }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    const res = await fetch("/api/newsletter", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
    const data = await res.json();
    if (!res.ok) {
      setState("idle");
      toast.error(data.error ?? "Could not sign you up");
      return;
    }
    setState("done");
    toast.success(data.already ? "You're already on the list" : "You're on the list", { description: "One email on Fridays. Unsubscribe any time." });
  }

  const ink = tone === "ink";
  return (
    <form onSubmit={submit} className={cn("flex w-full max-w-md gap-2", className)}>
      <label htmlFor={`nl-${tone}`} className="sr-only">
        Email address
      </label>
      <input
        id={`nl-${tone}`}
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        disabled={state === "done"}
        className={cn(
          "h-12 min-w-0 flex-1 rounded-md border px-4 text-[15px] outline-none transition-colors",
          ink
            ? "border-current/25 bg-transparent text-inherit placeholder:text-current/55 focus-visible:border-current"
            : "border-line-strong bg-surface text-ink placeholder:text-ink-soft/70 focus-visible:border-ink",
        )}
      />
      <button
        type="submit"
        disabled={state !== "idle"}
        className={cn(
          "inline-flex h-12 items-center gap-2 rounded-md px-5 text-sm font-medium transition-[filter,transform] active:scale-[0.98] disabled:opacity-80",
          ink ? "bg-accent text-accent-ink hover:brightness-105" : "bg-ink text-paper hover:bg-ink/85",
        )}
      >
        {state === "busy" ? <Loader2 className="size-4 animate-spin" /> : state === "done" ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
        <span>{state === "done" ? "Subscribed" : "Subscribe"}</span>
      </button>
    </form>
  );
}
