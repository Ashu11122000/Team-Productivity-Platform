/*
 * ============================================================================
 * File: reminder-filter.interface.ts
 * ============================================================================
 *
 * Enterprise Reminder Filter Interface
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Defines the internal filtering contract used by RemindersRepository.
 * - Decouples repository filtering from HTTP DTOs.
 * - Provides a strongly typed object for QueryBuilder operations.
 * - Supports pagination, filtering, searching, and sorting.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Interface only
 * - No business logic
 * - Repository-oriented
 * - Strongly typed
 * - Reusable across the service and repository layers
 *
 * Notes
 * ----------------------------------------------------------------------------
 * Controllers receive ReminderQueryDto.
 * Services convert ReminderQueryDto into ReminderFilter.
 * Repositories consume ReminderFilter to construct optimized QueryBuilder
 * queries.
 * ============================================================================
 */

import { ReminderRepeat } from '../enums/reminder-repeat.enum';
import { ReminderStatus } from '../enums/reminder-status.enum';
import { ReminderType } from '../enums/reminder-type.enum';

export interface ReminderFilter {
  /**
   * Authenticated user identifier.
   */
  userId: number;

  /**
   * Free-text search against reminder title and description.
   */
  search?: string;

  /**
   * Filter by reminder status.
   */
  status?: ReminderStatus;

  /**
   * Filter by reminder type.
   */
  type?: ReminderType;

  /**
   * Filter by reminder repeat frequency.
   */
  repeat?: ReminderRepeat;

  /**
   * Filter reminders scheduled on or after this date.
   */
  fromDate?: Date;

  /**
   * Filter reminders scheduled on or before this date.
   */
  toDate?: Date;

  /**
   * Filter reminders associated with a specific task.
   */
  taskId?: string;

  /**
   * Filter reminders associated with a specific notification.
   */
  notificationId?: string;

  /**
   * Return only overdue reminders.
   */
  overdue?: boolean;

  /**
   * Include soft-deleted reminders in query results.
   */
  includeDeleted?: boolean;

  /**
   * Current page number.
   */
  page: number;

  /**
   * Maximum number of records per page.
   */
  limit: number;

  /**
   * Database column used for sorting.
   */
  sortBy: string;

  /**
   * Sorting direction.
   */
  sortOrder: 'ASC' | 'DESC';
}
