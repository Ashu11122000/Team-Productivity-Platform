import { nestjsClient } from '@/services/nestjs/client';

import type {
  CategoriesResponse,
  CategoryQueryParams,
} from '../types/category.types';

export async function getCategories(
  params?: CategoryQueryParams,
): Promise<CategoriesResponse> {
  const response =
    await nestjsClient.get<
      CategoriesResponse
    >('/categories', {
      params,
    });

  return response.data;
}