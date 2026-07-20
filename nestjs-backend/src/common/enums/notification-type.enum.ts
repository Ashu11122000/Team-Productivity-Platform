/**
 * ============================================================================
 * File: notification-type.enum.ts
 * ============================================================================
 *
 * Notification Type Enumeration
 *
 * Responsibilities
 * ----------------
 * - Define all supported notification types.
 * - Standardize notification events across the application.
 * - Eliminate magic strings.
 * - Provide strongly typed notification categories.
 *
 * NOTE
 * ----
 * These values identify why a notification was generated.
 * They are persisted in the database and should remain stable.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM
 * - PostgreSQL
 * - TypeScript 5+
 * - Node.js 22+
 * ============================================================================
 */

/**
 * Supported notification types.
 */
export enum NotificationType {
  // ==========================================================================
  // Task Notifications
  // ==========================================================================

  /**
   * Task is approaching its due date.
   */
  TASK_DUE = 'TASK_DUE',

  /**
   * Task due date has passed.
   */
  TASK_OVERDUE = 'TASK_OVERDUE',

  /**
   * Task has been completed.
   */
  TASK_COMPLETED = 'TASK_COMPLETED',

  // ==========================================================================
  // Category Notifications
  // ==========================================================================

  /**
   * Category has been updated.
   */
  CATEGORY_UPDATED = 'CATEGORY_UPDATED',

  // ==========================================================================
  // Tag Notifications
  // ==========================================================================

  /**
   * Tag has been assigned.
   */
  TAG_ASSIGNED = 'TAG_ASSIGNED',

  // ==========================================================================
  // System Notifications
  // ==========================================================================

  /**
   * General system notification.
   */
  SYSTEM = 'SYSTEM',
}
