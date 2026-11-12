"use client";

import { useEffect } from "react";
import { create } from "zustand";

export type SessionUser = { id: string; name: string; email: string; createdAt: string };

type SessionState = {
  user: SessionUser | null;
  status: "idle" | "loading" | "ready";
  refresh: () => Promise<SessionUser | null>;
  set: (u: SessionUser | null) => void;
  signOut: () => Promise<void>;
};

/** Client-side view of the signed-in user. Pages stay static; the header asks /api/auth/me. */
export const useSession = create<SessionState>((set, get) => ({
  user: null,
  status: "idle",
  refresh: async () => {
    set({ status: "loading" });
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const { user } = (await res.json()) as { user: SessionUser | null };
      set({ user, status: "ready" });
      return user;
    } catch {
      set({ status: "ready" });
      return get().user;
    }
  },
  set: (user) => set({ user, status: "ready" }),
  signOut: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    set({ user: null, status: "ready" });
  },
}));

export function useLoadSession() {
  const { status, refresh } = useSession();
  useEffect(() => {
    if (status === "idle") void refresh();
  }, [status, refresh]);
}
