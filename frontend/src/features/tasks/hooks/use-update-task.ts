'use client';

import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateTask } from '../api/update-task';

import type {
  UpdateTaskRequest,
} from '../types/update-task.types';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

interface UpdateTaskVariables {
  id: string;
  payload: UpdateTaskRequest;
}

export function useUpdateTask() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdateTaskVariables) =>
      updateTask(
        id,
        payload,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          QUERY_KEYS.tasks,
      });

      toast.success(
        'Task updated successfully',
      );
    },

    onError: () => {
      toast.error(
        'Failed to update task',
      );
    },
  });
}