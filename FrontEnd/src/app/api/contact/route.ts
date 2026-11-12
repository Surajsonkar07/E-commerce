import { NextResponse } from "next/server";
import { newId, write } from "@/lib/db";
import { contactSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid message" }, { status: 400 });
  const id = newId("M");
  await write((s) => {
    s.messages.push({ id, ...parsed.data, phone: parsed.data.phone || undefined, createdAt: new Date().toISOString() });
  });
  return NextResponse.json({ ok: true, id }, { status: 201 });
}
