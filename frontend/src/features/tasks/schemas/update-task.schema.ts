/**
 * ============================================================================
 * File: features/tasks/schemas/update-task.schema.ts
 * ============================================================================
 *
 * Update Task Validation Schema
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Validate task update input.
 * - Mirror the NestJS UpdateTaskDto.
 * - Support partial task updates.
 * - Provide strongly typed form values.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Used with React Hook Form and Zod Resolver.
 * - All fields are optional because updates are partial.
 * ============================================================================
 */

import { z } from 'zod';

/**
 * ============================================================================
 * Update Task Schema
 * ============================================================================
 */

export const updateTaskSchema = z.object({
  /**
   * Task title.
   */
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .optional(),

  /**
   * Task description.
   */
  description: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value === '' ? undefined : value)),

  /**
   * Task status.
   */
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).optional(),

  /**
   * Task priority.
   */
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),

  /**
   * Due date (ISO 8601).
   */
  dueDate: z
    .string()
    .datetime({
      message: 'Please provide a valid due date.',
    })
    .optional(),

  /**
   * Category identifier.
   */
  categoryId: z.string().nullable().optional(),

  /**
   * Associated tag identifiers.
   */
  tagIds: z.array(z.string()).optional(),
});

/**
 * ============================================================================
 * Update Task Form Values
 * ============================================================================
 */

export type UpdateTaskSchemaType = z.infer<typeof updateTaskSchema>;
