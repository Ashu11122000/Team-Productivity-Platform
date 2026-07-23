/**
 * ============================================================================
 * File: features/categories/api/create-category.ts
 * ============================================================================
 *
 * Create Category API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Create a new category.
 * - Communicate with NestJS backend.
 * - Return typed category response.
 * ============================================================================
 */

import { nestjsClient } from '@/services/nestjs/client';

import { NESTJS_ROUTES } from '@/lib/constants/api-routes';

import type { CategoryResponse } from '../types/category.types';

import type { CreateCategoryRequest } from '../types/create-category.types';

export async function createCategory(payload: CreateCategoryRequest): Promise<CategoryResponse> {
  const response = await nestjsClient.post<CategoryResponse>(NESTJS_ROUTES.CATEGORIES.BASE, payload);

  return response.data;
}
