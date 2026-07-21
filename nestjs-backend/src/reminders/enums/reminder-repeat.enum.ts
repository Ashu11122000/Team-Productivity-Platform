/*
 * ============================================================================
 * File: reminder-repeat.enum.ts
 * ============================================================================
 *
 * Enterprise Reminder Repeat Enumeration
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Defines the supported recurrence intervals for reminders.
 * - Provides a strongly typed contract across DTOs, entities,
 *   repositories, services, and controllers.
 * - Prevents magic strings throughout the application.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Single source of truth
 * - Strong typing
 * - Reusable across all layers
 * - Database-friendly string values
 *
 * Notes
 * ----------------------------------------------------------------------------
 * The repeat value determines how the reminder should be rescheduled after
 * successful execution. Actual recurrence scheduling is handled by the
 * service layer or background jobs—not by this enum.
 * ============================================================================
 */

export enum ReminderRepeat {
  /**
   * Reminder occurs only once.
   */
  NONE = 'NONE',

  /**
   * Reminder repeats every day.
   */
  DAILY = 'DAILY',

  /**
   * Reminder repeats every week.
   */
  WEEKLY = 'WEEKLY',

  /**
   * Reminder repeats every month.
   */
  MONTHLY = 'MONTHLY',

  /**
   * Reminder repeats every year.
   */
  YEARLY = 'YEARLY',

  /**
   * Reminder repeats on weekdays (Monday–Friday).
   */
  WEEKDAYS = 'WEEKDAYS',

  /**
   * Reminder repeats on weekends (Saturday–Sunday).
   */
  WEEKENDS = 'WEEKENDS',

  /**
   * Reminder uses a custom recurrence rule
   * (reserved for future enhancements).
   */
  CUSTOM = 'CUSTOM',
}
