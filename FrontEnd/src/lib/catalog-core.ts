/**
 * Catalogue types and pure helpers. No product data is imported here, so
 * client components can use these without bundling data/products.json.
 */
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
