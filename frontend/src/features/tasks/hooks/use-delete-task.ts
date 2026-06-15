'use client';

import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { deleteTask } from '../api/delete-task';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

export function useDeleteTask() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: deleteTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          QUERY_KEYS.TASKS,
      });

      toast.success(
        'Task deleted successfully',
      );
    },

    onError: () => {
      toast.error(
        'Failed to delete task',
      );
    },
  });
}