'use client';

/**
 * ============================================================================
 * File: features/tasks/hooks/use-update-task-status.ts
 * ============================================================================
 *
 * Update Task Status Mutation Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Update the status of an existing task.
 * - Invalidate cached task queries after a successful update.
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

import { updateTaskStatus } from '../api/update-task-status';

import type { Task, TaskStatus } from '../types/task.types';

import { TASK_MESSAGES } from '../constants/task.constants';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

/**
 * ============================================================================
 * Update Task Status Variables
 * ============================================================================
 */

export interface UpdateTaskStatusVariables {
  readonly id: string;

  readonly status: TaskStatus;
}

/**
 * ============================================================================
 * Update Task Status Mutation
 * ============================================================================
 */

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, UpdateTaskStatusVariables>({
    mutationFn: updateTaskStatus,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tasks,
      });

      toast.success(TASK_MESSAGES.STATUS_UPDATE_SUCCESS);
    },

    onError: (error) => {
      toast.error(error.message || TASK_MESSAGES.STATUS_UPDATE_ERROR);
    },
  });
}
