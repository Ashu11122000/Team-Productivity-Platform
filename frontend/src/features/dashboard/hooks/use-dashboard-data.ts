import { useQueries } from '@tanstack/react-query';

import { dashboardService } from '../services/dashboard.service';

const DEFAULT_ANALYTICS = {
  totalTasks: 0,
  completedTasks: 0,
  pendingTasks: 0,
  totalCategories: 0,
  totalNotifications: 0,
};

export function useDashboardData() {
  const results = useQueries({
    queries: [
      {
        queryKey: ['dashboard-analytics'],
        queryFn: dashboardService.getAnalytics,
        staleTime: 1000 * 60 * 5,
      },

      {
        queryKey: ['dashboard-notes'],
        queryFn: dashboardService.getRecentNotes,
        staleTime: 1000 * 60 * 2,
      },

      {
        queryKey: ['dashboard-tasks'],
        queryFn: dashboardService.getRecentTasks,
        staleTime: 1000 * 60 * 2,
      },

      {
        queryKey: ['dashboard-notifications'],
        queryFn: dashboardService.getNotifications,
        staleTime: 1000 * 60,
      },

      {
        queryKey: ['dashboard-profile'],
        queryFn: dashboardService.getProfile,
        staleTime: 1000 * 60 * 10,
      },

      {
        queryKey: ['dashboard-upcoming-tasks'],
        queryFn: dashboardService.getUpcomingTasks,
        staleTime: 1000 * 60,
      },
    ],
  });

  const analytics =
    results[0].data ?? DEFAULT_ANALYTICS;

  const notes =
    results[1].data ?? [];

  const tasks =
    results[2].data ?? [];

  const notifications =
    results[3].data ?? [];

  const profile =
    results[4].data ?? null;

  const upcomingTasks =
    results[5].data ?? [];

  return {
    analytics,

    notes,

    tasks,

    notifications,

    profile,

    upcomingTasks,

    notificationCount:
      notifications.length,

    recentNotesCount:
      notes.length,

    recentTasksCount:
      tasks.length,

    completedTaskPercentage:
      analytics.totalTasks > 0
        ? Math.round(
            (analytics.completedTasks /
              analytics.totalTasks) *
              100
          )
        : 0,

    pendingTaskPercentage:
      analytics.totalTasks > 0
        ? Math.round(
            (analytics.pendingTasks /
              analytics.totalTasks) *
              100
          )
        : 0,

    isLoading: results.some(
      (query) => query.isLoading
    ),

    isFetching: results.some(
      (query) => query.isFetching
    ),

    isError: results.some(
      (query) => query.isError
    ),

    refetchAll: () =>
      Promise.all(
        results.map((query) =>
          query.refetch()
        )
      ),
  };
}