/**
 * ============================================================================
 * File: features/notifications/schemas/notification-stats.schema.ts
 * ============================================================================
 *
 * Notification Statistics Schema
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Validate notification statistics API responses.
 * - Provide runtime type safety.
 * - Keep frontend contracts aligned with NestJS DTOs.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Uses Zod for runtime validation.
 * - Notifications are managed by the NestJS backend.
 * ============================================================================
 */

import { z } from 'zod';

/**
 * ============================================================================
 * Notification Statistics Schema
 * ============================================================================
 */

export const notificationStatsSchema = z.object({
  /**
   * Total notifications count.
   */
  total: z.number(),

  /**
   * Read notifications count.
   */
  read: z.number(),

  /**
   * Unread notifications count.
   */
  unread: z.number(),

  /**
   * Percentage of read notifications.
   */
  readPercentage: z.number(),

  /**
   * Percentage of unread notifications.
   */
  unreadPercentage: z.number(),
});

/**
 * ============================================================================
 * Notification Statistics Response Schema
 * ============================================================================
 */

export const notificationStatsResponseSchema = z.object({
  success: z.boolean(),

  message: z.string().optional(),

  data: notificationStatsSchema,
});

/**
 * ============================================================================
 * Inferred Types
 * ============================================================================
 */

export type NotificationStatsSchema = z.infer<typeof notificationStatsSchema>;

export type NotificationStatsResponseSchema = z.infer<typeof notificationStatsResponseSchema>;
