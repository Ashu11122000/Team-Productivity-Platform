'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createTask } from '../api/create-task';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tasks,
      });
    },
  });
}
