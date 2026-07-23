'use client';

/**
 * ============================================================================
 * File: features/analytics/hooks/use-task-status.ts
 * ============================================================================
 *
 * Task Status Analytics Query Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Fetch task status analytics from the NestJS backend.
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

import { getTaskStatusAnalytics } from '../api/get-task-status';

import type { TaskStatusAnalytics } from '../types/analytics.types';

/**
 * ============================================================================
 * Cache Configuration
 * ============================================================================
 */

export const TASK_STATUS_ANALYTICS_STALE_TIME = 5 * 60 * 1000;

export const TASK_STATUS_ANALYTICS_GC_TIME = 30 * 60 * 1000;

/**
 * ============================================================================
 * Task Status Analytics Query
 * ============================================================================
 */

export function useTaskStatus() {
  return useQuery<TaskStatusAnalytics>({
    queryKey: QUERY_KEYS.taskStatusAnalytics,

    queryFn: getTaskStatusAnalytics,

    staleTime: TASK_STATUS_ANALYTICS_STALE_TIME,

    gcTime: TASK_STATUS_ANALYTICS_GC_TIME,

    retry: 1,

    refetchOnWindowFocus: false,
  });
}
