/**
 * ============================================================================
 * File: analytics-filter.interface.ts
 * ============================================================================
 *
 * Analytics Filter Interface.
 *
 * Responsibilities
 * ----------------
 * - Define the normalized filter contract used internally.
 * - Decouple repository logic from HTTP request DTOs.
 * - Carry authenticated user context and analytics filters.
 *
 * Notes
 * -----
 * - Used only between the Service and Repository layers.
 * - Never exposed through the public API.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM 0.3+
 * ============================================================================
 */

import { TaskPriority } from '../../common/enums/task-priority.enum';
import { TaskStatus } from '../../common/enums/task-status.enum';

export interface AnalyticsFilter {
  /**
   * Authenticated user identifier.
   */
  userId: string;

  /**
   * Filter analytics from this date.
   */
  startDate?: Date;

  /**
   * Filter analytics until this date.
   */
  endDate?: Date;

  /**
   * Filter by task status.
   */
  status?: TaskStatus;

  /**
   * Filter by task priority.
   */
  priority?: TaskPriority;

  /**
   * Filter by category.
   */
  categoryId?: string;

  /**
   * Include only completed tasks.
   */
  completed?: boolean;

  /**
   * Include only overdue tasks.
   */
  overdue?: boolean;
}
