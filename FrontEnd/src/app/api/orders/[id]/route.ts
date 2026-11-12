import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { read } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in to see this order" }, { status: 401 });
  const { id } = await params;
  const order = await read((s) => s.orders.find((o) => o.id === id && o.userId === user.id));
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({ order }, { headers: { "Cache-Control": "no-store" } });
}
