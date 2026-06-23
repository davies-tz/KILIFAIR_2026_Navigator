import { z } from "zod";

const urlOrEmpty = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined)
  .pipe(z.string().url().optional());

export const exhibitorSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  description: z.string().min(20, "Description should be at least 20 characters"),
  services: z.array(z.string().min(1)).min(1, "Add at least one service"),
  contactName: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  website: urlOrEmpty,
  instagram: urlOrEmpty,
  facebook: urlOrEmpty,
  linkedin: urlOrEmpty,
  categoryId: z.string().min(1),
  booth: z.object({
    boothNumber: z.string().min(1),
    hall: z.string().min(1),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    polygon: z.unknown().optional()
  })
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const searchSchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  service: z.string().trim().optional()
});
