'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { toast } from 'sonner';

import { createCategory } from '../api/create-category';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.categories,
      });

      toast.success(
        'Category created successfully',
      );
    },

    onError: () => {
      toast.error(
        'Failed to create category',
      );
    },
  });
}