/**
 * ============================================================================
 * File: analytics-overview.interface.ts
 * ============================================================================
 *
 * Internal analytics overview contract.
 *
 * Used by:
 *
 * AnalyticsRepository
 *        |
 *        ▼
 * AnalyticsService
 *
 * ============================================================================
 */

export interface AnalyticsOverview {
  totalTasks: number;

  completedTasks: number;

  pendingTasks: number;

  completionRate: number;

  totalCategories: number;

  totalTags: number;

  totalNotifications: number;
}
