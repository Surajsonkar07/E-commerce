import { NextResponse, type NextRequest } from "next/server";
import { discountPct, parseQuery, queryProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

/** GET /api/products?q=&category=a,b&price=50-150&rating=4&sale=1&stock=1&sort=price-asc&limit=8 */
export function GET(req: NextRequest) {
  const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
  const query = parseQuery(sp);
  const limit = Math.min(Math.max(Number(sp.limit) || 100, 1), 100);
  const list = queryProducts(query);
  return NextResponse.json({
    total: list.length,
    query,
    products: list.slice(0, limit).map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      price: p.price,
      compareAt: p.compareAt,
      discount: discountPct(p),
      rating: p.rating,
      reviews: p.reviews,
      image: p.image,
      imageMode: p.imageMode,
      blurb: p.blurb,
      inStock: p.stock > 0,
    })),
  });
}
