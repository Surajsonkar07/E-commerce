const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
export const formatMoney = (n: number) => money.format(n);

const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
export const formatDate = (d: string | number | Date) => date.format(new Date(d));

/** YYYY-MM-DD, n days from now. */
export const isoDateFromNow = (days: number) => new Date(Date.now() + days * 864e5).toISOString().slice(0, 10);

export const pad = (n: number, width = 3) => String(n).padStart(width, "0");
