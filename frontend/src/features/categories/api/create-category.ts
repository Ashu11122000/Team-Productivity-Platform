import { nestjsClient } from '@/services/nestjs/client';

import { API_ROUTES } from '@/lib/constants/api-routes';

import type {
  Category,
  CreateCategoryRequest,
  CategoryResponse,
} from '../types/category.types';

export async function createCategory(
  payload: CreateCategoryRequest,
): Promise<Category> {
  const response =
    await nestjsClient.post<
      CategoryResponse
    >(
      API_ROUTES.CATEGORIES,
      payload,
    );

  return response.data.data;
}