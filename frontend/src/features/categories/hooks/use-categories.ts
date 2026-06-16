'use client';

import { useQuery } from '@tanstack/react-query';

import { getCategories } from '../api/get-categories';

import type {
  CategoriesResponse,
  CategoryQueryParams,
} from '../types/category.types';

export function useCategories(
  params?: CategoryQueryParams,
) {
  return useQuery<
    CategoriesResponse
  >({
    queryKey: [
      'categories',
      params,
    ],

    queryFn: () =>
      getCategories(params),

    staleTime: 1000 * 60,
  });
}