'use client';

import {
  Bell,
  BellRing,
  CheckCircle2,
  TriangleAlert,
} from 'lucide-react';

import {
  NotificationList,
} from '@/features/notifications/components/notification-list';

import {
  NotificationSkeleton,
} from '@/features/notifications/components/notification-skeleton';

import {
  useNotifications,
} from '@/features/notifications/hooks/use-notifications';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

export default function NotificationsPage() {
  const {
    data,
    isLoading,
    isError,
  } = useNotifications();

  const notifications =
    data?.data ?? [];

  const totalNotifications =
    notifications.length;

  const unreadNotifications =
    notifications.filter(
      (notification) =>
        !notification.isRead,
    ).length;

  const readNotifications =
    notifications.filter(
      (notification) =>
        notification.isRead,
    ).length;

  if (isLoading) {
    return <NotificationSkeleton />;
  }

  if (isError) {
    return (
      <div
        className="
          rounded-3xl
          border
          border-rose-500/20
          bg-rose-500/10
          p-10
          text-center
        "
      >
        <h2
          className="
            text-lg
            font-semibold
            text-rose-600
          "
        >
          Failed to load notifications
        </h2>

        <p
          className="
            mt-2
            text-sm
            text-slate-600
          "
        >
          Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="relative space-y-8">
      {/* Ambient Glows */}

      <div
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          h-72
          w-72
          rounded-full
          bg-cyan-400/20
          blur-[160px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-0
          top-0
          h-72
          w-72
          rounded-full
          bg-violet-400/20
          blur-[160px]
        "
      />

      {/* Hero */}

      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-white/20
          bg-white/70
          p-8
          shadow-lg
          backdrop-blur-xl
        "
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-cyan-500/10
                text-cyan-600
              "
            >
              <Bell className="h-7 w-7" />
            </div>

            <div>
              <h1
                className="
                  text-4xl
                  font-bold
                  tracking-tight
                  text-slate-900
                "
              >
                Notifications
              </h1>

              <p
                className="
                  mt-2
                  text-slate-600
                "
              >
                Stay updated with task changes,
                reminders and workspace activity.
              </p>
            </div>
          </div>
        </div>

        <div
          className="
            mt-6
            h-px
            bg-linear-to-r
            from-transparent
            via-cyan-500/70
            to-transparent
          "
        />
      </div>

      {/* KPI Cards */}

      <div
        className="
          grid
          gap-6
          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        <Card
          className="
            rounded-3xl
            border-white/20
            bg-white/70
            backdrop-blur-xl
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-xl
          "
        >
          <CardContent className="p-6">
            <Bell className="mb-4 h-6 w-6 text-indigo-600" />

            <div className="text-3xl font-bold">
              {totalNotifications}
            </div>

            <p className="text-sm text-slate-500">
              Total Notifications
            </p>
          </CardContent>
        </Card>

        <Card
          className="
            rounded-3xl
            border-white/20
            bg-white/70
            backdrop-blur-xl
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-xl
          "
        >
          <CardContent className="p-6">
            <BellRing className="mb-4 h-6 w-6 text-cyan-600" />

            <div className="text-3xl font-bold">
              {unreadNotifications}
            </div>

            <p className="text-sm text-slate-500">
              Unread
            </p>
          </CardContent>
        </Card>

        <Card
          className="
            rounded-3xl
            border-white/20
            bg-white/70
            backdrop-blur-xl
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-xl
          "
        >
          <CardContent className="p-6">
            <CheckCircle2 className="mb-4 h-6 w-6 text-emerald-600" />

            <div className="text-3xl font-bold">
              {readNotifications}
            </div>

            <p className="text-sm text-slate-500">
              Read
            </p>
          </CardContent>
        </Card>

        <Card
          className="
            rounded-3xl
            border-white/20
            bg-white/70
            backdrop-blur-xl
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-xl
          "
        >
          <CardContent className="p-6">
            <TriangleAlert className="mb-4 h-6 w-6 text-rose-600" />

            <div className="text-3xl font-bold">
              {unreadNotifications}
            </div>

            <p className="text-sm text-slate-500">
              Pending Attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}

      <NotificationList
        notifications={notifications}
      />
    </div>
  );
}