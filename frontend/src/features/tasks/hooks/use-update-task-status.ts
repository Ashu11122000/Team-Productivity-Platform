'use client';

import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { updateTaskStatus } from '../api/update-task-status';

import type {
  TaskStatus,
} from '../types/task.types';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

interface Variables {
  id: string;
  status: TaskStatus;
}

export function useUpdateTaskStatus() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      variables: Variables,
    ) =>
      updateTaskStatus(
        variables,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          QUERY_KEYS.TASKS,
      });

      toast.success(
        'Status updated',
      );
    },

    onError: () => {
      toast.error(
        'Failed to update status',
      );
    },
  });
}