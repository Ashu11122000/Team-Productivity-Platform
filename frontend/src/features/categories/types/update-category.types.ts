/**
 * ============================================================================
 * File: features/categories/types/update-category.types.ts
 * ============================================================================
 *
 * Update Category Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define update category request payload.
 * - Match NestJS Categories PATCH API contract.
 * - Keep mutation types separate from entity types.
 * ============================================================================
 */

/**
 * Update Category Request
 *
 * Endpoint:
 *
 * PATCH /api/v1/categories/:id
 */
export interface UpdateCategoryRequest {
  /**
   * Updated category name
   */
  name?: string;

  /**
   * Updated category description
   */
  description?: string;

  /**
   * Updated category color
   *
   * Example:
   * "#16A34A"
   */
  color?: string;
}
