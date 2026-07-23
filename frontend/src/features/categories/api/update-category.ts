/**
 * ============================================================================
 * File: features/categories/api/update-category.ts
 * ============================================================================
 *
 * Update Category API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Update an existing category.
 * - Communicate with NestJS backend.
 * - Use centralized API routes.
 * - Return typed category response.
 * ============================================================================
 */

import { nestjsClient } from '@/services/nestjs/client';

import { NESTJS_ROUTES } from '@/lib/constants/api-routes';

import type { CategoryResponse } from '../types/category.types';

import type { UpdateCategoryRequest } from '../types/update-category.types';

export async function updateCategory(
  id: string,
  payload: UpdateCategoryRequest,
): Promise<CategoryResponse> {
  const response = await nestjsClient.patch<CategoryResponse>(
    NESTJS_ROUTES.CATEGORIES.BY_ID(id),
    payload,
  );

  return response.data;
}
