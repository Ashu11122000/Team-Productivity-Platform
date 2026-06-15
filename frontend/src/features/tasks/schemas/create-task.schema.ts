import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),

  description: z
    .string()
    .optional(),

  status: z.enum([
    'TODO',
    'IN_PROGRESS',
    'COMPLETED',
  ]),

  priority: z.enum([
    'LOW',
    'MEDIUM',
    'HIGH',
  ]),

  dueDate: z
    .string()
    .optional(),

  tagIds: z
    .array(z.string())
    .optional(),
});

export type CreateTaskSchemaType =
  z.infer<typeof createTaskSchema>;