/**
 * ============================================================================
 * File: features/notifications/api/get-notification-summary.ts
 * ============================================================================
 *
 * Get Notification Summary API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Retrieve notification summary information from NestJS backend.
 * - Keep API communication isolated from UI components.
 * - Return typed notification summary data.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Notifications are managed by the NestJS backend.
 * - Authentication is handled by FastAPI.
 * - Shared NestJS Axios client automatically attaches JWT.
 * ============================================================================
 */

import { NESTJS_ROUTES } from '@/lib/constants/api-routes';
import { nestjsClient } from '@/services/nestjs/client';

import type { NotificationSummaryResponse } from '../types/notification-summary.types';

/**
 * ============================================================================
 * Get Notification Summary
 * ============================================================================
 */

export async function getNotificationSummary(): Promise<NotificationSummaryResponse> {
  const { data } = await nestjsClient.get<NotificationSummaryResponse>(
    NESTJS_ROUTES.NOTIFICATIONS.SUMMARY,
  );

  return data;
}
