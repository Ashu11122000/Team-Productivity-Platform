/**
 * ============================================================================
 * File: notification-status.enum.ts
 * ============================================================================
 *
 * Notification Status Enumeration
 *
 * Responsibilities
 * ----------------
 * - Define the lifecycle states of user notifications.
 * - Standardize notification status values.
 * - Eliminate magic strings.
 * - Provide strongly typed notification states.
 *
 * NOTE
 * ----
 * These values represent the read status of notifications.
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
 * Supported notification statuses.
 */
export enum NotificationStatus {
  /**
   * Notification has not been viewed by the user.
   */
  UNREAD = 'UNREAD',

  /**
   * Notification has been viewed by the user.
   */
  READ = 'READ',
}
