/**
 * ============================================================================
 * File: features/notifications/api/mark-all-read.ts
 * ============================================================================
 *
 * Mark All Notifications as Read API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Mark all unread notifications as read.
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
 * Mark All Notifications as Read
 * ============================================================================
 */

export async function markAllRead(): Promise<NotificationActionResponse> {
  const { data } = await nestjsClient.put<NotificationActionResponse>(
    NESTJS_ROUTES.NOTIFICATIONS.MARK_ALL_READ,
  );

  return data;
}
