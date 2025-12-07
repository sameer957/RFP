import { z } from 'zod';

export const VendorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  category: z.string().optional(),
});
