/**
 * ============================================================================
 * File: features/analytics/types/task-analytics.types.ts
 * ============================================================================
 *
 * Task Analytics Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define analytics contracts returned by the NestJS backend.
 * - Provide strongly typed task statistics.
 * - Reuse shared task status and priority definitions.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Analytics are fully owned by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * ============================================================================
 */

import type { TaskPriority, TaskStatus } from '@/features/tasks/types/task.types';

/**
 * ============================================================================
 * Task Status Analytics
 * ============================================================================
 */

export type TaskStatusAnalytics = Readonly<Record<TaskStatus, number>>;

/**
 * ============================================================================
 * Task Priority Analytics
 * ============================================================================
 */

export type TaskPriorityAnalytics = Readonly<Record<TaskPriority, number>>;

/**
 * ============================================================================
 * Productivity Analytics
 * ============================================================================
 */

export interface ProductivityAnalytics {
  /**
   * Total number of tasks.
   */
  readonly totalTasks: number;

  /**
   * Completed tasks.
   */
  readonly completedTasks: number;

  /**
   * Active (non-completed) tasks.
   */
  readonly activeTasks: number;

  /**
   * Completion percentage.
   */
  readonly completionRate: number;
}
