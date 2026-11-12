import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Catalogue } from "@/components/catalogue/catalogue";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { categories, categoryCount, getCategory, parseQuery } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getCategory((await params).slug);
  if (!cat) return {};
  return {
    title: `${cat.name}`,
    description: `${cat.blurb} Shop ${categoryCount(cat.slug)} ${cat.name.toLowerCase()} products at Sarani with free standard delivery.`,
    alternates: { canonical: `/c/${cat.slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();
  const query = parseQuery(await searchParams);

  return (
    <div className="container-x pt-6 pb-8 lg:pt-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
            { "@type": "ListItem", position: 3, name: cat.name, item: absoluteUrl(`/c/${cat.slug}`) },
          ],
        }}
      />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/shop", label: "Shop" }, { label: cat.name }]} />
      <header className="mt-4 mb-8 border-b border-line pb-8">
        <p className="eyebrow">Department · {categoryCount(cat.slug)} products</p>
        <h1 className="mt-2 text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.95] font-bold">{cat.name}</h1>
        <p className="mt-3 max-w-xl text-[17px] text-ink-soft">{cat.blurb}</p>
        <nav aria-label="Other departments" className="-mx-4 mt-6 overflow-x-auto px-4 [scrollbar-width:none]">
          <ul className="flex w-max gap-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/c/${c.slug}`}
                  aria-current={c.slug === slug ? "page" : undefined}
                  className={cn(
                    "inline-flex h-10 items-center rounded-full border px-4 text-sm transition-colors",
                    c.slug === slug ? "border-ink bg-ink text-paper" : "border-line-strong hover:border-ink",
                  )}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <Catalogue query={query} fixedCategory={cat.slug} />
    </div>
  );
}
