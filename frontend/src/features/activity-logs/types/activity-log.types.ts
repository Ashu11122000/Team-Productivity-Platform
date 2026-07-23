/**
 * ============================================================================
 * File: features/activity-logs/types/activity-log.types.ts
 * ============================================================================
 *
 * Activity Log Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define activity log response contracts.
 * - Match NestJS Activity Logs API responses.
 * - Provide reusable frontend types.
 * ============================================================================
 */

/**
 * Single Activity Log
 */
export interface ActivityLog {
  id: string;

  /**
   * Event name
   *
   * Examples:
   * TASK_CREATED
   * TASK_UPDATED
   * CATEGORY_DELETED
   */
  action: string;

  /**
   * Human-readable activity description
   */
  description: string;

  /**
   * Related entity information
   */
  entityType?: string;

  entityId?: string;

  /**
   * User who performed the action
   */
  userId?: string;

  /**
   * Additional metadata
   *
   * Example:
   * {
   *   oldStatus: "TODO",
   *   newStatus: "DONE"
   * }
   */
  metadata?: Record<string, unknown>;

  /**
   * Timestamp
   */
  createdAt: string;
}

/**
 * Activity Logs API Response
 */
export interface ActivityLogsResponse {
  data: ActivityLog[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}

/**
 * Activity Log Query Parameters
 */
export interface ActivityLogQueryParams {
  page?: number;

  limit?: number;

  action?: string;

  entityType?: string;

  startDate?: string;

  endDate?: string;
}

/**
 * Activity Log Filter Options
 */
export interface ActivityLogFilters {
  action?: string;

  entityType?: string;

  dateRange?: {
    from?: string;
    to?: string;
  };
}
