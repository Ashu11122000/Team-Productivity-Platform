/**
 * ============================================================================
 * File: features/categories/types/category.types.ts
 * ============================================================================
 *
 * Category Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define category API contracts.
 * - Match NestJS category module responses.
 * - Provide reusable frontend types.
 * ============================================================================
 */

/**
 * Category Entity
 */
export interface Category {
  id: string;

  name: string;

  description: string | null;

  color: string | null;

  userId: string;

  createdAt: string;

  updatedAt: string;
}

/**
 * Categories List Response
 */
export interface CategoriesResponse {
  data: Category[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}

/**
 * Single Category Response
 */
export interface CategoryResponse {
  success: boolean;

  data: Category;
}

/**
 * Category Query Parameters
 *
 * Used for:
 * GET /categories
 */
export interface CategoryQueryParams {
  page?: number;

  limit?: number;

  search?: string;

  sortBy?: 'name' | 'createdAt' | 'updatedAt';

  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Create Category Request
 *
 * Used for:
 * POST /categories
 */
export interface CreateCategoryRequest {
  name: string;

  description?: string;

  color?: string;
}

/**
 * Update Category Request
 *
 * Used for:
 * PATCH /categories/:id
 */
export interface UpdateCategoryRequest {
  name?: string;

  description?: string;

  color?: string;
}
