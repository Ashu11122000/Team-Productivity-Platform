/**
 * ============================================================================
 * File: features/notifications/utils/notification.utils.ts
 * ============================================================================
 *
 * Notification Utilities
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Filter notifications.
 * - Sort notifications.
 * - Count unread notifications.
 * - Format notification timestamps.
 * - Provide reusable helper functions.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Pure utility functions only.
 * - No React hooks.
 * - No API calls.
 * - No state management.
 * ============================================================================
 */

import type { NotificationItem } from '../types/notification.types';

/**
 * ============================================================================
 * Sort Notifications
 * ============================================================================
 *
 * Sorts notifications from newest to oldest.
 */

export function sortNotifications(notifications: readonly NotificationItem[]): NotificationItem[] {
  return [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/**
 * ============================================================================
 * Get Unread Notifications
 * ============================================================================
 */

export function getUnreadNotifications(
  notifications: readonly NotificationItem[],
): NotificationItem[] {
  return notifications.filter((notification) => !notification.isRead);
}

/**
 * ============================================================================
 * Get Read Notifications
 * ============================================================================
 */

export function getReadNotifications(
  notifications: readonly NotificationItem[],
): NotificationItem[] {
  return notifications.filter((notification) => notification.isRead);
}

/**
 * ============================================================================
 * Count Unread Notifications
 * ============================================================================
 */

export function countUnreadNotifications(notifications: readonly NotificationItem[]): number {
  return notifications.reduce(
    (count, notification) => (notification.isRead ? count : count + 1),
    0,
  );
}

/**
 * ============================================================================
 * Check Unread Notifications
 * ============================================================================
 */

export function hasUnreadNotifications(notifications: readonly NotificationItem[]): boolean {
  return notifications.some((notification) => !notification.isRead);
}

/**
 * ============================================================================
 * Find Notification
 * ============================================================================
 */

export function findNotificationById(
  notifications: readonly NotificationItem[],
  id: string,
): NotificationItem | undefined {
  return notifications.find((notification) => notification.id === id);
}

/**
 * ============================================================================
 * Format Notification Date
 * ============================================================================
 */

export function formatNotificationDate(date: string, locale = 'en-IN'): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}
