import { z } from "zod";

export const vendorSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  category: z.string().optional(),
});
