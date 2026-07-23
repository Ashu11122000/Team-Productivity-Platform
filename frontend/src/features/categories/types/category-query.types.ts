/**
 * ============================================================================
 * File: features/categories/types/category-query.types.ts
 * ============================================================================
 *
 * Category Query Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define category listing/filter parameters.
 * - Support pagination.
 * - Support searching and sorting.
 * - Match NestJS Categories API query contracts.
 * ============================================================================
 */

/**
 * Category List Query Parameters
 *
 * Used for:
 *
 * GET /api/v1/categories
 */
export interface CategoryQueryParams {
  /**
   * Pagination page number
   */
  page?: number;

  /**
   * Number of records per page
   */
  limit?: number;

  /**
   * Search category by name
   */
  search?: string;

  /**
   * Sorting field
   */
  sortBy?: 'name' | 'createdAt' | 'updatedAt';

  /**
   * Sorting direction
   */
  sortOrder?: 'ASC' | 'DESC';
}
