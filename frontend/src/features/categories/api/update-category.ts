import { nestjsClient } from '@/services/nestjs/client';

import type {
  Category,
  CategoryResponse,
  UpdateCategoryRequest,
} from '../types/category.types';

export async function updateCategory(
  id: string,
  payload: UpdateCategoryRequest,
): Promise<Category> {
  const response =
    await nestjsClient.patch<
      CategoryResponse
    >(
      `/categories/${id}`,
      payload,
    );

  return response.data.data;
}