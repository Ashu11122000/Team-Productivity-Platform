'use client';

import { Button } from '@/components/ui/button';

import { Notification } from '../types/notification.types';

import {
  useNotificationRead,
} from '../hooks/use-notification-read';

interface NotificationCardProps {
  notification: Notification;
}

export function NotificationCard({
  notification,
}: NotificationCardProps) {
  const { mutate, isPending } =
    useNotificationRead();

  return (
    <div
      className={`rounded-lg border p-4 ${
        notification.isRead
          ? ''
          : 'border-primary'
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          {notification.title}
        </h3>

        {!notification.isRead && (
          <span className="text-xs rounded-full bg-blue-100 px-2 py-1">
            Unread
          </span>
        )}
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        {notification.message}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {new Date(
            notification.createdAt,
          ).toLocaleString()}
        </span>

        {!notification.isRead && (
          <Button
            size="sm"
            disabled={isPending}
            onClick={() =>
              mutate(notification.id)
            }
          >
            Mark Read
          </Button>
        )}
      </div>
    </div>
  );
}