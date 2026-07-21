/*
 * ============================================================================
 * File: reminder-type.enum.ts
 * ============================================================================
 *
 * Enterprise Reminder Type Enumeration
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Defines the supported business types of reminders.
 * - Provides a strongly typed contract across the application.
 * - Eliminates the use of magic strings.
 * - Enables categorization and filtering of reminders.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Single source of truth
 * - Strong typing
 * - Database-friendly string values
 * - Reusable across all application layers
 *
 * Notes
 * ----------------------------------------------------------------------------
 * Reminder types describe the business context in which a reminder is used.
 * They do not control reminder behavior or scheduling logic.
 *
 * New reminder types can be safely introduced without affecting existing
 * reminder processing.
 * ============================================================================
 */

export enum ReminderType {
  /**
   * General-purpose reminder.
   */
  GENERAL = 'GENERAL',

  /**
   * Reminder associated with a task.
   */
  TASK = 'TASK',

  /**
   * Reminder associated with a meeting.
   */
  MEETING = 'MEETING',

  /**
   * Reminder associated with a calendar event.
   */
  EVENT = 'EVENT',

  /**
   * Reminder for a deadline.
   */
  DEADLINE = 'DEADLINE',

  /**
   * Reminder for a scheduled notification.
   */
  NOTIFICATION = 'NOTIFICATION',

  /**
   * Reminder related to a personal activity.
   */
  PERSONAL = 'PERSONAL',

  /**
   * Reminder related to work or business activities.
   */
  WORK = 'WORK',

  /**
   * Reminder for birthdays or anniversaries.
   */
  OCCASION = 'OCCASION',

  /**
   * Custom reminder type reserved for future extensions.
   */
  CUSTOM = 'CUSTOM',
}
