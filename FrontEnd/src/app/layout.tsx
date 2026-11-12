import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { Providers } from "@/components/providers";
import { MobileTabBar, SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { site } from "@/lib/site";
import { categories, products } from "@/lib/catalog";
import "./globals.css";

// Fonts are self-hosted from npm packages (no build-time call to Google Fonts).
const display = localFont({
  src: "../../node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2",
  variable: "--font-bricolage",
  weight: "200 800",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});
// Mono is only used for prices and labels, so it isn't preloaded (keeps the first paint lean).
const mono = localFont({
  src: "../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  appleWebApp: { capable: true, title: site.name, statusBarStyle: "default" },
  formatDetection: { telephone: false },
  icons: {
    icon: [{ url: "/icons/tag.svg", type: "image/svg+xml" }, { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: { type: "website", siteName: site.name, locale: "en_US", url: "/" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f5ef" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1814" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${GeistSans.variable} ${mono.variable}`}>
      <body className="min-h-dvh overflow-x-clip">
        <Providers>
          <a
            href="#main"
            className="fixed top-2 left-2 z-[60] -translate-y-20 rounded-md bg-ink px-4 py-3 text-sm text-paper transition-transform focus-visible:translate-y-0"
          >
            Skip to content
          </a>
          <SiteHeader categories={categories.map(({ slug, name }) => ({ slug, name }))} productCount={products.length} />
          <main id="main" className="min-h-[60vh]">
            {children}
          </main>
          <SiteFooter />
          <MobileTabBar />
        </Providers>
      </body>
    </html>
  );
}
