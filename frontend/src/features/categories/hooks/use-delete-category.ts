/**
 * ============================================================================
 * File: features/categories/hooks/use-delete-category.ts
 * ============================================================================
 *
 * Delete Category Mutation Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Delete an existing category.
 * - Invalidate category queries.
 * - Handle success/error feedback.
 * ============================================================================
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { deleteCategory } from '../api/delete-category';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.categories,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.categoryList(),
      });

      toast.success('Category deleted successfully');
    },

    onError: () => {
      toast.error('Failed to delete category');
    },
  });
}
