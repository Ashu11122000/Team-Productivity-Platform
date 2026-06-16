'use client';

import {
  NotificationList,
} from '@/features/notifications/components/notification-list';

import {
  NotificationSkeleton,
} from '@/features/notifications/components/notification-skeleton';

import {
  useNotifications,
} from '@/features/notifications/hooks/use-notifications';

export default function NotificationsPage() {
  const {
    data,
    isLoading,
    isError,
  } = useNotifications();

  if (isLoading) {
    return <NotificationSkeleton />;
  }

  if (isError) {
    return (
      <div>
        Failed to load notifications.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Notifications
        </h1>

        <p className="text-muted-foreground">
          View and manage your notifications
        </p>
      </div>

      <NotificationList
        notifications={
          data?.data ?? []
        }
      />
    </div>
  );
}