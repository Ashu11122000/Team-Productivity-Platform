/**
 * ============================================================================
 * File: features/categories/api/delete-category.ts
 * ============================================================================
 *
 * Delete Category API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Delete an existing category.
 * - Communicate with NestJS backend.
 * - Use centralized API routes.
 * ============================================================================
 */

import { nestjsClient } from '@/services/nestjs/client';

import { NESTJS_ROUTES } from '@/lib/constants/api-routes';

export async function deleteCategory(id: string): Promise<void> {
  await nestjsClient.delete(NESTJS_ROUTES.CATEGORIES.BY_ID(id));
}
