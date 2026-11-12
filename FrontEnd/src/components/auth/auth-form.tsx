"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { useSession, type SessionUser } from "@/lib/session";
import { signInSchema, signUpSchema } from "@/lib/schemas";

type Mode = "login" | "signup";
type Values = { name?: string; email: string; password: string };

export function AuthForm({ mode, onSuccess, switchHref, onSwitch, idPrefix = "auth" }: { mode: Mode; onSuccess: (u: SessionUser) => void; switchHref?: string; onSwitch?: () => void; idPrefix?: string }) {
  const setUser = useSession((s) => s.set);
  const [show, setShow] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(mode === "signup" ? signUpSchema : signInSchema) as never,
    defaultValues: { name: "", email: "", password: "" },
  });
  const { register, handleSubmit, formState } = form;
  const e = formState.errors;
  const id = (f: string) => `${idPrefix}-${f}`;

  const submit = handleSubmit(async (values) => {
    setServerError(null);
    const res = await fetch(`/api/auth/${mode === "signup" ? "signup" : "login"}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) {
      setServerError(data.error ?? "Something went wrong");
      return;
    }
    setUser(data.user);
    toast.success(mode === "signup" ? `Welcome to Sarani, ${data.user.name.split(" ")[0]}` : `Welcome back, ${data.user.name.split(" ")[0]}`);
    onSuccess(data.user);
  });

  const SwitchLink = mode === "login" ? "Create an account" : "Sign in instead";

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      {serverError ? (
        <p role="alert" className="rounded-md border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
          {serverError}
        </p>
      ) : null}
      {mode === "signup" ? (
        <Field label="Full name" htmlFor={id("name")} error={e.name?.message}>
          <Input id={id("name")} autoComplete="name" aria-invalid={!!e.name} aria-describedby={e.name ? `${id("name")}-error` : undefined} {...register("name")} />
        </Field>
      ) : null}
      <Field label="Email" htmlFor={id("email")} error={e.email?.message}>
        <Input id={id("email")} type="email" autoComplete="email" inputMode="email" aria-invalid={!!e.email} aria-describedby={e.email ? `${id("email")}-error` : undefined} {...register("email")} />
      </Field>
      <Field label="Password" htmlFor={id("password")} error={e.password?.message} hint={mode === "signup" ? "At least 8 characters." : undefined}>
        <div className="relative">
          <Input
            id={id("password")}
            type={show ? "text" : "password"}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            aria-invalid={!!e.password}
            aria-describedby={e.password ? `${id("password")}-error` : undefined}
            className="pr-12"
            {...register("password")}
          />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute top-0 right-0 grid size-11 place-items-center text-ink-soft hover:text-ink" aria-label={show ? "Hide password" : "Show password"}>
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </Field>
      <Button type="submit" size="lg" disabled={formState.isSubmitting} className="mt-2 w-full">
        {formState.isSubmitting ? <Loader2 className="animate-spin" /> : null}
        {mode === "signup" ? "Create account" : "Sign in"}
      </Button>
      <p className="text-center text-sm text-ink-soft">
        {mode === "login" ? "New to Sarani? " : "Already have an account? "}
        {onSwitch ? (
          <button type="button" onClick={onSwitch} className="font-medium text-ink underline underline-offset-4">
            {SwitchLink}
          </button>
        ) : (
          <Link href={switchHref ?? (mode === "login" ? "/signup" : "/login")} className="font-medium text-ink underline underline-offset-4">
            {SwitchLink}
          </Link>
        )}
      </p>
    </form>
  );
}
