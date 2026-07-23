/**
 * ============================================================================
 * File: features/categories/api/get-categories.ts
 * ============================================================================
 *
 * Get Categories API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Fetch categories from NestJS backend.
 * - Support pagination, search, and sorting.
 * - Use centralized API routes.
 * ============================================================================
 */

import { nestjsClient } from '@/services/nestjs/client';

import { NESTJS_ROUTES } from '@/lib/constants/api-routes';

import type { CategoriesResponse } from '../types/category.types';

import type { CategoryQueryParams } from '../types/category-query.types';

export async function getCategories(params?: CategoryQueryParams): Promise<CategoriesResponse> {
  const response = await nestjsClient.get<CategoriesResponse>(NESTJS_ROUTES.CATEGORIES.BASE, {
    params,
  });

  return response.data;
}
