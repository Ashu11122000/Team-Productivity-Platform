/*
 * ============================================================================
 * File: category.type.ts
 * ============================================================================
 *
 * External Category Integration Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define category contracts for integrations.
 * - Represent category data exchanged between services.
 * - Provide reusable category types.
 *
 * Used By:
 * ----------------------------------------------------------------------------
 * - Task integrations
 * - Analytics integrations
 * - Dashboard integrations
 * - External reporting systems
 *
 * Does NOT:
 * ----------------------------------------------------------------------------
 * - Replace Category entity.
 * - Access database.
 * - Contain persistence logic.
 *
 * ============================================================================
 */

// ============================================================================
// Category Integration Contract
// ============================================================================

export interface CategoryType {
  /**
   * Category identifier.
   */
  id?: string;

  /**
   * Category name.
   *
   * Example:
   *
   * Work
   * Personal
   * Study
   */
  name: string;

  /**
   * Optional category description.
   */
  description?: string;

  /**
   * Optional UI color.
   *
   * Example:
   *
   * #FF5733
   */
  color?: string;

  /**
   * Owner identifier.
   *
   * User ownership comes from FastAPI.
   */
  userId: string;

  /**
   * External timestamps.
   */
  createdAt?: string;

  updatedAt?: string;
}
