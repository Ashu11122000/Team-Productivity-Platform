'use client';

/**
 * ============================================================================
 * File: features/tasks/hooks/use-create-task.ts
 * ============================================================================
 *
 * Create Task Mutation Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Create a new task via the NestJS backend.
 * - Invalidate task cache after successful creation.
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

import { createTask } from '../api/create-task';

import type { CreateTaskRequest } from '../types/create-task.types';

import type { Task } from '../types/task.types';

import { TASK_MESSAGES } from '../constants/task.constants';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

/**
 * ============================================================================
 * Create Task Mutation
 * ============================================================================
 */

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, CreateTaskRequest>({
    mutationFn: createTask,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tasks,
      });

      toast.success(TASK_MESSAGES.CREATE_SUCCESS);
    },

    onError: (error) => {
      toast.error(error.message || TASK_MESSAGES.CREATE_ERROR);
    },
  });
}
