import { MotionRoot } from "@/components/motion-root";
import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { site } from "@/lib/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Help & contact",
  description: `Call ${site.phone}, email ${site.email} or send us a message. Sarani's help desk is open 24 hours a day, 7 days a week.`,
  alternates: { canonical: "/contact" },
};

const faqs = [
  ["Where is my order?", "Sign in and open Account → Order history. Each order has a live tracking timeline."],
  ["Can I pay in cash?", "Yes. Choose Cash on delivery at checkout and pay the courier when your order arrives."],
  ["How do returns work?", "Within 30 days, write to us with your order number. We send a prepaid label and refund you as soon as the parcel is scanned."],
  ["Do you deliver outside Bangladesh?", "We deliver to the countries listed at checkout. Delivery times are longer outside Dhaka; we'll email you an estimate."],
];

export default function ContactPage() {
  return (
    <MotionRoot>
    <div className="container-x pt-6 lg:pt-10">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Help & contact" }]} />
      <div className="mt-6 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow">Help desk</p>
          <h1 className="mt-3 text-[clamp(2.5rem,6vw,4.25rem)] leading-[0.92] font-bold tracking-[-0.04em]">Talk to a person.</h1>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-soft">We&apos;re available 24/7, 7 days a week. Most messages get a reply within the hour.</p>

          <ul className="mt-8 divide-y divide-line border-y border-line">
            {[
              { icon: Phone, label: "Call us", value: site.phone, href: `tel:${site.phone.replace(/[^+\d]/g, "")}` },
              { icon: Mail, label: "Write to us", value: site.email, href: `mailto:${site.email}` },
              { icon: MapPin, label: "Visit", value: site.address },
              { icon: Clock, label: "Hours", value: "Every day, around the clock" },
            ].map((c) => (
              <li key={c.label} className="flex items-center gap-4 py-4">
                <c.icon className="size-5 text-primary" strokeWidth={1.75} />
                <div>
                  <p className="eyebrow">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} className="text-[17px] hover:text-primary hover:underline">
                      {c.value}
                    </a>
                  ) : (
                    <p className="text-[17px]">{c.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-2xl font-semibold">Quick answers</h2>
          <Accordion type="single" collapsible className="mt-2">
            {faqs.map(([q, a]) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger>{q}</AccordionTrigger>
                <AccordionContent>{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="lg:col-span-7">
          <div className="rounded-xl bg-surface p-6 shadow-card sm:p-10">
            <h2 className="text-3xl font-semibold">Send a message</h2>
            <p className="mt-2 mb-8 text-ink-soft">Include your order number if it&apos;s about an order.</p>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
    </MotionRoot>
  );
}
