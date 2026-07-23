/**
 * ============================================================================
 * File: features/notifications/api/get-notifications.ts
 * ============================================================================
 *
 * Get Notifications API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Retrieve all notifications from the NestJS backend.
 * - Return the notification collection.
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

import type { NotificationItem, NotificationsResponse } from '../types/notification.types';

/**
 * ============================================================================
 * Get Notifications
 * ============================================================================
 */

export async function getNotifications(): Promise<readonly NotificationItem[]> {
  const { data } = await nestjsClient.get<NotificationsResponse>(NESTJS_ROUTES.NOTIFICATIONS.BASE);

  return data.data;
}
