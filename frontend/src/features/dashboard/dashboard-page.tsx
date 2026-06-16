'use client';

import { DashboardSkeleton } from '@/features/dashboard/components/dashboard-skeleton';
import { AnalyticsSummaryWidget } from '@/features/dashboard/components/analytics-summary-widget';
import { RecentNotesWidget } from '@/features/dashboard/components/recent-notes-widget';
import { RecentTasksWidget } from '@/features/dashboard/components/recent-tasks-widget';
import { UpcomingTasksWidget } from '@/features/dashboard/components/upcoming-tasks-widget';
import { NotificationsWidget } from '@/features/dashboard/components/notifications-widget';
import { ProfileWidget } from '@/features/dashboard/components/profile-widget';
import { HolidaysWidget } from '@/features/dashboard/components/holidays-widget';

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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <AnalyticsSummaryWidget
        analytics={analytics}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentNotesWidget
          notes={notes}
        />

        <RecentTasksWidget
          tasks={tasks}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingTasksWidget
          tasks={upcomingTasks}
        />

        <NotificationsWidget
          notifications={notifications}
        />
      </div>

      {/* Holidays Widget */}
      <div className="grid gap-6 lg:grid-cols-2">
        <HolidaysWidget />

        {profile ? (
          <ProfileWidget
            user={profile}
          />
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}