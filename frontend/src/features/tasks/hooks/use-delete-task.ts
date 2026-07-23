'use client';

/**
 * ============================================================================
 * File: features/tasks/hooks/use-delete-task.ts
 * ============================================================================
 *
 * Delete Task Mutation Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Delete an existing task via the NestJS backend.
 * - Invalidate the task cache after successful deletion.
 * - Display success and error notifications.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Task management is handled by the NestJS backend.
 * - Authentication is provided by the FastAPI backend.
 * ============================================================================
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { deleteTask } from '../api/delete-task';

import { TASK_MESSAGES } from '../constants/task.constants';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

/**
 * ============================================================================
 * Delete Task Mutation
 * ============================================================================
 */

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteTask,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tasks,
      });

      toast.success(TASK_MESSAGES.DELETE_SUCCESS);
    },

    onError: (error) => {
      toast.error(error.message || TASK_MESSAGES.DELETE_ERROR);
    },
  });
}
