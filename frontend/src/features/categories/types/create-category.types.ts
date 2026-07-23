/**
 * ============================================================================
 * File: features/categories/types/create-category.types.ts
 * ============================================================================
 *
 * Create Category Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define create category request payload.
 * - Match NestJS Categories POST API contract.
 * - Prevent using entity types for mutations.
 * ============================================================================
 */

/**
 * Create Category Request
 *
 * Endpoint:
 *
 * POST /api/v1/categories
 */
export interface CreateCategoryRequest {
  /**
   * Category name
   */
  name: string;

  /**
   * Optional category description
   */
  description?: string;

  /**
   * Optional UI color
   *
   * Example:
   * "#2563EB"
   */
  color?: string;
}
