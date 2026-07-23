/**
 * ============================================================================
 * File: features/categories/hooks/use-update-category.ts
 * ============================================================================
 *
 * Update Category Mutation Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Update an existing category.
 * - Invalidate category queries.
 * - Handle success/error feedback.
 * ============================================================================
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { updateCategory } from '../api/update-category';

import type { CategoryResponse } from '../types/category.types';

import type { UpdateCategoryRequest } from '../types/update-category.types';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

interface UpdateCategoryVariables {
  id: string;

  payload: UpdateCategoryRequest;
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation<CategoryResponse, Error, UpdateCategoryVariables>({
    mutationFn: ({ id, payload }) => updateCategory(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.categories,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.categoryList(),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.category(variables.id),
      });

      toast.success('Category updated successfully');
    },

    onError: () => {
      toast.error('Failed to update category');
    },
  });
}
