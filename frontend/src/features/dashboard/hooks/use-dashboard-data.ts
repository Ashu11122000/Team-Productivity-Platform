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
      },

      {
        queryKey: ['dashboard-notes'],
        queryFn: dashboardService.getRecentNotes,
      },

      {
        queryKey: ['dashboard-tasks'],
        queryFn: dashboardService.getRecentTasks,
      },

      {
        queryKey: ['dashboard-notifications'],
        queryFn: dashboardService.getNotifications,
      },

      {
        queryKey: ['dashboard-profile'],
        queryFn: dashboardService.getProfile,
      },

      {
        queryKey: ['dashboard-upcoming-tasks'],
        queryFn: dashboardService.getUpcomingTasks,
      },
    ],
  });

  return {
    analytics:
      results[0].data ??
      DEFAULT_ANALYTICS,

    notes:
      results[1].data ?? [],

    tasks:
      results[2].data ?? [],

    notifications:
      results[3].data ?? [],

    profile:
      results[4].data ?? null,

    upcomingTasks:
      results[5].data ?? [],

    isLoading: results.some(
      (query) => query.isLoading
    ),

    isError: results.some(
      (query) => query.isError
    ),
  };
}