/**
 * ============================================================================
 * File: activity-action.enum.ts
 * ============================================================================
 *
 * Activity Action Enumeration
 *
 * Responsibilities
 * ----------------
 * - Define all supported activity log actions.
 * - Standardize activity tracking across the application.
 * - Eliminate magic strings.
 * - Provide strongly typed activity events.
 *
 * NOTE
 * ----
 * These values are persisted in the database and may also be
 * consumed by analytics, audit logs, and notifications.
 *
 * Changing existing values may require a database migration.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM
 * - PostgreSQL
 * - TypeScript 5+
 * - Node.js 22+
 * ============================================================================
 */

/**
 * Supported activity actions.
 */
export enum ActivityAction {
  // ==========================================================================
  // Task Events
  // ==========================================================================

  TASK_CREATED = 'TASK_CREATED',

  TASK_UPDATED = 'TASK_UPDATED',

  TASK_DELETED = 'TASK_DELETED',

  // ==========================================================================
  // Category Events
  // ==========================================================================

  CATEGORY_CREATED = 'CATEGORY_CREATED',

  CATEGORY_UPDATED = 'CATEGORY_UPDATED',

  CATEGORY_DELETED = 'CATEGORY_DELETED',

  // ==========================================================================
  // Tag Events
  // ==========================================================================

  TAG_CREATED = 'TAG_CREATED',

  TAG_UPDATED = 'TAG_UPDATED',

  TAG_DELETED = 'TAG_DELETED',
}
