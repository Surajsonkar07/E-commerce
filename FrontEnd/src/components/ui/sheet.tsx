"use client";

import * as React from "react";
import { Dialog as D } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = D.Root;
export const SheetTrigger = D.Trigger;
export const SheetClose = D.Close;
export const SheetTitle = D.Title;
export const SheetDescription = D.Description;

const sides = {
  left: "inset-y-0 left-0 h-full w-[88vw] max-w-sm border-r data-[state=open]:animate-[sheet-in-left_260ms_var(--ease-out-soft)] data-[state=closed]:animate-[sheet-out-left_180ms_ease-in]",
  right: "inset-y-0 right-0 h-full w-[92vw] max-w-md border-l data-[state=open]:animate-[sheet-in-right_260ms_var(--ease-out-soft)] data-[state=closed]:animate-[sheet-out-right_180ms_ease-in]",
  bottom: "inset-x-0 bottom-0 max-h-[88dvh] rounded-t-xl border-t data-[state=open]:animate-[sheet-in-bottom_280ms_var(--ease-out-soft)] data-[state=closed]:animate-[sheet-out-bottom_180ms_ease-in]",
};

export function SheetContent({
  side = "right",
  className,
  children,
  ...props
}: React.ComponentProps<typeof D.Content> & { side?: keyof typeof sides }) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-50 bg-[oklch(0.15_0.02_50/0.45)] data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_150ms_ease-in]" />
      <D.Content
        className={cn("fixed z-50 flex flex-col overflow-hidden bg-paper shadow-2xl outline-none", sides[side], className)}
        {...props}
      >
        {children}
        <D.Close className="absolute top-3 right-3 grid size-11 place-items-center rounded-md text-ink-soft transition-colors hover:bg-sunken hover:text-ink">
          <X className="size-5" />
          <span className="sr-only">Close</span>
        </D.Close>
      </D.Content>
    </D.Portal>
  );
}

export function DialogContent({ className, children, ...props }: React.ComponentProps<typeof D.Content>) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-50 bg-[oklch(0.15_0.02_50/0.45)] data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_150ms_ease-in]" />
      <D.Content
        className={cn(
          "fixed top-[8vh] left-1/2 z-50 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-lg border border-line bg-paper shadow-2xl outline-none data-[state=open]:animate-[pop-in_220ms_var(--ease-out-soft)] data-[state=closed]:animate-[fade-out_120ms_ease-in]",
          className,
        )}
        {...props}
      >
        {children}
      </D.Content>
    </D.Portal>
  );
}
export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogTitle = D.Title;
