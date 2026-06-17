'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { toast } from 'sonner';

import { deleteCategory } from '../api/delete-category';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

export function useDeleteCategory() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      deleteCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          QUERY_KEYS.categories,
      });

      toast.success(
        'Category deleted successfully',
      );
    },

    onError: () => {
      toast.error(
        'Failed to delete category',
      );
    },
  });
}