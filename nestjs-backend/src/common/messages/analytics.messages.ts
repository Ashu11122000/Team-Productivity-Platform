/**
 * ============================================================================
 * File: analytics.messages.ts
 * ============================================================================
 *
 * Analytics-related application messages.
 *
 * Responsibilities
 * ----------------
 * - Centralize analytics messages.
 * - Standardize analytics responses.
 * - Support metric generation.
 * - Support dashboard/reporting workflows.
 *
 * Used By
 * -------
 * - Analytics Module
 * - Dashboard Module
 * - Reports
 * - Background Jobs
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
 * Analytics Success Messages
 * ============================================================================
 */
export const AnalyticsSuccessMessages = {
  /**
   * Analytics retrieval
   */
  FETCHED: 'Analytics data retrieved successfully.',

  SUMMARY_FETCHED: 'Analytics summary retrieved successfully.',

  REPORT_GENERATED: 'Analytics report generated successfully.',

  /**
   * Metrics
   */
  METRICS_CALCULATED: 'Analytics metrics calculated successfully.',

  STATISTICS_GENERATED: 'Analytics statistics generated successfully.',

  /**
   * Export
   */
  EXPORT_STARTED: 'Analytics export started successfully.',

  EXPORT_COMPLETED: 'Analytics export completed successfully.',
} as const;

/**
 * ============================================================================
 * Analytics Error Messages
 * ============================================================================
 */
export const AnalyticsErrorMessages = {
  /**
   * General
   */
  NOT_AVAILABLE: 'Analytics data is currently unavailable.',

  FETCH_FAILED: 'Unable to retrieve analytics data.',

  GENERATION_FAILED: 'Unable to generate analytics data.',

  /**
   * Metrics
   */
  METRIC_CALCULATION_FAILED: 'Unable to calculate analytics metrics.',

  INVALID_METRIC: 'Invalid analytics metric requested.',

  /**
   * Reports
   */
  REPORT_FAILED: 'Unable to generate analytics report.',

  REPORT_NOT_FOUND: 'Analytics report not found.',

  /**
   * Permissions
   */
  ACCESS_DENIED: 'You do not have permission to access analytics data.',
} as const;

/**
 * ============================================================================
 * Analytics Validation Messages
 * ============================================================================
 */
export const AnalyticsValidationMessages = {
  INVALID_DATE_RANGE: 'Invalid analytics date range.',

  START_DATE_REQUIRED: 'Analytics start date is required.',

  END_DATE_REQUIRED: 'Analytics end date is required.',

  INVALID_PERIOD: 'Invalid analytics period.',

  INVALID_FILTER: 'Invalid analytics filter.',
} as const;

/**
 * ============================================================================
 * Analytics Metric Messages
 * ============================================================================
 *
 * Used for common productivity metrics.
 */
export const AnalyticsMetricMessages = {
  TASK_COMPLETION_RATE: 'Task completion rate calculated successfully.',

  TASK_PRODUCTIVITY: 'Task productivity calculated successfully.',

  USER_ACTIVITY: 'User activity calculated successfully.',

  CATEGORY_DISTRIBUTION: 'Category distribution calculated successfully.',

  TAG_USAGE: 'Tag usage statistics calculated successfully.',

  NOTIFICATION_ACTIVITY: 'Notification activity calculated successfully.',
} as const;

/**
 * ============================================================================
 * Analytics Data Source Messages
 * ============================================================================
 *
 * Used when analytics aggregates multiple modules.
 */
export const AnalyticsDataSourceMessages = {
  TASK_DATA_FAILED: 'Unable to retrieve task data for analytics.',

  CATEGORY_DATA_FAILED: 'Unable to retrieve category data for analytics.',

  TAG_DATA_FAILED: 'Unable to retrieve tag data for analytics.',

  USER_DATA_FAILED: 'Unable to retrieve user data for analytics.',

  ACTIVITY_DATA_FAILED: 'Unable to retrieve activity data for analytics.',
} as const;

/**
 * ============================================================================
 * Analytics Cache Messages
 * ============================================================================
 */
export const AnalyticsCacheMessages = {
  CACHE_HIT: 'Analytics data loaded from cache.',

  CACHE_MISS: 'Analytics cache miss.',

  CACHE_STORE_FAILED: 'Unable to cache analytics data.',

  CACHE_INVALIDATED: 'Analytics cache invalidated successfully.',
} as const;

/**
 * ============================================================================
 * Analytics Export Messages
 * ============================================================================
 */
export const AnalyticsExportMessages = {
  INVALID_FORMAT: 'Invalid analytics export format.',

  EXPORT_FAILED: 'Analytics export failed.',

  FILE_GENERATION_FAILED: 'Unable to generate analytics export file.',

  FILE_READY: 'Analytics export file is ready.',
} as const;

/**
 * ============================================================================
 * Analytics Scheduler Messages
 * ============================================================================
 *
 * Used by scheduled analytics jobs.
 */
export const AnalyticsSchedulerMessages = {
  JOB_STARTED: 'Analytics calculation job started.',

  JOB_COMPLETED: 'Analytics calculation job completed.',

  JOB_FAILED: 'Analytics calculation job failed.',

  CACHE_REFRESHED: 'Analytics cache refreshed successfully.',
} as const;
