/**
 * ============================================================================
 * File: features/notifications/api/mark-notification-read.ts
 * ============================================================================
 *
 * Mark Notification as Read API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Mark a single notification as read.
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

import type { NotificationActionResponse } from '../types/notification.types';

/**
 * ============================================================================
 * Mark Notification as Read
 * ============================================================================
 */

export async function markNotificationRead(id: string): Promise<NotificationActionResponse> {
  const { data } = await nestjsClient.put<NotificationActionResponse>(
    NESTJS_ROUTES.NOTIFICATIONS.MARK_READ(id),
  );

  return data;
}
