"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, LayoutGrid, Menu, ShoppingBag, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/logo";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { categories } from "@/lib/catalog";
import { useLoadSession, useSession } from "@/lib/session";
import { cartCount, useHydrated, useShop } from "@/lib/store";
import { cn } from "@/lib/utils";
import { SearchDialog } from "./search-dialog";
import { ThemeSegment, ThemeToggle } from "./theme-toggle";

const nav = [
  { href: "/shop", label: "Shop all" },
  { href: "/shop?sale=1&sort=discount", label: "Deals" },
  { href: "/shop?sort=newest", label: "New in" },
  { href: "/about", label: "Our story" },
  { href: "/contact", label: "Help" },
];

function Count({ n, label }: { n: number; label: string }) {
  return (
    <AnimatePresence initial={false}>
      {n > 0 ? (
        <motion.span
          key={n}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: "spring", stiffness: 520, damping: 22 }}
          className="absolute top-1 right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 font-mono text-[11px] leading-none font-semibold text-primary-ink"
        >
          {n}
          <span className="sr-only"> {label}</span>
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}

function useCounts() {
  const hydrated = useHydrated();
  const bag = useShop(cartCount);
  const wish = useShop((s) => s.wishlist.length);
  return { bag: hydrated ? bag : 0, wish: hydrated ? wish : 0 };
}

export function SiteHeader() {
  useLoadSession();
  const user = useSession((s) => s.user);
  const { bag, wish } = useCounts();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/92 backdrop-blur-md supports-[backdrop-filter]:bg-paper/80">
      <div className="container-x flex h-16 items-center gap-3 lg:h-[72px] lg:gap-8">
        <Sheet>
          <SheetTrigger className="-ml-2 grid size-11 place-items-center rounded-md hover:bg-sunken lg:hidden" aria-label="Open menu">
            <Menu className="size-[21px]" />
          </SheetTrigger>
          <SheetContent side="left" aria-describedby="menu-desc">
            <div className="flex h-16 items-center border-b border-line px-5">
              <SheetTitle asChild>
                <span className="font-display text-xl font-bold tracking-tight">Browse</span>
              </SheetTitle>
              <SheetDescription id="menu-desc" className="sr-only">
                Site navigation and categories
              </SheetDescription>
            </div>
            <nav className="flex-1 overflow-y-auto px-5 py-4" aria-label="Mobile">
              <ul className="flex flex-col">
                {nav.map((n) => (
                  <li key={n.href}>
                    <SheetClose asChild>
                      <Link href={n.href} className="flex min-h-12 items-center font-display text-2xl font-semibold tracking-tight hover:text-primary">
                        {n.label}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
              <p className="eyebrow mt-8 mb-2">Departments</p>
              <ul className="grid grid-cols-2 gap-x-4">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <SheetClose asChild>
                      <Link href={`/c/${c.slug}`} className="flex min-h-11 items-center text-[15px] text-ink-soft hover:text-ink">
                        {c.name}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t border-line p-5">
              <ThemeSegment />
            </div>
          </SheetContent>
        </Sheet>

        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => {
              const active = n.href === pathname;
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-11 items-center rounded-md px-3 text-[15px] text-ink-soft transition-colors hover:text-ink",
                      active && "text-ink after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:rounded-full after:bg-primary",
                    )}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          <SearchDialog className="hidden w-64 md:flex xl:w-80" />
          <SearchDialog compact className="md:hidden" />
          <ThemeToggle className="hidden sm:grid" />
          <Link
            href={user ? "/account" : "/login"}
            className="hidden h-11 items-center gap-2 rounded-md px-2.5 text-sm hover:bg-sunken sm:inline-flex"
            aria-label={user ? `Your account (${user.name})` : "Sign in"}
          >
            <User className="size-[19px]" />
            <span className="hidden max-w-24 truncate xl:inline">{user ? user.name.split(" ")[0] : "Sign in"}</span>
          </Link>
          <Link href="/wishlist" className="relative hidden size-11 place-items-center rounded-md hover:bg-sunken sm:grid" aria-label="Wishlist">
            <Heart className="size-[19px]" />
            <Count n={wish} label="saved items" />
          </Link>
          <Link href="/cart" className="relative grid size-11 place-items-center rounded-md hover:bg-sunken" aria-label="Shopping bag">
            <ShoppingBag className="size-[19px]" />
            <Count n={bag} label="items in bag" />
          </Link>
        </div>
      </div>
    </header>
  );
}

/** App-style bottom bar on phones. */
export function MobileTabBar() {
  const pathname = usePathname();
  const { bag, wish } = useCounts();
  const user = useSession((s) => s.user);
  if (pathname.startsWith("/checkout")) return null;
  const tabs = [
    { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
    { href: "/shop", label: "Shop", icon: LayoutGrid, match: (p: string) => p.startsWith("/shop") || p.startsWith("/c/") || p.startsWith("/product") },
    { href: "/wishlist", label: "Saved", icon: Heart, n: wish, match: (p: string) => p === "/wishlist" },
    { href: "/cart", label: "Bag", icon: ShoppingBag, n: bag, match: (p: string) => p === "/cart" },
    { href: user ? "/account" : "/login", label: user ? "Account" : "Sign in", icon: User, match: (p: string) => p.startsWith("/account") || p === "/login" || p === "/signup" },
  ];
  return (
    <nav
      aria-label="Quick"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden"
    >
      <ul className="grid grid-cols-5">
        {tabs.map((t) => {
          const active = t.match(pathname);
          return (
            <li key={t.label}>
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={cn("relative flex h-16 flex-col items-center justify-center gap-1 text-[11px]", active ? "text-ink" : "text-ink-soft")}
              >
                <span className="relative">
                  <t.icon className={cn("size-[21px]", active && "stroke-[2.25]")} />
                  {t.n ? (
                    <span className="absolute -top-1.5 -right-2.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 font-mono text-[10px] font-semibold text-primary-ink">
                      {t.n}
                    </span>
                  ) : null}
                </span>
                {t.label}
                {active ? <motion.span layoutId="tab-dot" className="absolute top-0 h-0.5 w-8 rounded-full bg-primary" /> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
