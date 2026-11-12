"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
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
