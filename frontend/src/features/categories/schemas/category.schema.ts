import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(
      100,
      'Name must be less than 100 characters',
    ),

  description: z
    .string()
    .optional(),

  color: z
    .string()
    .optional(),
});

export type CategoryFormValues =
  z.infer<typeof categorySchema>;