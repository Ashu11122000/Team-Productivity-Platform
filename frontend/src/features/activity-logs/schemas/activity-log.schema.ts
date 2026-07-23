/**
 * ============================================================================
 * File: features/activity-logs/schemas/activity-log.schema.ts
 * ============================================================================
 *
 * Activity Log Zod Schemas
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Validate Activity Log API responses.
 * - Match NestJS Activity Logs response contracts.
 * - Provide runtime type safety.
 * ============================================================================
 */

import { z } from 'zod';

/**
 * Single Activity Log Schema
 */
export const activityLogSchema = z.object({
  id: z.string(),

  /**
   * Backend action/event name
   *
   * Examples:
   * TASK_CREATED
   * TASK_UPDATED
   * CATEGORY_DELETED
   */
  action: z.string(),

  /**
   * Human-readable description
   */
  description: z.string(),

  /**
   * Related entity information
   */
  entityType: z.string().optional(),

  entityId: z.string().optional(),

  /**
   * User who performed action
   */
  userId: z.string().optional(),

  /**
   * Additional event payload
   */
  metadata: z.record(z.string(), z.unknown()).optional(),

  createdAt: z.string(),
});

/**
 * Activity Logs List Response Schema
 */
export const activityLogsResponseSchema = z.object({
  data: z.array(activityLogSchema),

  total: z.number(),

  page: z.number(),

  limit: z.number(),

  totalPages: z.number(),
});

/**
 * Activity Log Query Response Type Helper
 */
export type ActivityLogSchema = z.infer<typeof activityLogSchema>;

export type ActivityLogsResponseSchema = z.infer<typeof activityLogsResponseSchema>;
