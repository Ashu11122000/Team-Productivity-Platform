/**
 * ============================================================================
 * File: task-status-stats.interface.ts
 * ============================================================================
 *
 * Internal Task Status Statistics Contract.
 *
 * Responsibilities
 * ----------------
 * - Represent aggregated task counts grouped by status.
 * - Used internally between Repository and Service.
 * - Converted into DTOs by AnalyticsMapper.
 *
 * Notes
 * -----
 * - Internal use only.
 * - No Swagger decorators.
 * - No persistence concerns.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * ============================================================================
 */

import { TaskStatus } from '../../common/enums/task-status.enum';

export interface TaskStatusStats {
  /**
   * Task status.
   */
  readonly status: TaskStatus;

  /**
   * Number of tasks having this status.
   */
  readonly count: number;
}
