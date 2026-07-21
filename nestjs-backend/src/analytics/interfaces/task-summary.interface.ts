/**
 * ============================================================================
 * File: task-summary.interface.ts
 * ============================================================================
 *
 * Internal task summary aggregation contract.
 *
 * ============================================================================
 */

export interface TaskSummary {
  totalTasks: number;

  completedTasks: number;

  pendingTasks: number;

  inProgressTasks: number;

  overdueTasks: number;

  cancelledTasks: number;

  completionRate: number;
}
