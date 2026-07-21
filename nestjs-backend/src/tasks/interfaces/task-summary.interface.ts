/**
 * ============================================================================
 * File: task-summary.interface.ts
 * ============================================================================
 *
 * Internal task summary contract.
 *
 * Responsibilities
 * ----------------
 * - Represent aggregated task statistics.
 * - Transfer summary data between the Repository and Service layers.
 * - Provide strongly typed metrics for dashboards and analytics.
 *
 * Notes
 * -----
 * - This interface is NOT exposed directly through the API.
 * - Repository implementations populate this interface.
 * - Services may enrich or transform this data before mapping it
 *   to response DTOs.
 *
 * Compatible With
 * ---------------
 * - NestJS 11
 * - TypeScript 5+
 * ============================================================================
 */

/**
 * Aggregated task statistics.
 */
export interface TaskSummary {
  /**
   * Total number of tasks.
   */
  total: number;

  /**
   * Number of completed tasks.
   */
  completed: number;

  /**
   * Number of pending tasks.
   */
  pending: number;

  /**
   * Number of in-progress tasks.
   */
  inProgress: number;

  /**
   * Number of overdue tasks.
   */
  overdue: number;

  /**
   * Number of cancelled tasks.
   */
  cancelled: number;

  /**
   * Number of high-priority tasks.
   */
  highPriority: number;

  /**
   * Number of medium-priority tasks.
   */
  mediumPriority: number;

  /**
   * Number of low-priority tasks.
   */
  lowPriority: number;

  /**
   * Completion rate.
   *
   * Value between 0 and 100.
   */
  completionRate: number;
}
