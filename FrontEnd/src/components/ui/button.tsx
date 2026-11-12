import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium select-none transition-[background-color,color,border-color,transform,box-shadow] duration-200 ease-[var(--ease-out-soft)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-ink hover:brightness-110 shadow-[inset_0_-2px_0_oklch(0_0_0/0.15)]",
        ink: "bg-ink text-paper hover:bg-ink/85",
        outline: "border border-line-strong bg-surface text-ink hover:border-ink hover:bg-sunken",
        ghost: "text-ink hover:bg-sunken",
        accent: "bg-accent text-accent-ink hover:brightness-105",
        link: "text-ink underline decoration-line-strong underline-offset-4 hover:decoration-primary px-0 h-auto",
      },
      size: {
        sm: "h-9 rounded-md px-3 text-sm",
        md: "h-11 rounded-md px-5 text-sm",
        lg: "h-12 rounded-md px-6 text-base",
        icon: "size-11 rounded-md",
        "icon-sm": "size-9 rounded-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
