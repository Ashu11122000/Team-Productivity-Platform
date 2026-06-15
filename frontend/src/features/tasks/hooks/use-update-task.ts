'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { updateTask } from '../api/update-task';

import { QUERY_KEYS } from '@/constants/query-keys';

export function useUpdateTask() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: updateTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TASKS,
      });
    },
  });
}