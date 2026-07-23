/**
 * ============================================================================
 * File: features/notifications/types/notification-stats.types.ts
 * ============================================================================
 *
 * Notification Statistics Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define notification statistics contracts.
 * - Mirror NestJS notification statistics responses.
 * - Provide typed analytics data for notification dashboards.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Notifications are managed by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * ============================================================================
 */

/**
 * ============================================================================
 * Notification Statistics
 * ============================================================================
 */

export interface NotificationStats {
  /**
   * Total number of notifications.
   */
  readonly total: number;

  /**
   * Number of read notifications.
   */
  readonly read: number;

  /**
   * Number of unread notifications.
   */
  readonly unread: number;

  /**
   * Read percentage.
   *
   * Example:
   * 75 means 75%
   */
  readonly readPercentage: number;

  /**
   * Unread percentage.
   *
   * Example:
   * 25 means 25%
   */
  readonly unreadPercentage: number;
}

/**
 * ============================================================================
 * Notification Statistics Response
 * ============================================================================
 */

export interface NotificationStatsResponse {
  readonly success: boolean;

  readonly message?: string;

  readonly data: NotificationStats;
}
