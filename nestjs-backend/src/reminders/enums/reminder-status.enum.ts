/*
 * ============================================================================
 * File: reminder-status.enum.ts
 * ============================================================================
 *
 * Enterprise Reminder Status Enumeration
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Defines the lifecycle states of a reminder.
 * - Provides a strongly typed status contract across the application.
 * - Eliminates magic strings from business logic.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Single source of truth
 * - Strong typing
 * - Reusable across all layers
 * - Database-friendly string values
 *
 * Reminder Lifecycle
 * ----------------------------------------------------------------------------
 * PENDING
 *      ↓
 * TRIGGERED
 *      ↓
 * COMPLETED
 *
 * Or
 *
 * PENDING
 *      ↓
 * CANCELLED
 *
 * OVERDUE represents reminders whose scheduled execution time has passed
 * without being completed.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * Status transitions are enforced by the service layer.
 * This enum contains no business logic.
 * ============================================================================
 */

export enum ReminderStatus {
  /**
   * Reminder is scheduled and waiting to be triggered.
   */
  PENDING = 'PENDING',

  /**
   * Reminder has been triggered and notification has been sent.
   */
  TRIGGERED = 'TRIGGERED',

  /**
   * Reminder has been completed successfully.
   */
  COMPLETED = 'COMPLETED',

  /**
   * Reminder was cancelled before execution.
   */
  CANCELLED = 'CANCELLED',

  /**
   * Reminder was not completed before its scheduled time.
   */
  OVERDUE = 'OVERDUE',
}
