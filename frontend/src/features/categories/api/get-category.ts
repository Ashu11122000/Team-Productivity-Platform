/**
 * ============================================================================
 * File: features/categories/api/get-category.ts
 * ============================================================================
 *
 * Get Category API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Fetch a single category by ID.
 * - Communicate with NestJS backend.
 * - Use centralized API routes.
 * - Return typed category response.
 * ============================================================================
 */

import { nestjsClient } from '@/services/nestjs/client';

import { NESTJS_ROUTES } from '@/lib/constants/api-routes';

import type { CategoryResponse } from '../types/category.types';

export async function getCategory(id: string): Promise<CategoryResponse> {
  const response = await nestjsClient.get<CategoryResponse>(NESTJS_ROUTES.CATEGORIES.BY_ID(id));

  return response.data;
}
