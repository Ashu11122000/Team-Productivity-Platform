/**
 * ============================================================================
 * File: features/categories/schemas/create-category.schema.ts
 * ============================================================================
 *
 * Create Category Validation Schema
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Validate category creation payload.
 * - Provide Zod schema for forms.
 * - Match NestJS category creation contract.
 * ============================================================================
 */

import { z } from 'zod';

/**
 * Create Category Schema
 *
 * Endpoint:
 *
 * POST /api/v1/categories
 */
export const createCategorySchema = z.object({
  /**
   * Category name
   */
  name: z
    .string()
    .trim()
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name cannot exceed 100 characters'),

  /**
   * Category description
   */
  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
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
 * Infer TypeScript type
 *
 * Used with React Hook Form
 */
export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
/**
 * ============================================================================
 * File: features/categories/schemas/update-category.schema.ts
 * ============================================================================
 *
 * Update Category Validation Schema
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Validate category update payload.
 * - Provide Zod schema for update forms.
 * - Match NestJS category PATCH contract.
 * ============================================================================
 */

/**
 * Update Category Schema
 *
 * Endpoint:
 *
 * PATCH /api/v1/categories/:id
 */
export const updateCategorySchema = z
  .object({
    /**
     * Updated category name
     */
    name: z
      .string()
      .trim()
      .min(2, 'Category name must be at least 2 characters')
      .max(100, 'Category name cannot exceed 100 characters')
      .optional(),

    /**
     * Updated category description
     */
    description: z
      .string()
      .trim()
      .max(500, 'Description cannot exceed 500 characters')
      .optional()
      .or(z.literal('')),

    /**
     * Updated category color
     *
     * Example:
     * #16A34A
     */
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => data.name !== undefined || data.description !== undefined || data.color !== undefined,
    {
      message: 'At least one field must be updated',
    },
  );

/**
 * Infer TypeScript type
 *
 * Used with React Hook Form
 */
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;
