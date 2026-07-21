/*
 * ============================================================================
 * File: reminder-stats.interface.ts
 * ============================================================================
 *
 * Enterprise Reminder Statistics Interface
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Defines the internal statistics model returned by the repository layer.
 * - Acts as the contract between RemindersRepository and ReminderMapper.
 * - Represents aggregated reminder metrics used for dashboards, analytics,
 *   and reporting.
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
 * The repository returns this interface after executing aggregation queries.
 * ReminderMapper converts this interface into ReminderStatsDto before the
 * response is returned by the service layer.
 *
 * This interface intentionally mirrors ReminderStatsDto while remaining
 * independent from the presentation layer.
 * ============================================================================
 */

export interface ReminderStats {
  /**
   * Total number of reminders.
   */
  total: number;

  /**
   * Number of active reminders.
   */
  active: number;

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
   * Number of soft-deleted reminders.
   */
  deleted: number;

  /**
   * Reminder completion rate as a percentage.
   */
  completionRate: number;

  /**
   * Average number of reminders created per day.
   */
  averagePerDay: number;
}
