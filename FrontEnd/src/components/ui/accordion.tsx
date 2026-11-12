"use client";

import * as React from "react";
import { Accordion as A } from "radix-ui";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Accordion = A.Root;

export function AccordionItem({ className, ...props }: React.ComponentProps<typeof A.Item>) {
  return <A.Item className={cn("border-b border-line", className)} {...props} />;
}

export function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof A.Trigger>) {
  return (
    <A.Header className="flex">
      <A.Trigger
        className={cn(
          "group flex min-h-14 flex-1 items-center justify-between gap-4 py-4 text-left font-medium transition-colors hover:text-primary",
          className,
        )}
        {...props}
      >
        {children}
        <Plus className="size-4 shrink-0 text-ink-soft transition-transform duration-200 group-data-[state=open]:rotate-45" />
      </A.Trigger>
    </A.Header>
  );
}

export function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof A.Content>) {
  return (
    <A.Content
      className="overflow-hidden data-[state=closed]:animate-[acc-up_200ms_ease-out] data-[state=open]:animate-[acc-down_220ms_var(--ease-out-soft)]"
      {...props}
    >
      <div className={cn("pb-5 text-[15px] leading-relaxed text-ink-soft", className)}>{children}</div>
    </A.Content>
  );
}
