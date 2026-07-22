/**
 * ============================================================================
 * File: task-priority-stats.interface.ts
 * ============================================================================
 *
 * Internal Task Priority Statistics Contract.
 *
 * Responsibilities
 * ----------------
 * - Represent aggregated task counts grouped by priority.
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

import { TaskPriority } from '../../common/enums/task-priority.enum';

export interface TaskPriorityStats {
  /**
   * Task priority.
   */
  readonly priority: TaskPriority;

  /**
   * Number of tasks having this priority.
   */
  readonly count: number;
}
