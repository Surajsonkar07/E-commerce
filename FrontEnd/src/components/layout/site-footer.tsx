import Link from "next/link";
import { Logo } from "@/components/logo";
import { categories } from "@/lib/catalog";
import { site } from "@/lib/site";
import { NewsletterForm } from "./newsletter-form";

const cols = [
  {
    title: "Account",
    links: [
      { href: "/account", label: "My account" },
      { href: "/account#orders", label: "Order history" },
      { href: "/login", label: "Sign in / register" },
      { href: "/cart", label: "Bag" },
      { href: "/wishlist", label: "Wishlist" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/contact", label: "Contact us" },
      { href: "/about#promise", label: "Delivery & returns" },
      { href: "/about", label: "Our story" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink pb-24 text-paper sm:pb-0 dark:bg-sunken dark:text-ink">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="[&_span]:text-inherit">
            <Logo />
          </div>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed opacity-75">
            {site.tagline}. Shipped from Dhaka, packed by people who check every order twice.
          </p>
          <p className="mt-8 font-display text-xl font-semibold">The Friday list</p>
          <p className="mt-1 text-sm opacity-70">New arrivals and one honest deal a week. No spam.</p>
          <NewsletterForm tone="ink" className="mt-4" />
        </div>
        <nav aria-label="Departments" className="lg:col-span-3">
          <h2 className="font-mono text-xs tracking-[0.08em] uppercase opacity-60">Departments</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 lg:grid-cols-1">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/c/${c.slug}`} className="inline-flex min-h-10 items-center text-[15px] opacity-85 hover:opacity-100 hover:underline">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {cols.map((col) => (
          <nav key={col.title} aria-label={col.title} className="lg:col-span-2">
            <h2 className="font-mono text-xs tracking-[0.08em] uppercase opacity-60">{col.title}</h2>
            <ul className="mt-4">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-10 items-center text-[15px] opacity-85 hover:opacity-100 hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-current/15">
        <div className="container-x flex flex-col gap-2 py-6 font-mono text-xs opacity-70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {site.address} · <a href={`mailto:${site.email}`} className="hover:underline">{site.email}</a> ·{" "}
            <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="hover:underline">{site.phone}</a>
          </p>
          <p>© {new Date().getFullYear()} Sarani. Demo store: no real payments are taken.</p>
        </div>
      </div>
    </footer>
  );
}
