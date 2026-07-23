/**
 * ============================================================================
 * File: features/activity-logs/types/activity-log-query.types.ts
 * ============================================================================
 *
 * Activity Log Query Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define activity log filtering parameters.
 * - Define pagination options.
 * - Define sorting options.
 * - Match NestJS Activity Logs API query contracts.
 * ============================================================================
 */

/**
 * Activity log pagination parameters
 */
export interface ActivityLogPaginationParams {
  page?: number;

  limit?: number;
}

/**
 * Activity log filter parameters
 */
export interface ActivityLogFilterParams {
  /**
   * Filter by action/event type
   *
   * Examples:
   * TASK_CREATED
   * TASK_UPDATED
   * CATEGORY_DELETED
   */
  action?: string;

  /**
   * Filter by entity
   *
   * Examples:
   * TASK
   * CATEGORY
   * TAG
   */
  entityType?: string;

  /**
   * Filter by user
   */
  userId?: string;

  /**
   * Date range filtering
   */
  startDate?: string;

  endDate?: string;
}

/**
 * Activity log sorting parameters
 */
export interface ActivityLogSortParams {
  sortBy?: 'createdAt' | 'action';

  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Complete Activity Log Query Parameters
 */
export interface ActivityLogQueryParams
  extends ActivityLogPaginationParams, ActivityLogFilterParams, ActivityLogSortParams {}
