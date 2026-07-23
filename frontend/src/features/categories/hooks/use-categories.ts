/**
 * ============================================================================
 * File: features/categories/hooks/use-categories.ts
 * ============================================================================
 *
 * Categories Query Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Fetch categories.
 * - Support pagination/search/sorting.
 * - Use centralized React Query keys.
 * - Provide typed responses.
 * ============================================================================
 */

'use client';

import { useQuery } from '@tanstack/react-query';

import { getCategories } from '../api/get-categories';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

import type { CategoriesResponse } from '../types/category.types';

import type { CategoryQueryParams } from '../types/category-query.types';

export function useCategories(params?: CategoryQueryParams) {
  return useQuery<CategoriesResponse>({
    queryKey: QUERY_KEYS.categoryList(params),

    queryFn: () => getCategories(params),

    staleTime: 1000 * 60,
  });
}
