"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import * as m from "motion/react-m";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { contactSchema } from "@/lib/schemas";
import type { z } from "zod";

type Values = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [sent, setSent] = useState<string | null>(null);
  const { register, handleSubmit, formState, reset } = useForm<Values>({ resolver: zodResolver(contactSchema), defaultValues: { name: "", email: "", phone: "", message: "" } });
  const e = formState.errors;

  if (sent) {
    return (
      <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-start gap-3 py-6" role="status">
        <CheckCircle2 className="size-10 text-success" strokeWidth={1.5} />
        <p className="text-2xl font-semibold">Message received</p>
        <p className="text-ink-soft">
          Reference <span className="font-mono text-ink">{sent}</span>. We&apos;ll reply by email, usually within the hour.
        </p>
        <Button variant="outline" className="mt-2" onClick={() => setSent(null)}>
          Send another
        </Button>
      </m.div>
    );
  }

  return (
    <form
      noValidate
      className="grid gap-5 sm:grid-cols-2"
      onSubmit={handleSubmit(async (values) => {
        const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
        const data = await res.json();
        if (!res.ok) return void toast.error(data.error ?? "Could not send your message");
        reset();
        setSent(data.id);
      })}
    >
      <Field label="Name" htmlFor="c-name" error={e.name?.message}>
        <Input id="c-name" autoComplete="name" aria-invalid={!!e.name} {...register("name")} />
      </Field>
      <Field label="Email" htmlFor="c-email" error={e.email?.message}>
        <Input id="c-email" type="email" autoComplete="email" aria-invalid={!!e.email} {...register("email")} />
      </Field>
      <Field label="Phone (optional)" htmlFor="c-phone" className="sm:col-span-2">
        <Input id="c-phone" type="tel" autoComplete="tel" {...register("phone")} />
      </Field>
      <Field label="Your question" htmlFor="c-message" error={e.message?.message} className="sm:col-span-2">
        <Textarea id="c-message" aria-invalid={!!e.message} {...register("message")} />
      </Field>
      <Button type="submit" size="lg" disabled={formState.isSubmitting} className="sm:col-span-2 sm:justify-self-start">
        {formState.isSubmitting ? <Loader2 className="animate-spin" /> : <Send />} Send message
      </Button>
    </form>
  );
}
