'use client';

import Link from 'next/link';

import {
  Plus,
  FileText,
  CheckSquare,
  ArrowRight,
} from 'lucide-react';

import { AnalyticsSummaryWidget } from '@/features/dashboard/components/analytics-summary-widget';
import { DashboardSkeleton } from '@/features/dashboard/components/dashboard-skeleton';
import { HolidaysWidget } from '@/features/dashboard/components/holidays-widget';
import { NotificationsWidget } from '@/features/dashboard/components/notifications-widget';
import { ProfileWidget } from '@/features/dashboard/components/profile-widget';
import { RecentNotesWidget } from '@/features/dashboard/components/recent-notes-widget';
import { RecentTasksWidget } from '@/features/dashboard/components/recent-tasks-widget';
import { UpcomingTasksWidget } from '@/features/dashboard/components/upcoming-tasks-widget';

import { useDashboardData } from '@/features/dashboard/hooks/use-dashboard-data';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import {
  Button,
} from '@/components/ui/button';

export function DashboardPageContent() {
  const {
    analytics,
    notes,
    tasks,
    upcomingTasks,
    notifications,
    profile,
    isLoading,
  } = useDashboardData();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card
        className="
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-gradient-to-r
          from-indigo-600
          via-indigo-600
          to-indigo-700
          text-white
          shadow-sm
        "
      >
        <CardContent className="p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Welcome Back 👋
              </h1>

              <p className="mt-2 text-indigo-100">
                Manage tasks, notes, notifications and stay productive.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  asChild
                  variant="secondary"
                >
                  <Link href="/tasks/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Task
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="secondary"
                >
                  <Link href="/notes/new">
                    <FileText className="mr-2 h-4 w-4" />
                    Create Note
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-indigo-100">
                  Tasks
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {analytics?.totalTasks ?? 0}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-indigo-100">
                  Notes
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {notes.length}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-indigo-100">
                  Alerts
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {notifications.length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <AnalyticsSummaryWidget
        analytics={analytics}
      />

      {/* Main Content */}
      <div className="grid gap-6 xl:grid-cols-2">
        <RecentNotesWidget
          notes={notes}
        />

        <RecentTasksWidget
          tasks={tasks}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <UpcomingTasksWidget
          tasks={upcomingTasks}
        />

        <NotificationsWidget
          notifications={
            notifications
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <HolidaysWidget />

        {profile ? (
          <ProfileWidget
            user={profile}
          />
        ) : (
          <Card
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >
            <CardContent className="flex h-full items-center justify-center p-8">
              <div className="text-center">
                <p className="font-medium text-slate-700">
                  Profile unavailable
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Unable to load user information.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Quick Actions
            </h2>

            <p className="text-sm text-slate-500">
              Jump directly to your most-used features.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              asChild
              variant="outline"
              className="justify-between"
            >
              <Link href="/tasks">
                Tasks

                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="justify-between"
            >
              <Link href="/notes">
                Notes

                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="justify-between"
            >
              <Link href="/notifications">
                Notifications

                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="justify-between"
            >
              <Link href="/settings">
                Settings

                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}