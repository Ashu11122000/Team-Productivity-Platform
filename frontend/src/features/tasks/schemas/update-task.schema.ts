import { z } from 'zod';

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(
      255,
      'Title must be less than 255 characters',
    )
    .optional(),

  description: z
    .string()
    .optional(),

  status: z
    .enum([
      'TODO',
      'IN_PROGRESS',
      'COMPLETED',
    ])
    .optional(),

  priority: z
    .enum([
      'LOW',
      'MEDIUM',
      'HIGH',
    ])
    .optional(),

  dueDate: z
    .string()
    .optional(),

  categoryId: z
    .string()
    .nullable()
    .optional(),

  tagIds: z
    .array(z.string())
    .optional(),
});

export type UpdateTaskSchemaType =
  z.infer<
    typeof updateTaskSchema
  >;