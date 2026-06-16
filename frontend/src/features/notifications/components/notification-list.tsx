'use client';

import { Notification } from '../types/notification.types';

import { NotificationCard } from './notification-card';

interface Props {
  notifications: Notification[];
}

export function NotificationList({
  notifications,
}: Props) {
  if (!notifications.length) {
    return (
      <div className="rounded-lg border p-10 text-center">
        No notifications found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map(
        (notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
          />
        ),
      )}
    </div>
  );
}