/**
 * ============================================================================
 * File: features/categories/hooks/use-create-category.ts
 * ============================================================================
 *
 * Create Category Mutation Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Create a new category.
 * - Invalidate category queries.
 * - Handle success/error feedback.
 * ============================================================================
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { createCategory } from '../api/create-category';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

import type { CategoryResponse } from '../types/category.types';

import type { CreateCategoryRequest } from '../types/create-category.types';

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation<CategoryResponse, Error, CreateCategoryRequest>({
    mutationFn: createCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.categories,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.categoryList(),
      });

      toast.success('Category created successfully');
    },

    onError: () => {
      toast.error('Failed to create category');
    },
  });
}
