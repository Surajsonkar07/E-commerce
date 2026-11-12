"use client";

import { Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthForm } from "./auth-form";

function Inner({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("next") ?? "/account";
  const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/account";
  const qs = params.get("next") ? `?next=${encodeURIComponent(next)}` : "";
  return (
    <AuthForm
      mode={mode}
      switchHref={`${mode === "login" ? "/signup" : "/login"}${qs}`}
      onSuccess={() => {
        router.replace(next);
        router.refresh();
      }}
    />
  );
}

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  return (
    <div className="container-x grid gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-16">
      <div className="relative hidden overflow-hidden rounded-xl bg-[#cfe5ea] lg:block">
        <Image src="/images/sign-in.webp" alt="A shopping trolley beside a large phone and two pink shopping bags" fill sizes="45vw" className="object-cover object-bottom" />
        <p className="absolute top-8 left-8 max-w-xs font-display text-3xl leading-tight font-semibold text-[oklch(0.22_0.02_50)]">
          Your bag, wishlist and orders, kept in one place.
        </p>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-col justify-center">
        <p className="eyebrow">{mode === "login" ? "Welcome back" : "New here"}</p>
        <h1 className="mt-2 text-[clamp(2.25rem,5vw,3.25rem)] leading-none font-bold">{mode === "login" ? "Sign in" : "Create your account"}</h1>
        <p className="mt-3 mb-8 text-ink-soft">
          {mode === "login" ? "Sign in to check out faster and see your order history." : "It takes ten seconds. We'll remember your orders and delivery details."}
        </p>
        <Suspense fallback={<div className="skeleton h-80" />}>
          <Inner mode={mode} />
        </Suspense>
        <p className="mt-8 rounded-md bg-sunken px-4 py-3 text-xs leading-relaxed text-ink-soft">
          Accounts are stored locally by this demo store (passwords are hashed with scrypt). No email is ever sent.
        </p>
      </div>
    </div>
  );
}
