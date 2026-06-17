'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { toast } from 'sonner';

import { updateCategory } from '../api/update-category';

import type {
  UpdateCategoryRequest,
} from '../types/category.types';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

interface UpdateCategoryVariables {
  id: string;

  payload: UpdateCategoryRequest;
}

export function useUpdateCategory() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdateCategoryVariables) =>
      updateCategory(
        id,
        payload,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          QUERY_KEYS.categories,
      });

      toast.success(
        'Category updated successfully',
      );
    },

    onError: () => {
      toast.error(
        'Failed to update category',
      );
    },
  });
}