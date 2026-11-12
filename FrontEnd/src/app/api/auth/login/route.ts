import { NextResponse } from "next/server";
import { createSessionToken, sessionCookie, toPublic, verifyPassword } from "@/lib/auth";
import { read } from "@/lib/db";
import { signInSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  const parsed = signInSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid details" }, { status: 400 });
  const { email, password } = parsed.data;

  const user = await read((s) => s.users.find((u) => u.email === email));
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "That email and password don't match an account." }, { status: 401 });
  }
  const res = NextResponse.json({ user: toPublic(user) });
  res.cookies.set(sessionCookie(createSessionToken(user.id)));
  return res;
}
