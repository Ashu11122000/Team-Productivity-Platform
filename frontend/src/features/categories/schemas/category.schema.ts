/**
 * ============================================================================
 * File: features/categories/schemas/category.schema.ts
 * ============================================================================
 *
 * Category Validation Schema
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define shared category validation rules.
 * - Reuse across create/update schemas.
 * - Provide common form validation.
 * ============================================================================
 */

import { z } from 'zod';

/**
 * Shared Category Fields Schema
 */
export const categorySchema = z.object({
  /**
   * Category name
   */
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),

  /**
   * Category description
   */
  description: z
    .string()
    .trim()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),

  /**
   * Category color
   *
   * Example:
   * #2563EB
   */
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format')
    .optional()
    .or(z.literal('')),
});

/**
 * Category Form Values
 */
export type CategoryFormValues = z.infer<typeof categorySchema>;
