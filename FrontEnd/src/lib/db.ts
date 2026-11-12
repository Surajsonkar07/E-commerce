import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * A tiny JSON-file database for users, orders, messages and newsletter
 * sign-ups. The catalogue itself lives in data/products.json.
 * Writes are serialised through a promise queue and saved atomically.
 */
export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type OrderLine = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  options: Record<string, string>;
  unitPrice: number;
  qty: number;
};

export type Address = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
};

export type Order = {
  id: string;
  userId: string;
  email: string;
  createdAt: string;
  lines: OrderLine[];
  address: Address;
  delivery: "standard" | "express";
  payment: "cod" | "demo";
  paymentStatus: "paid" | "due-on-delivery";
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  note?: string;
};

export type Message = { id: string; name: string; email: string; phone?: string; message: string; createdAt: string };

type Store = {
  users: User[];
  orders: Order[];
  messages: Message[];
  subscribers: { email: string; createdAt: string }[];
};

const FILE = path.join(process.cwd(), "data", "store.json");
const EMPTY: Store = { users: [], orders: [], messages: [], subscribers: [] };

let queue: Promise<unknown> = Promise.resolve();

async function load(): Promise<Store> {
  try {
    const raw = await readFile(FILE, "utf8");
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<Store>) };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return structuredClone(EMPTY);
    throw err;
  }
}

async function save(store: Store) {
  await mkdir(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(store, null, 2), "utf8");
  await rename(tmp, FILE);
}

export async function read<T>(fn: (s: Store) => T): Promise<T> {
  await queue;
  return fn(await load());
}

export function write<T>(fn: (s: Store) => T): Promise<T> {
  const run = queue.then(async () => {
    const store = await load();
    const result = fn(store);
    await save(store);
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

export const newId = (prefix: string) =>
  `${prefix}${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
