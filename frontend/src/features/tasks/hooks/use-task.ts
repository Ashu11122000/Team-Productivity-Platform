'use client';

/**
 * ============================================================================
 * File: features/tasks/hooks/use-task.ts
 * ============================================================================
 *
 * Task Query Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Retrieve a single task by its identifier.
 * - Cache the task using TanStack Query.
 * - Avoid unnecessary requests when the identifier is missing.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Task management is owned by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * ============================================================================
 */

import { useQuery } from '@tanstack/react-query';

import { getTask } from '../api/get-task';

import type { Task } from '../types/task.types';

import { TASKS_GC_TIME, TASKS_STALE_TIME } from '../constants/task.constants';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

/**
 * ============================================================================
 * Hook Options
 * ============================================================================
 */

export interface UseTaskOptions {
  readonly enabled?: boolean;
}

/**
 * ============================================================================
 * Task Query
 * ============================================================================
 */

export function useTask(id: string, options: UseTaskOptions = {}) {
  const { enabled = true } = options;

  return useQuery<Task>({
    /**
     * Centralized query key.
     *
     * Example:
     * ['tasks', id]
     */
    queryKey: QUERY_KEYS.task(id),

    queryFn: () => getTask(id),

    enabled: enabled && Boolean(id),

    staleTime: TASKS_STALE_TIME,

    gcTime: TASKS_GC_TIME,

    retry: 1,

    refetchOnWindowFocus: false,
  });
}
