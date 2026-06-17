'use client';

import { AnalyticsSummaryWidget } from '@/features/dashboard/components/analytics-summary-widget';
import { DashboardSkeleton } from '@/features/dashboard/components/dashboard-skeleton';
import { HolidaysWidget } from '@/features/dashboard/components/holidays-widget';
import { NotificationsWidget } from '@/features/dashboard/components/notifications-widget';
import { ProfileWidget } from '@/features/dashboard/components/profile-widget';
import { RecentNotesWidget } from '@/features/dashboard/components/recent-notes-widget';
import { RecentTasksWidget } from '@/features/dashboard/components/recent-tasks-widget';
import { UpcomingTasksWidget } from '@/features/dashboard/components/upcoming-tasks-widget';

import { useDashboardData } from '@/features/dashboard/hooks/use-dashboard-data';

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
    <div className="flex min-h-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your productivity workspace.
          </p>
        </div>
      </div>

      <AnalyticsSummaryWidget analytics={analytics} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentNotesWidget notes={notes} />

        <RecentTasksWidget tasks={tasks} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingTasksWidget tasks={upcomingTasks} />

        <NotificationsWidget notifications={notifications} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <HolidaysWidget />

        {profile ? (
          <ProfileWidget user={profile} />
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" />
        )}
      </div>
    </div>
  );
}