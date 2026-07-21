/*
 * ============================================================================
 * File: reminder-summary.interface.ts
 * ============================================================================
 *
 * Enterprise Reminder Summary Interface
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Defines the aggregated reminder summary returned by the repository layer.
 * - Serves as the internal contract between the Repository and Mapper.
 * - Keeps repository models independent of API response DTOs.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Interface only
 * - No business logic
 * - Repository-oriented
 * - Strongly typed
 * - Immutable contract
 *
 * Notes
 * ----------------------------------------------------------------------------
 * Repository methods return this interface after executing aggregation
 * queries. ReminderMapper converts this interface into
 * ReminderSummaryDto before it is returned by the service layer.
 *
 * This interface intentionally mirrors ReminderSummaryDto while remaining
 * independent from the presentation layer.
 * ============================================================================
 */

export interface ReminderSummary {
  /**
   * Total number of reminders.
   */
  total: number;

  /**
   * Number of pending reminders.
   */
  pending: number;

  /**
   * Number of completed reminders.
   */
  completed: number;

  /**
   * Number of cancelled reminders.
   */
  cancelled: number;

  /**
   * Number of overdue reminders.
   */
  overdue: number;

  /**
   * Number of reminders scheduled for today.
   */
  today: number;

  /**
   * Number of upcoming reminders.
   */
  upcoming: number;

  /**
   * Number of recurring reminders.
   */
  recurring: number;

  /**
   * Number of soft deleted reminders.
   */
  deleted: number;
}
