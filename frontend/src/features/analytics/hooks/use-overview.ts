'use client';

/**
 * ============================================================================
 * File: features/analytics/hooks/use-overview.ts
 * ============================================================================
 *
 * Analytics Overview Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Aggregate analytics queries required by the dashboard overview.
 * - Expose task status, task priority, and productivity analytics.
 * - Provide unified loading and error states.
 * - Memoize the aggregated result.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Analytics are provided by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * ============================================================================
 */

import { useMemo } from 'react';

import { useProductivity } from './use-productivity';
import { useTaskPriority } from './use-task-priority';
import { useTaskStatus } from './use-task-status';

import type {
  ProductivityAnalytics,
  TaskPriorityAnalytics,
  TaskStatusAnalytics,
} from '../types/analytics.types';

/**
 * ============================================================================
 * Overview Result
 * ============================================================================
 */

export interface OverviewResult {
  readonly status: TaskStatusAnalytics | undefined;

  readonly priority: TaskPriorityAnalytics | undefined;

  readonly productivity: ProductivityAnalytics | undefined;

  readonly isLoading: boolean;

  readonly isError: boolean;
}

/**
 * ============================================================================
 * Overview Hook
 * ============================================================================
 */

export function useOverview(): OverviewResult {
  const statusQuery = useTaskStatus();

  const priorityQuery = useTaskPriority();

  const productivityQuery = useProductivity();

  return useMemo(
    () => ({
      status: statusQuery.data,

      priority: priorityQuery.data,

      productivity: productivityQuery.data,

      isLoading: statusQuery.isLoading || priorityQuery.isLoading || productivityQuery.isLoading,

      isError: statusQuery.isError || priorityQuery.isError || productivityQuery.isError,
    }),
    [
      statusQuery.data,
      statusQuery.isLoading,
      statusQuery.isError,
      priorityQuery.data,
      priorityQuery.isLoading,
      priorityQuery.isError,
      productivityQuery.data,
      productivityQuery.isLoading,
      productivityQuery.isError,
    ],
  );
}
