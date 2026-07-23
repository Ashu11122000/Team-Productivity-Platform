/**
 * ============================================================================
 * File: features/notifications/types/notification-summary.types.ts
 * ============================================================================
 *
 * Notification Summary Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define notification summary contracts.
 * - Mirror NestJS notification summary responses.
 * - Provide strongly typed dashboard notification data.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Notifications are managed by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * ============================================================================
 */

/**
 * ============================================================================
 * Notification Summary
 * ============================================================================
 */

export interface NotificationSummary {
  /**
   * Total notifications.
   */
  readonly total: number;

  /**
   * Unread notifications count.
   */
  readonly unread: number;

  /**
   * Read notifications count.
   */
  readonly read: number;
}

/**
 * ============================================================================
 * Notification Summary Response
 * ============================================================================
 */

export interface NotificationSummaryResponse {
  readonly success: boolean;

  readonly message?: string;

  readonly data: NotificationSummary;
}
