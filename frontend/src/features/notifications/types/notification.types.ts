/**
 * ============================================================================
 * File: features/notifications/types/notification.types.ts
 * ============================================================================
 *
 * Notification Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define notification-related domain models.
 * - Mirror the NestJS notification response DTOs.
 * - Provide shared types across the Notifications feature.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Notifications are fully owned by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * ============================================================================
 */

/**
 * ============================================================================
 * Notification
 * ============================================================================
 *
 * Named NotificationItem to avoid conflicting with the browser's
 * built-in Notification interface.
 * ============================================================================
 */

export interface NotificationItem {
  /**
   * Notification identifier.
   */
  readonly id: string;

  /**
   * Notification title.
   */
  readonly title: string;

  /**
   * Notification message.
   */
  readonly message: string;

  /**
   * Indicates whether the notification has been read.
   */
  readonly isRead: boolean;

  /**
   * Creation timestamp (ISO 8601).
   */
  readonly createdAt: string;

  /**
   * Last update timestamp (ISO 8601).
   */
  readonly updatedAt?: string | null;
}

/**
 * ============================================================================
 * Notifications Response
 * ============================================================================
 */

export interface NotificationsResponse {
  readonly success: boolean;

  readonly data: readonly NotificationItem[];
}

/**
 * ============================================================================
 * Notification Response
 * ============================================================================
 */

export interface NotificationResponse {
  readonly success: boolean;

  readonly data: NotificationItem;
}

/**
 * ============================================================================
 * Notification Action Response
 * ============================================================================
 */

export interface NotificationActionResponse {
  readonly success: boolean;

  readonly message: string;
}
