'use client';

import { Bell, CheckCircle2 } from 'lucide-react';

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
  const {
    mutate,
    isPending,
  } = useNotificationRead();

  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        bg-white/70
        backdrop-blur-xl
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        ${
          notification.isRead
            ? 'border-white/20'
            : 'border-cyan-500/30'
        }
      `}
    >
      {!notification.isRead && (
        <div
          className="
            absolute
            inset-x-0
            top-0
            h-1
            bg-linear-to-r
            from-cyan-500
            via-indigo-500
            to-violet-500
          "
        />
      )}

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-cyan-500/10
                text-cyan-600
              "
            >
              <Bell className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <h3
                className="
                  truncate
                  text-sm
                  font-semibold
                  text-slate-900
                "
              >
                {notification.title}
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  leading-relaxed
                  text-slate-600
                "
              >
                {notification.message}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {notification.isRead ? (
              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  border
                  border-emerald-500/20
                  bg-emerald-500/10
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-emerald-600
                "
              >
                <CheckCircle2 className="h-3 w-3" />
                Read
              </span>
            ) : (
              <span
                className="
                  inline-flex
                  items-center
                  rounded-full
                  border
                  border-cyan-500/20
                  bg-cyan-500/10
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-cyan-600
                "
              >
                Unread
              </span>
            )}
          </div>
        </div>

        <div
          className="
            my-5
            h-px
            bg-linear-to-r
            from-transparent
            via-cyan-500/70
            to-transparent
          "
        />

        <div className="flex items-center justify-between gap-4">
          <span
            className="
              text-xs
              font-medium
              text-slate-500
            "
          >
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
              className="
                rounded-2xl
                bg-linear-to-r
                from-indigo-500
                via-violet-500
                to-cyan-500
                text-white
                shadow-lg
                hover:opacity-90
              "
            >
              {isPending
                ? 'Updating...'
                : 'Mark Read'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}