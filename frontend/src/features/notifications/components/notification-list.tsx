'use client';

import { BellOff } from 'lucide-react';

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
      <div
        className="
          rounded-3xl
          border
          border-white/20
          bg-white/70
          p-12
          text-center
          shadow-lg
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-cyan-500/10
            text-cyan-600
          "
        >
          <BellOff className="h-8 w-8" />
        </div>

        <h3
          className="
            mt-6
            text-lg
            font-semibold
            text-slate-900
          "
        >
          No notifications found
        </h3>

        <p
          className="
            mt-2
            text-sm
            text-slate-600
          "
        >
          You&apos;re all caught up.
          New notifications will appear here.
        </p>

        <div
          className="
            mx-auto
            mt-6
            h-px
            w-48
            bg-linear-to-r
            from-transparent
            via-cyan-500/70
            to-transparent
          "
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
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