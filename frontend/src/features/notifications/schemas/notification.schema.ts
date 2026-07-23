/**
 * ============================================================================
 * File: features/notifications/schemas/notification.schema.ts
 * ============================================================================
 *
 * Notification Validation Schemas
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Validate notification responses from the NestJS backend.
 * - Mirror the notification DTOs.
 * - Provide strongly typed notification models.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Notifications are fully owned by the NestJS backend.
 * - Used for runtime validation of API responses.
 * ============================================================================
 */

import { z } from 'zod';

/**
 * ============================================================================
 * Notification Schema
 * ============================================================================
 */

export const notificationSchema = z.object({
  id: z.string().uuid(),

  title: z
    .string()
    .min(1, 'Notification title is required')
    .max(255, 'Notification title must not exceed 255 characters'),

  message: z.string().min(1, 'Notification message is required'),

  isRead: z.boolean(),

  createdAt: z.string().datetime(),

  updatedAt: z.string().datetime().nullable().optional(),
});

/**
 * ============================================================================
 * Notifications Response Schema
 * ============================================================================
 */

export const notificationsResponseSchema = z.object({
  success: z.boolean(),

  data: z.array(notificationSchema),
});

/**
 * ============================================================================
 * Notification Response Schema
 * ============================================================================
 */

export const notificationResponseSchema = z.object({
  success: z.boolean(),

  data: notificationSchema,
});

/**
 * ============================================================================
 * Notification Action Response Schema
 * ============================================================================
 */

export const notificationActionResponseSchema = z.object({
  success: z.boolean(),

  message: z.string(),
});

/**
 * ============================================================================
 * Schema Types
 * ============================================================================
 */

export type NotificationSchema = z.infer<typeof notificationSchema>;

export type NotificationsResponseSchema = z.infer<typeof notificationsResponseSchema>;

export type NotificationResponseSchema = z.infer<typeof notificationResponseSchema>;

export type NotificationActionResponseSchema = z.infer<typeof notificationActionResponseSchema>;
