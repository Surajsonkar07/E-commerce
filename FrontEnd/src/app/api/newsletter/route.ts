import { NextResponse } from "next/server";
import { write } from "@/lib/db";
import { newsletterSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  const parsed = newsletterSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid email" }, { status: 400 });
  const { email } = parsed.data;
  const already = await write((s) => {
    if (s.subscribers.some((x) => x.email === email)) return true;
    s.subscribers.push({ email, createdAt: new Date().toISOString() });
    return false;
  });
  return NextResponse.json({ ok: true, already });
}
