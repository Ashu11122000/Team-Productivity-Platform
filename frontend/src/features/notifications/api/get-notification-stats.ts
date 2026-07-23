/**
 * ============================================================================
 * File: features/notifications/api/get-notification-stats.ts
 * ============================================================================
 *
 * Get Notification Statistics API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Retrieve notification statistics from NestJS backend.
 * - Keep API communication isolated from UI components.
 * - Return strongly typed notification statistics data.
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

import type { NotificationStatsResponse } from '../types/notification-stats.types';

/**
 * ============================================================================
 * Get Notification Statistics
 * ============================================================================
 */

export async function getNotificationStats(): Promise<NotificationStatsResponse> {
  const { data } = await nestjsClient.get<NotificationStatsResponse>(
    NESTJS_ROUTES.NOTIFICATIONS.STATS,
  );

  return data;
}
