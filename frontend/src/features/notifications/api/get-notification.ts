/**
 * ============================================================================
 * File: features/notifications/api/get-notification.ts
 * ============================================================================
 *
 * Get Notification API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Retrieve a single notification from the NestJS backend.
 * - Return the notification payload.
 * - Keep the frontend aligned with the NestJS API contract.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Notifications are managed by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * - The shared NestJS Axios client automatically attaches the JWT.
 * ============================================================================
 */

import { NESTJS_ROUTES } from '@/lib/constants/api-routes';
import { nestjsClient } from '@/services/nestjs/client';

import type { NotificationItem, NotificationResponse } from '../types/notification.types';

/**
 * ============================================================================
 * Get Notification
 * ============================================================================
 */

export async function getNotification(id: string): Promise<NotificationItem> {
  const { data } = await nestjsClient.get<NotificationResponse>(
    NESTJS_ROUTES.NOTIFICATIONS.BY_ID(id),
  );

  return data.data;
}
