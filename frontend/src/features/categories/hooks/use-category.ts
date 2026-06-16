'use client';

import { useQuery } from '@tanstack/react-query';

import { getCategory } from '../api/get-category';

import type {
  Category,
} from '../types/category.types';

export function useCategory(
  id: string,
) {
  return useQuery<Category>({
    queryKey: [
      'category',
      id,
    ],

    queryFn: () =>
      getCategory(id),

    enabled: !!id,
  });
}