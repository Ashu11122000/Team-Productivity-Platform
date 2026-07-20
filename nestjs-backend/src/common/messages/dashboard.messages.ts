/**
 * ============================================================================
 * File: dashboard.messages.ts
 * ============================================================================
 *
 * Dashboard-related application messages.
 *
 * Responsibilities
 * ----------------
 * - Centralize dashboard messages.
 * - Standardize dashboard API responses.
 * - Support dashboard aggregation workflows.
 * - Support widgets and analytics.
 *
 * Used By
 * -------
 * - Dashboard Module
 * - Analytics Module
 * - Tasks Module
 * - Notifications Module
 * - Activity Logs Module
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM
 * - PostgreSQL
 * ============================================================================
 */

/**
 * ============================================================================
 * Dashboard Success Messages
 * ============================================================================
 */
export const DashboardSuccessMessages = {
  /**
   * Dashboard retrieval
   */
  FETCHED: 'Dashboard retrieved successfully.',

  LOADED: 'Dashboard loaded successfully.',

  /**
   * Widgets
   */
  WIDGETS_FETCHED: 'Dashboard widgets retrieved successfully.',

  WIDGET_CREATED: 'Dashboard widget created successfully.',

  WIDGET_UPDATED: 'Dashboard widget updated successfully.',

  WIDGET_REMOVED: 'Dashboard widget removed successfully.',

  /**
   * Statistics
   */
  STATISTICS_FETCHED: 'Dashboard statistics retrieved successfully.',

  SUMMARY_GENERATED: 'Dashboard summary generated successfully.',
} as const;

/**
 * ============================================================================
 * Dashboard Error Messages
 * ============================================================================
 */
export const DashboardErrorMessages = {
  /**
   * General
   */
  NOT_AVAILABLE: 'Dashboard is currently unavailable.',

  LOAD_FAILED: 'Unable to load dashboard.',

  GENERATION_FAILED: 'Unable to generate dashboard data.',

  /**
   * Widgets
   */
  WIDGET_NOT_FOUND: 'Dashboard widget not found.',

  INVALID_WIDGET: 'Invalid dashboard widget configuration.',

  WIDGET_LOAD_FAILED: 'Unable to load dashboard widget.',

  /**
   * Statistics
   */
  STATISTICS_FAILED: 'Unable to retrieve dashboard statistics.',

  AGGREGATION_FAILED: 'Unable to aggregate dashboard data.',

  /**
   * Permissions
   */
  ACCESS_DENIED: 'You do not have permission to access this dashboard.',
} as const;

/**
 * ============================================================================
 * Dashboard Validation Messages
 * ============================================================================
 */
export const DashboardValidationMessages = {
  INVALID_DATE_RANGE: 'Invalid dashboard date range.',

  INVALID_FILTER: 'Invalid dashboard filter.',

  INVALID_WIDGET_TYPE: 'Invalid dashboard widget type.',

  INVALID_VIEW: 'Invalid dashboard view.',
} as const;

/**
 * ============================================================================
 * Dashboard Widget Messages
 * ============================================================================
 *
 * Dashboard widget lifecycle messages.
 */
export const DashboardWidgetMessages = {
  TASK_SUMMARY: 'Task summary widget loaded.',

  TASK_PROGRESS: 'Task progress widget loaded.',

  NOTIFICATION_SUMMARY: 'Notification summary widget loaded.',

  ACTIVITY_SUMMARY: 'Activity summary widget loaded.',

  ANALYTICS_SUMMARY: 'Analytics summary widget loaded.',

  CALENDAR_SUMMARY: 'Calendar summary widget loaded.',
} as const;

/**
 * ============================================================================
 * Dashboard Data Source Messages
 * ============================================================================
 *
 * Used when dashboard aggregates multiple modules.
 */
export const DashboardDataSourceMessages = {
  TASK_DATA_FAILED: 'Unable to retrieve task data.',

  ANALYTICS_DATA_FAILED: 'Unable to retrieve analytics data.',

  NOTIFICATION_DATA_FAILED: 'Unable to retrieve notification data.',

  ACTIVITY_DATA_FAILED: 'Unable to retrieve activity data.',

  CALENDAR_DATA_FAILED: 'Unable to retrieve calendar data.',
} as const;

/**
 * ============================================================================
 * Dashboard Cache Messages
 * ============================================================================
 */
export const DashboardCacheMessages = {
  CACHE_HIT: 'Dashboard loaded from cache.',

  CACHE_MISS: 'Dashboard cache miss.',

  CACHE_STORE_FAILED: 'Unable to cache dashboard data.',

  CACHE_INVALIDATED: 'Dashboard cache invalidated successfully.',
} as const;

/**
 * ============================================================================
 * Dashboard Permission Messages
 * ============================================================================
 */
export const DashboardPermissionMessages = {
  VIEW_DENIED: 'You do not have permission to view dashboard data.',

  ADMIN_REQUIRED: 'Administrator access is required for this dashboard.',
} as const;
