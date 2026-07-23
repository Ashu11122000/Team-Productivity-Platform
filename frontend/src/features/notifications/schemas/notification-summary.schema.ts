/**
 * ============================================================================
 * File: features/notifications/schemas/notification-summary.schema.ts
 * ============================================================================
 *
 * Notification Summary Schema
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Validate notification summary API responses.
 * - Provide runtime type safety.
 * - Keep frontend contracts aligned with NestJS DTO responses.
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
 * Notification Summary Schema
 * ============================================================================
 */

export const notificationSummarySchema = z.object({
  total: z.number(),

  unread: z.number(),

  read: z.number(),
});

/**
 * ============================================================================
 * Notification Summary Response Schema
 * ============================================================================
 */

export const notificationSummaryResponseSchema = z.object({
  success: z.boolean(),

  message: z.string().optional(),

  data: notificationSummarySchema,
});

/**
 * ============================================================================
 * Inferred Types
 * ============================================================================
 */

export type NotificationSummarySchema = z.infer<typeof notificationSummarySchema>;

export type NotificationSummaryResponseSchema = z.infer<typeof notificationSummaryResponseSchema>;
