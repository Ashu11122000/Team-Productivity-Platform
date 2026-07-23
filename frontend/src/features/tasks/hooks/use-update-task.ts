'use client';

/**
 * ============================================================================
 * File: features/tasks/hooks/use-update-task.ts
 * ============================================================================
 *
 * Update Task Mutation Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Update an existing task via the NestJS backend.
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

import { updateTask } from '../api/update-task';

import type { Task } from '../types/task.types';

import type { UpdateTaskRequest } from '../types/update-task.types';

import { TASK_MESSAGES } from '../constants/task.constants';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

/**
 * ============================================================================
 * Update Task Variables
 * ============================================================================
 */

export interface UpdateTaskVariables {
  readonly id: string;

  readonly payload: UpdateTaskRequest;
}

/**
 * ============================================================================
 * Update Task Mutation
 * ============================================================================
 */

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, UpdateTaskVariables>({
    mutationFn: ({ id, payload }) => updateTask(id, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tasks,
      });

      toast.success(TASK_MESSAGES.UPDATE_SUCCESS);
    },

    onError: (error) => {
      toast.error(error.message || TASK_MESSAGES.UPDATE_ERROR);
    },
  });
}
