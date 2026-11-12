import { NextResponse } from "next/server";
import { createSessionToken, hashPassword, sessionCookie, toPublic } from "@/lib/auth";
import { newId, write, type User } from "@/lib/db";
import { signUpSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  const parsed = signUpSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid details" }, { status: 400 });
  const { name, email, password } = parsed.data;
  const passwordHash = await hashPassword(password);

  const user = await write((s) => {
    if (s.users.some((u) => u.email === email)) return null;
    const u: User = { id: newId("U"), name, email, passwordHash, createdAt: new Date().toISOString() };
    s.users.push(u);
    return u;
  });
  if (!user) return NextResponse.json({ error: "An account with that email already exists. Try signing in." }, { status: 409 });

  const res = NextResponse.json({ user: toPublic(user) }, { status: 201 });
  res.cookies.set(sessionCookie(createSessionToken(user.id)));
  return res;
}
