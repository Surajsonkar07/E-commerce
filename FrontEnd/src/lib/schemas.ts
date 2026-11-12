import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(60),
  email: z.email("Enter a valid email").trim().toLowerCase(),
  password: z.string().min(8, "Use at least 8 characters").max(100),
});

export const signInSchema = z.object({
  email: z.email("Enter a valid email").trim().toLowerCase(),
  password: z.string().min(1, "Enter your password"),
});

export const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Who is this going to?").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{6,18}$/, "Enter a phone number we can call"),
  line1: z.string().trim().min(3, "Street and house number").max(120),
  line2: z.string().trim().max(120).optional().or(z.literal("")),
  city: z.string().trim().min(2, "City").max(60),
  postcode: z.string().trim().min(3, "Postcode").max(12),
  country: z.string().trim().min(2).max(60),
});

export const orderSchema = z.object({
  lines: z
    .array(
      z.object({
        productId: z.string(),
        options: z.record(z.string(), z.string()),
        qty: z.number().int().min(1).max(10, "You can buy up to 10 of each item"),
      }),
    )
    .min(1, "Your bag is empty")
    .max(30),
  address: addressSchema,
  delivery: z.enum(["standard", "express"]),
  payment: z.enum(["cod", "demo"]),
  promo: z.string().trim().max(20).optional(),
  note: z.string().trim().max(300).optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(80),
  email: z.email("Enter a valid email").trim(),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().min(10, "A little more detail helps us answer").max(2000),
});

export const newsletterSchema = z.object({ email: z.email("Enter a valid email").trim().toLowerCase() });

export type AddressInput = z.infer<typeof addressSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
