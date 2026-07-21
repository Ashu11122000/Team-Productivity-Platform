/*
 * ============================================================================
 * File: activity.type.ts
 * ============================================================================
 *
 * External Activity Integration Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define activity log contracts for integrations.
 * - Represent audit/activity information exchanged between services.
 * - Provide reusable activity types.
 *
 * Used By:
 * ----------------------------------------------------------------------------
 * - Activity Logs module
 * - Analytics integrations
 * - Audit systems
 * - External event pipelines
 *
 * Does NOT:
 * ----------------------------------------------------------------------------
 * - Replace ActivityLog entity.
 * - Access database.
 * - Create activity records.
 *
 * ============================================================================
 */

// ============================================================================
// Activity Action
// ============================================================================

export type ActivityAction =
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_DELETED'
  | 'CATEGORY_CREATED'
  | 'CATEGORY_UPDATED'
  | 'CATEGORY_DELETED'
  | 'TAG_CREATED'
  | 'TAG_UPDATED'
  | 'TAG_DELETED';

// ============================================================================
// Activity Entity Type
// ============================================================================

export type ActivityEntityType = 'TASK' | 'CATEGORY' | 'TAG';

// ============================================================================
// Activity Metadata
// ============================================================================

export interface ActivityMetadata {
  /**
   * Previous value before update.
   */
  oldValue?: unknown;

  /**
   * New value after update.
   */
  newValue?: unknown;

  /**
   * Additional event information.
   */
  details?: Record<string, unknown>;
}

// ============================================================================
// Activity Integration Contract
// ============================================================================

export interface ActivityType {
  /**
   * Activity identifier.
   */
  id?: string;

  /**
   * Action performed.
   */
  action: ActivityAction;

  /**
   * Entity affected.
   */
  entityType: ActivityEntityType;

  /**
   * Entity identifier.
   */
  entityId: string;

  /**
   * User who performed action.
   *
   * Owned by FastAPI.
   */
  userId: string;

  /**
   * Additional event data.
   */
  metadata?: ActivityMetadata;

  /**
   * Creation timestamp.
   */
  createdAt?: string;
}
