import { nestjsClient } from '@/services/nestjs/client';

import type {
  Category,
  CategoryResponse,
} from '../types/category.types';

export async function getCategory(
  id: string,
): Promise<Category> {
  const response =
    await nestjsClient.get<
      CategoryResponse
    >(`/categories/${id}`);

  return response.data.data;
}