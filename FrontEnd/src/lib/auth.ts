import "server-only";
import { createHmac, randomBytes, scrypt as _scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { read, type User } from "./db";
import { site } from "./site";

const scrypt = promisify(_scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export const SESSION_COOKIE = "sarani_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret() {
  const s = process.env.AUTH_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === "production") {
    console.warn("[auth] AUTH_SECRET is not set; falling back to the built-in development secret.");
  }
  return "sarani-local-development-secret";
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [, saltB64, hashB64] = stored.split("$");
  if (!saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = await scrypt(password, Buffer.from(saltB64, "base64"), expected.length);
  return timingSafeEqual(actual, expected);
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

export function createSessionToken(userId: string) {
  const payload = `${userId}.${Math.floor(Date.now() / 1000) + MAX_AGE}`;
  return `${payload}.${sign(payload)}`;
}

function readToken(token: string | undefined) {
  if (!token) return null;
  const i = token.lastIndexOf(".");
  if (i < 0) return null;
  const payload = token.slice(0, i);
  const sig = Buffer.from(token.slice(i + 1));
  const good = Buffer.from(sign(payload));
  if (sig.length !== good.length || !timingSafeEqual(sig, good)) return null;
  const [userId, exp] = payload.split(".");
  if (!userId || Number(exp) < Date.now() / 1000) return null;
  return userId;
}

export const sessionCookie = (token: string) => ({
  name: SESSION_COOKIE,
  value: token,
  httpOnly: true,
  sameSite: "lax" as const,
  // Secure whenever the public URL is https (browsers also accept Secure cookies on http://localhost).
  secure: site.url.startsWith("https://"),
  path: "/",
  maxAge: MAX_AGE,
});

export type PublicUser = Pick<User, "id" | "name" | "email" | "createdAt">;
export const toPublic = (u: User): PublicUser => ({ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt });

/** The signed-in user, or null. Safe to call from server components and route handlers. */
export async function currentUser(): Promise<PublicUser | null> {
  const jar = await cookies();
  const id = readToken(jar.get(SESSION_COOKIE)?.value);
  if (!id) return null;
  const user = await read((s) => s.users.find((u) => u.id === id));
  return user ? toPublic(user) : null;
}
