import data from "../../data/products.json";

export type OptionValue = { label: string; delta?: number; swatch?: string };
export type ProductOption = { name: string; values: OptionValue[] };
export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  compareAt: number;
  rating: number;
  reviews: number;
  stock: number;
  createdAt: string;
  collections: string[];
  image: string;
  imageMode: "cutout" | "photo";
  focus: number[];
  blurb: string;
  description: string;
  highlights: string[];
  specs: Record<string, string>;
  options: ProductOption[];
};
export type Category = { slug: string; name: string; blurb: string };

export const categories: Category[] = data.categories;
export const products: Product[] = data.products as unknown as Product[];

export const SORTS = {
  featured: "Featured",
  newest: "Newest",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  rating: "Top rated",
  discount: "Biggest saving",
} as const;
export type SortKey = keyof typeof SORTS;

export const PRICE_BANDS = {
  "0-50": "Under $50",
  "50-150": "$50 – $150",
  "150-500": "$150 – $500",
  "500-": "$500 and up",
} as const;
export type PriceBand = keyof typeof PRICE_BANDS;

export type CatalogQuery = {
  q?: string;
  categories?: string[];
  price?: PriceBand;
  rating?: number;
  sale?: boolean;
  inStock?: boolean;
  sort?: SortKey;
};

export function discountPct(p: Pick<Product, "price" | "compareAt">) {
  if (!p.compareAt || p.compareAt <= p.price) return 0;
  return Math.round((1 - p.price / p.compareAt) * 100);
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}
export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
export function categoryCount(slug: string) {
  return products.filter((p) => p.category === slug).length;
}
export function inCollection(name: string) {
  return products.filter((p) => p.collections.includes(name));
}
export function related(p: Product, n = 4) {
  const same = products.filter((x) => x.category === p.category && x.id !== p.id);
  const others = products
    .filter((x) => x.category !== p.category && x.id !== p.id)
    .sort((a, b) => b.rating - a.rating);
  return [...same, ...others].slice(0, n);
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s]/gu, " ");

function matches(p: Product, q: string) {
  const cat = getCategory(p.category)?.name ?? "";
  const hay = norm([p.name, p.blurb, p.description, cat, p.sku, ...p.highlights].join(" "));
  return norm(q)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => hay.includes(term));
}

export function queryProducts(query: CatalogQuery) {
  let list = products.slice();
  if (query.q?.trim()) list = list.filter((p) => matches(p, query.q!));
  if (query.categories?.length) list = list.filter((p) => query.categories!.includes(p.category));
  if (query.price) {
    const [min, max] = query.price.split("-").map((v) => (v === "" ? Infinity : Number(v)));
    list = list.filter((p) => p.price >= min && p.price < max);
  }
  if (query.rating) list = list.filter((p) => p.rating >= query.rating!);
  if (query.sale) list = list.filter((p) => discountPct(p) > 0);
  if (query.inStock) list = list.filter((p) => p.stock > 0);

  const sort = query.sort ?? "featured";
  const by: Record<SortKey, (a: Product, b: Product) => number> = {
    featured: (a, b) => featuredScore(b) - featuredScore(a),
    newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
    discount: (a, b) => discountPct(b) - discountPct(a),
  };
  return list.sort(by[sort]);
}

function featuredScore(p: Product) {
  return (
    (p.collections.includes("featured") ? 3 : 0) +
    (p.collections.includes("bestsellers") ? 2 : 0) +
    (p.collections.includes("deals") ? 1 : 0) +
    p.rating / 5
  );
}

type Params = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const many = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v : v ? v.split(",") : []).filter(Boolean);

/** Parse URL search params into a validated catalogue query. */
export function parseQuery(sp: Params): CatalogQuery {
  const sort = first(sp.sort);
  const price = first(sp.price);
  const rating = Number(first(sp.rating));
  return {
    q: first(sp.q)?.slice(0, 80),
    categories: many(sp.category).filter((c) => getCategory(c)),
    price: price && price in PRICE_BANDS ? (price as PriceBand) : undefined,
    rating: rating >= 1 && rating <= 5 ? rating : undefined,
    sale: first(sp.sale) === "1",
    inStock: first(sp.stock) === "1",
    sort: sort && sort in SORTS ? (sort as SortKey) : undefined,
  };
}

/** Price of a product with the chosen options applied. */
export function priceFor(p: Product, selected: Record<string, string>) {
  let price = p.price;
  for (const opt of p.options) {
    const v = opt.values.find((x) => x.label === selected[opt.name]);
    if (v?.delta) price += v.delta;
  }
  return Math.round(price * 100) / 100;
}

export function defaultOptions(p: Product) {
  return Object.fromEntries(p.options.map((o) => [o.name, (o.values.find((v) => !v.delta) ?? o.values[0]).label]));
}
