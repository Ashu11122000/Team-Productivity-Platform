/**
 * ============================================================================
 * File: features/notifications/constants/notification.constants.ts
 * ============================================================================
 *
 * Notification Constants
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Centralize notification-related constants.
 * - Avoid duplicated string literals.
 * - Configure React Query caching.
 * - Store reusable UI messages.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Notifications are fully managed by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * ============================================================================
 */

/**
 * ============================================================================
 * React Query Cache
 * ============================================================================
 */

/**
 * Notifications change frequently.
 * Keep cache relatively fresh.
 */
export const NOTIFICATIONS_STALE_TIME = 5 * 60 * 1000;

/**
 * Retain cache for 30 minutes.
 */
export const NOTIFICATIONS_GC_TIME = 30 * 60 * 1000;

/**
 * ============================================================================
 * Polling
 * ============================================================================
 */

/**
 * Automatic polling interval.
 *
 * Set to 0 to disable polling.
 */
export const NOTIFICATIONS_REFETCH_INTERVAL = 60 * 1000;

/**
 * ============================================================================
 * UI
 * ============================================================================
 */

/**
 * Maximum unread badge count before showing "99+".
 */
export const MAX_UNREAD_BADGE_COUNT = 99;

/**
 * ============================================================================
 * Toast Messages
 * ============================================================================
 */

export const NOTIFICATION_MESSAGES = {
  FETCH_ERROR: 'Failed to load notifications.',

  MARK_READ_SUCCESS: 'Notification marked as read.',

  MARK_READ_ERROR: 'Failed to mark notification as read.',

  MARK_ALL_READ_SUCCESS: 'All notifications marked as read.',

  MARK_ALL_READ_ERROR: 'Failed to mark all notifications as read.',

  RESTORE_SUCCESS: 'Notification restored successfully.',

  RESTORE_ERROR: 'Failed to restore notification.',
} as const;
