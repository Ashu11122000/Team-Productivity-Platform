/*
 * ============================================================================
 * File: notification.type.ts
 * ============================================================================
 *
 * External Notification Integration Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define notification contracts used across integrations.
 * - Represent notification data exchanged between services.
 * - Provide reusable notification types.
 *
 * Used By:
 * ----------------------------------------------------------------------------
 * - Notification integrations
 * - Dashboard integrations
 * - Email providers
 * - Push notification providers
 * - Analytics systems
 *
 * Does NOT:
 * ----------------------------------------------------------------------------
 * - Replace Notification entity.
 * - Send notifications.
 * - Access database.
 *
 * ============================================================================
 */

// ============================================================================
// Notification Type
// ============================================================================

export type NotificationType =
  | 'TASK_DUE'
  | 'TASK_OVERDUE'
  | 'TASK_COMPLETED'
  | 'CATEGORY_UPDATED'
  | 'TAG_ASSIGNED'
  | 'SYSTEM';

// ============================================================================
// Notification Status
// ============================================================================

export type NotificationStatus = 'UNREAD' | 'READ';

// ============================================================================
// Notification Integration Contract
// ============================================================================

export interface NotificationIntegrationType {
  /**
   * Notification identifier.
   */
  id?: string;

  /**
   * Notification title.
   */
  title: string;

  /**
   * Notification message.
   */
  message: string;

  /**
   * Notification category.
   */
  type: NotificationType;

  /**
   * Current notification status.
   */
  status: NotificationStatus;

  /**
   * User ownership.
   *
   * User is owned by FastAPI.
   */
  userId: string;

  /**
   * Optional related entity.
   *
   * Example:
   *
   * Task ID
   * Category ID
   */
  relatedEntityId?: string;

  /**
   * Related entity type.
   */
  relatedEntityType?: string;

  /**
   * External timestamps.
   */
  createdAt?: string;

  updatedAt?: string;
}
