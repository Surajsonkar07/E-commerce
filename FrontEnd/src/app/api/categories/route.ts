import { NextResponse } from "next/server";
import { categories, categoryCount } from "@/lib/catalog";

export function GET() {
  return NextResponse.json({ categories: categories.map((c) => ({ ...c, count: categoryCount(c.slug) })) });
}
