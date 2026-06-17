import { create } from 'zustand';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;

  setNotifications: (
    notifications: NotificationItem[],
  ) => void;

  addNotification: (
    notification: NotificationItem,
  ) => void;

  markAsRead: (
    id: string,
  ) => void;

  markAllAsRead: () => void;

  removeNotification: (
    id: string,
  ) => void;

  clearNotifications: () => void;
}

export const useNotificationStore =
  create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,

    setNotifications: (
      notifications,
    ) =>
      set({
        notifications,
        unreadCount:
          notifications.filter(
            (notification) =>
              !notification.isRead,
          ).length,
      }),

    addNotification: (
      notification,
    ) =>
      set((state) => ({
        notifications: [
          notification,
          ...state.notifications,
        ],
        unreadCount:
          state.unreadCount +
          (notification.isRead
            ? 0
            : 1),
      })),

    markAsRead: (id) =>
      set((state) => {
        const notifications =
          state.notifications.map(
            (notification) =>
              notification.id === id
                ? {
                    ...notification,
                    isRead: true,
                  }
                : notification,
          );

        return {
          notifications,
          unreadCount:
            notifications.filter(
              (notification) =>
                !notification.isRead,
            ).length,
        };
      }),

    markAllAsRead: () =>
      set((state) => ({
        notifications:
          state.notifications.map(
            (notification) => ({
              ...notification,
              isRead: true,
            }),
          ),
        unreadCount: 0,
      })),

    removeNotification: (
      id,
    ) =>
      set((state) => {
        const notifications =
          state.notifications.filter(
            (notification) =>
              notification.id !== id,
          );

        return {
          notifications,
          unreadCount:
            notifications.filter(
              (notification) =>
                !notification.isRead,
            ).length,
        };
      }),

    clearNotifications: () =>
      set({
        notifications: [],
        unreadCount: 0,
      }),
  }));