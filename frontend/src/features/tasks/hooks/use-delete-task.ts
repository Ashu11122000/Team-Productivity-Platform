'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteTask } from '../api/delete-task';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TASKS,
      });
    },
  });
}
