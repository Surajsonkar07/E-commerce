"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartLine = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  imageMode: "cutout" | "photo";
  unitPrice: number;
  options: Record<string, string>;
  qty: number;
};

export const lineKey = (productId: string, options: Record<string, string>) =>
  `${productId}|${Object.keys(options)
    .sort()
    .map((k) => `${k}=${options[k]}`)
    .join("&")}`;

type ShopState = {
  cart: CartLine[];
  wishlist: string[]; // product ids
  promo?: string;
  addToCart: (line: Omit<CartLine, "key" | "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clearCart: () => void;
  toggleWish: (productId: string) => boolean;
  setPromo: (code?: string) => void;
};

export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      promo: undefined,
      addToCart: (line, qty = 1) =>
        set((s) => {
          const key = lineKey(line.productId, line.options);
          const hit = s.cart.find((l) => l.key === key);
          if (hit) {
            return { cart: s.cart.map((l) => (l.key === key ? { ...l, qty: Math.min(10, l.qty + qty) } : l)) };
          }
          return { cart: [...s.cart, { ...line, key, qty: Math.min(10, qty) }] };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          cart: qty <= 0 ? s.cart.filter((l) => l.key !== key) : s.cart.map((l) => (l.key === key ? { ...l, qty: Math.min(10, qty) } : l)),
        })),
      remove: (key) => set((s) => ({ cart: s.cart.filter((l) => l.key !== key) })),
      clearCart: () => set({ cart: [], promo: undefined }),
      toggleWish: (id) => {
        const has = get().wishlist.includes(id);
        set((s) => ({ wishlist: has ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id] }));
        return !has;
      },
      setPromo: (promo) => set({ promo }),
    }),
    { name: "sarani-shop", version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);

const noop = () => () => {};
/** True once the component is running in the browser (persisted state is ready). */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

export const cartCount = (s: ShopState) => s.cart.reduce((n, l) => n + l.qty, 0);
export const cartSubtotal = (s: ShopState) => Math.round(s.cart.reduce((n, l) => n + l.unitPrice * l.qty, 0) * 100) / 100;
