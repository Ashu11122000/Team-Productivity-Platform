import { create } from 'zustand';

/**
 * ============================================================================
 * Notification Types
 * ============================================================================
 */

export interface NotificationItem {
  id: string;

  title: string;

  message: string;

  type: string;

  isRead: boolean;

  createdAt: string;
}

/**
 * ============================================================================
 * Notification State
 * ============================================================================
 */

interface NotificationState {
  /**
   * Notifications
   */
  notifications: NotificationItem[];

  /**
   * Number of unread notifications.
   */
  unreadCount: number;

  /**
   * Loading state.
   */
  loading: boolean;

  /**
   * Replace notification list.
   */
  setNotifications: (notifications: NotificationItem[]) => void;

  /**
   * Add notification.
   */
  addNotification: (notification: NotificationItem) => void;

  /**
   * Mark notification as read.
   */
  markAsRead: (id: string) => void;

  /**
   * Mark every notification as read.
   */
  markAllAsRead: () => void;

  /**
   * Remove notification.
   */
  removeNotification: (id: string) => void;

  /**
   * Clear all notifications.
   */
  clearNotifications: () => void;

  /**
   * Update loading state.
   */
  setLoading: (loading: boolean) => void;
}

/**
 * ============================================================================
 * Helpers
 * ============================================================================
 */

function calculateUnreadCount(notifications: NotificationItem[]): number {
  return notifications.filter((notification) => !notification.isRead).length;
}

/**
 * ============================================================================
 * Store
 * ============================================================================
 */

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  unreadCount: 0,

  loading: false,

  /**
   * ------------------------------------------------------------------------
   * Replace Notifications
   * ------------------------------------------------------------------------
   */

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: calculateUnreadCount(notifications),
    }),

  /**
   * ------------------------------------------------------------------------
   * Add Notification
   * ------------------------------------------------------------------------
   */

  addNotification: (notification) =>
    set((state) => {
      const notifications = [notification, ...state.notifications];

      return {
        notifications,
        unreadCount: calculateUnreadCount(notifications),
      };
    }),

  /**
   * ------------------------------------------------------------------------
   * Mark As Read
   * ------------------------------------------------------------------------
   */

  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              isRead: true,
            }
          : notification,
      );

      return {
        notifications,
        unreadCount: calculateUnreadCount(notifications),
      };
    }),

  /**
   * ------------------------------------------------------------------------
   * Mark All As Read
   * ------------------------------------------------------------------------
   */

  markAllAsRead: () =>
    set((state) => {
      const notifications = state.notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }));

      return {
        notifications,
        unreadCount: 0,
      };
    }),

  /**
   * ------------------------------------------------------------------------
   * Remove Notification
   * ------------------------------------------------------------------------
   */

  removeNotification: (id) =>
    set((state) => {
      const notifications = state.notifications.filter((notification) => notification.id !== id);

      return {
        notifications,
        unreadCount: calculateUnreadCount(notifications),
      };
    }),

  /**
   * ------------------------------------------------------------------------
   * Clear Notifications
   * ------------------------------------------------------------------------
   */

  clearNotifications: () =>
    set({
      notifications: [],
      unreadCount: 0,
    }),

  /**
   * ------------------------------------------------------------------------
   * Loading
   * ------------------------------------------------------------------------
   */

  setLoading: (loading) =>
    set({
      loading,
    }),
}));
