import { z } from 'zod';

export const eventFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  durationInMinutes: z.coerce
    .number()
    .int()
    .positive('Duration must be greater than 0')
    .max(60 * 12, 'Duration must be less than 12 hours (720 minutes)'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});
