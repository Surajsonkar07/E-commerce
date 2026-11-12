import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CountUp } from "@/components/count-up";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our story",
  description: "How Sarani started: a small general store on Bijoy Sarani, Dhaka, that stocks one good version of each thing and prices it honestly.",
  alternates: { canonical: "/about" },
};

// Figures carried over from the original site.
const stats = [
  { to: 10.5, d: 1, suffix: "k", label: "Sellers active on the store" },
  { to: 45.5, d: 1, suffix: "k", label: "Customers shopping each month" },
  { to: 25, d: 0, suffix: "k", label: "Annual gross sales, in orders" },
  { to: 33, d: 0, suffix: "k", label: "Products sold every month" },
];

// Placeholder team: replace names and photos with the real team.
const team = [
  { img: "/images/team-1.webp", name: "Arif Rahman", role: "Founder & Chairman" },
  { img: "/images/team-2.webp", name: "Nadia Karim", role: "Managing Director" },
  { img: "/images/team-3.webp", name: "Daniel Hayes", role: "Product designer" },
];

const timeline = [
  ["2019", "A stall on Bijoy Sarani selling refurbished gamepads and keyboards."],
  ["2021", "Moved online. Added home goods after customers kept asking where our shop chair came from."],
  ["2023", "Free standard delivery on every order, and a 30-day no-forms return policy."],
  ["2026", "Sixteen carefully chosen products across nine departments, and a store that works offline."],
];

export default function AboutPage() {
  return (
    <div className="container-x pt-6 lg:pt-10">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Our story" }]} />

      <section className="mt-6 grid items-center gap-10 lg:grid-cols-12 lg:gap-16" aria-labelledby="story-title">
        <div className="lg:col-span-6">
          <p className="eyebrow">Our story</p>
          <h1 id="story-title" className="mt-3 text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.92] font-bold tracking-[-0.04em]">
            A general store,
            <br /> named after its street.
          </h1>
          <div className="mt-8 flex max-w-xl flex-col gap-4 text-[17px] leading-relaxed text-ink-soft">
            <p>
              Sarani started as a stall on Bijoy Sarani in Dhaka. We sold second-hand gamepads, then new ones, then the chairs people sat on to use them. Customers trusted us because we only kept one or two versions of anything, and we could tell them exactly why.
            </p>
            <p>
              We still work that way. Every product here is something we&apos;d buy ourselves, at a price we&apos;d be happy to pay. Delivery is free, returns are easy, and if you&apos;d rather pay the courier in cash, that&apos;s fine too.
            </p>
          </div>
          <Button asChild size="lg" className="mt-8">
            <Link href="/shop">
              See what we stock <ArrowRight />
            </Link>
          </Button>
        </div>
        <Reveal className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-xl bg-[#e65f9c]">
            <Image src="/images/about.webp" alt="Two friends laughing over a phone, holding striped and floral shopping bags" width={705} height={609} sizes="(min-width: 1024px) 45vw, 100vw" priority className="h-auto w-full" />
          </div>
        </Reveal>
      </section>

      <section className="mt-20 border-y border-ink" aria-label="Sarani in numbers">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`px-4 py-8 sm:px-6 ${i % 2 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}>
              <dd className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-none font-bold tabular-nums">
                <CountUp to={s.to} decimals={s.d} suffix={s.suffix} />
              </dd>
              <dt className="mt-2 text-sm text-ink-soft">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-24 grid gap-10 lg:grid-cols-12" aria-labelledby="timeline-title">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow="How we got here" id="timeline-title" title="Seven years, one street" className="mb-0" />
        </div>
        <ol className="lg:col-span-8">
          {timeline.map(([year, text]) => (
            <li key={year} className="grid grid-cols-[5rem_1fr] gap-6 border-b border-line py-6 first:border-t sm:grid-cols-[8rem_1fr]">
              <span className="font-mono text-2xl text-primary">{year}</span>
              <p className="text-[17px] leading-relaxed">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-24" aria-labelledby="team-title">
        <SectionHeading eyebrow="The people" id="team-title" title="Who packs your order" />
        <Stagger className="grid gap-6 sm:grid-cols-3">
          {team.map((t) => (
            <StaggerItem key={t.name}>
              <figure>
                <div className="relative aspect-[37/43] overflow-hidden rounded-lg bg-plinth">
                  <Image src={t.img} alt={`Portrait of ${t.name}`} fill sizes="(min-width: 640px) 30vw, 100vw" className="cutout object-cover" />
                </div>
                <figcaption className="mt-3">
                  <p className="text-lg font-medium">{t.name}</p>
                  <p className="text-sm text-ink-soft">{t.role}</p>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section id="promise" className="mt-24 rounded-xl bg-surface p-6 shadow-card sm:p-10" aria-labelledby="promise-title">
        <h2 id="promise-title" className="text-3xl font-semibold">
          Delivery & returns
        </h2>
        <div className="mt-6 grid gap-8 text-[15px] leading-relaxed text-ink-soft md:grid-cols-3">
          <div>
            <h3 className="mb-1 font-sans text-base font-medium tracking-normal text-ink">Free and fast delivery</h3>
            Standard delivery is free on every order and takes 2–4 working days. Express costs ${site.expressFee} and arrives the next working day.
          </div>
          <div>
            <h3 className="mb-1 font-sans text-base font-medium tracking-normal text-ink">Money-back guarantee</h3>
            Return anything within 30 days, in its original condition, for a full refund. We send a prepaid label.
          </div>
          <div>
            <h3 className="mb-1 font-sans text-base font-medium tracking-normal text-ink">Customer service, 24/7</h3>
            Call {site.phone} or write to {site.email}. A real person answers.
          </div>
        </div>
      </section>
    </div>
  );
}
