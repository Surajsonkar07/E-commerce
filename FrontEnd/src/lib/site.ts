export const site = {
  name: "Sarani",
  tagline: "A general store for good, fairly priced things",
  description:
    "Sarani is an online general store: gaming gear, computing, phones, home goods, fashion and more, with free standard delivery and 30-day returns.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  // Contact details carried over from the original site; replace with real ones.
  address: "111 Bijoy Sarani, Dhaka 1515",
  email: "exclusive@gmail.com",
  phone: "+88015-88888-9999",
  // Standard delivery is always free (as on the original site); express is paid.
  expressFee: 12,
};

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
