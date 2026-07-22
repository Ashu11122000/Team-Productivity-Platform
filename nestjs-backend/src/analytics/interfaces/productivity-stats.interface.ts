/**
 * ============================================================================
 * File: productivity-stats.interface.ts
 * ============================================================================
 *
 * Internal Productivity Statistics Contract.
 *
 * Responsibilities
 * ----------------
 * - Define the repository aggregation result for productivity metrics.
 * - Decouple persistence models from API response DTOs.
 * - Used internally between Repository and Service layers.
 *
 * Architecture
 * ------------
 *
 * AnalyticsRepository
 *        │
 *        ▼
 * ProductivityStats
 *        │
 *        ▼
 * AnalyticsService
 *        │
 *        ▼
 * AnalyticsMapper
 *
 * Notes
 * -----
 * - Internal use only.
 * - No Swagger decorators.
 * - No TypeORM decorators.
 * - No business logic.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * ============================================================================
 */

export interface ProductivityStats {
  /**
   * Total number of tasks.
   */
  readonly totalTasks: number;

  /**
   * Completed tasks.
   */
  readonly completedTasks: number;

  /**
   * Pending tasks.
   */
  readonly pendingTasks: number;

  /**
   * Tasks currently in progress.
   */
  readonly inProgressTasks: number;

  /**
   * Overdue tasks.
   */
  readonly overdueTasks: number;

  /**
   * Completion percentage.
   */
  readonly completionRate: number;
}
