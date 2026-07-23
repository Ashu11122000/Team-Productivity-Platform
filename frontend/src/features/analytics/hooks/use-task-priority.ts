'use client';

/**
 * ============================================================================
 * File: features/analytics/hooks/use-task-priority.ts
 * ============================================================================
 *
 * Task Priority Analytics Query Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Fetch task priority analytics from the NestJS backend.
 * - Cache analytics using TanStack Query.
 * - Provide optimized caching for dashboard widgets.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Analytics are fully owned by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * ============================================================================
 */

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

import { getTaskPriorityAnalytics } from '../api/get-task-priority';

import type { TaskPriorityAnalytics } from '../types/analytics.types';

/**
 * ============================================================================
 * Cache Configuration
 * ============================================================================
 */

export const TASK_PRIORITY_ANALYTICS_STALE_TIME = 5 * 60 * 1000;

export const TASK_PRIORITY_ANALYTICS_GC_TIME = 30 * 60 * 1000;

/**
 * ============================================================================
 * Task Priority Analytics Query
 * ============================================================================
 */

export function useTaskPriority() {
  return useQuery<TaskPriorityAnalytics>({
    queryKey: QUERY_KEYS.taskPriorityAnalytics,

    queryFn: getTaskPriorityAnalytics,

    staleTime: TASK_PRIORITY_ANALYTICS_STALE_TIME,

    gcTime: TASK_PRIORITY_ANALYTICS_GC_TIME,

    retry: 1,

    refetchOnWindowFocus: false,
  });
}
