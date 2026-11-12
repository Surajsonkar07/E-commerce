"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "motion/react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
      <Toaster
        position="bottom-center"
        offset={{ bottom: 88 }}
        mobileOffset={{ bottom: 84 }}
        toastOptions={{
          classNames: {
            toast: "!bg-ink !text-paper !border-0 !rounded-md !font-sans !shadow-xl",
            description: "!text-paper/75",
            actionButton: "!bg-accent !text-accent-ink !font-medium",
          },
        }}
      />
    </ThemeProvider>
  );
}
