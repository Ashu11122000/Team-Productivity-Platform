'use client';

import Link from 'next/link';

import {
  Bell,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Button,
} from '@/components/ui/button';

import { Notification } from '@/features/notifications/types/notification.types';

interface Props {
  notifications: Notification[];
}

export function NotificationsWidget({
  notifications,
}: Props) {
  const recentNotifications =
    notifications.slice(0, 5);

  return (
    <Card
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-md
      "
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-600" />

              Notifications

              <Badge
                variant="secondary"
                className="
                  rounded-full
                  bg-indigo-100
                  text-indigo-700
                "
              >
                {notifications.length}
              </Badge>
            </CardTitle>

            <CardDescription>
              Recent updates and activity
            </CardDescription>
          </div>

          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link href="/notifications">
              View All

              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {recentNotifications.length ===
        0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <Bell className="mb-4 h-10 w-10 text-slate-300" />

            <p className="font-medium text-slate-700">
              No Notifications
            </p>

            <p className="mt-1 text-sm text-slate-500">
              You&apos;re all caught up.
            </p>

            <Button
              variant="outline"
              className="mt-5"
              asChild
            >
              <Link href="/notifications">
                View Notifications
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentNotifications.map(
              (notification) => (
                <div
                  key={
                    notification.id
                  }
                  className="
                    rounded-2xl
                    border
                    border-slate-100
                    p-4
                    transition-colors
                    hover:bg-slate-50
                  "
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-indigo-600" />

                        <p className="truncate font-medium text-slate-900">
                          {
                            notification.title
                          }
                        </p>
                      </div>

                      <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                        {
                          notification.message
                        }
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      asChild
                    >
                      <Link
                        href="/notifications"
                      >
                        Open
                      </Link>
                    </Button>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}