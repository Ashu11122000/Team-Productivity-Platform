/**
 * ============================================================================
 * File: features/analytics/api/get-overview.ts
 * ============================================================================
 *
 * Overview Analytics API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Aggregate analytics required by the dashboard overview.
 * - Fetch task status, task priority, and productivity analytics.
 * - Execute requests concurrently for optimal performance.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Analytics are fully owned by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * ============================================================================
 */

import { getProductivityAnalytics } from './get-productivity';
import { getTaskPriorityAnalytics } from './get-task-priority';
import { getTaskStatusAnalytics } from './get-task-status';

import type {
  ProductivityAnalytics,
  TaskPriorityAnalytics,
  TaskStatusAnalytics,
} from '../types/analytics.types';

/**
 * ============================================================================
 * Overview Analytics Response
 * ============================================================================
 */

export interface OverviewAnalytics {
  readonly status: TaskStatusAnalytics;

  readonly priority: TaskPriorityAnalytics;

  readonly productivity: ProductivityAnalytics;
}

/**
 * ============================================================================
 * Get Overview Analytics
 * ============================================================================
 */

export async function getOverviewAnalytics(): Promise<OverviewAnalytics> {
  const [status, priority, productivity] = await Promise.all([
    getTaskStatusAnalytics(),
    getTaskPriorityAnalytics(),
    getProductivityAnalytics(),
  ]);

  return {
    status,
    priority,
    productivity,
  };
}
