'use client';

/**
 * ============================================================================
 * File: features/tasks/hooks/use-tasks.ts
 * ============================================================================
 *
 * Tasks Query Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Retrieve paginated tasks from the NestJS backend.
 * - Cache task collections using TanStack Query.
 * - Support filtering, searching, sorting, and pagination.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Task management is handled by the NestJS backend.
 * - Authentication is provided by the FastAPI backend.
 * ============================================================================
 */

import { useQuery } from '@tanstack/react-query';

import { getTasks } from '../api/get-tasks';

import type { TaskQueryParams } from '../types/task-query.types';

import type { TasksResponse } from '../types/task.types';

import { TASKS_GC_TIME, TASKS_STALE_TIME } from '../constants/task.constants';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

/**
 * ============================================================================
 * Tasks Query Hook
 * ============================================================================
 */

export function useTasks(params?: TaskQueryParams) {
  return useQuery<TasksResponse>({
    /**
     * Centralized React Query key.
     *
     * Examples:
     *
     * ['tasks']
     *
     * ['tasks', 'list', { status: 'TODO' }]
     */
    queryKey: QUERY_KEYS.taskList(params),

    queryFn: () => getTasks(params),

    staleTime: TASKS_STALE_TIME,

    gcTime: TASKS_GC_TIME,

    retry: 1,

    refetchOnWindowFocus: false,

    /**
     * TanStack Query v5 replacement
     * for keepPreviousData.
     */
    placeholderData: (previousData) => previousData,
  });
}
