/**
 * ============================================================================
 * File: features/tasks/schemas/create-task.schema.ts
 * ============================================================================
 *
 * Create Task Validation Schema
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Validate task creation input.
 * - Mirror the NestJS CreateTaskDto.
 * - Provide strongly typed form values.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Used with React Hook Form and Zod Resolver.
 * - Client-side validation complements backend validation.
 * ============================================================================
 */

import { z } from 'zod';

/**
 * ============================================================================
 * Create Task Schema
 * ============================================================================
 */

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),

  description: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value === '' ? undefined : value)),

  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']),

  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),

  dueDate: z
    .string()
    .datetime({
      message: 'Please provide a valid date.',
    })
    .optional(),

  categoryId: z.string().nullable().optional(),

  tagIds: z.array(z.string()).optional(),
});

/**
 * ============================================================================
 * Create Task Form Values
 * ============================================================================
 */

export type CreateTaskSchemaType = z.infer<typeof createTaskSchema>;
