/**
 * ============================================================================
 * File: features/notifications/api/restore-notification.ts
 * ============================================================================
 *
 * Restore Notification API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Restore a deleted notification.
 * - Communicate with NestJS notification endpoint.
 * - Return typed action response.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Notifications are managed by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * - Shared NestJS Axios client automatically attaches JWT.
 * ============================================================================
 */

import { NESTJS_ROUTES } from '@/lib/constants/api-routes';
import { nestjsClient } from '@/services/nestjs/client';

import type {
  NotificationActionResponse,
} from '../types/notification.types';


/**
 * ============================================================================
 * Restore Notification
 * ============================================================================
 */

export async function restoreNotification(
  id: string,
): Promise<NotificationActionResponse> {
  const { data } =
    await nestjsClient.patch<NotificationActionResponse>(
      NESTJS_ROUTES.NOTIFICATIONS.RESTORE(id),
    );

  return data;
}