import { z } from 'zod';

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name is required'),

  email: z
    .string()
    .email('Invalid email'),

  avatarUrl: z
    .string()
    .url('Invalid URL')
    .optional()
    .or(z.literal('')),
});

export type ProfileFormValues =
  z.infer<typeof profileSchema>;