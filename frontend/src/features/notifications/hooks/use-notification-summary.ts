/**
 * ============================================================================
 * File: features/notifications/hooks/use-notification-summary.ts
 * ============================================================================
 *
 * Notification Summary Query Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Fetch notification summary from NestJS backend.
 * - Cache summary data using TanStack Query.
 * - Avoid unnecessary requests.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Notifications are managed by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * ============================================================================
 */

'use client';

import { useQuery } from '@tanstack/react-query';

import { getNotificationSummary } from '../api/get-notification-summary';

import type { NotificationSummaryResponse } from '../types/notification-summary.types';

import {
  NOTIFICATIONS_GC_TIME,
  NOTIFICATIONS_STALE_TIME,
} from '../constants/notification.constants';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

/**
 * ============================================================================
 * Notification Summary Query
 * ============================================================================
 */

export function useNotificationSummary() {
  return useQuery<NotificationSummaryResponse>({
    queryKey: QUERY_KEYS.notificationSummary,

    queryFn: getNotificationSummary,

    staleTime: NOTIFICATIONS_STALE_TIME,

    gcTime: NOTIFICATIONS_GC_TIME,

    retry: 1,

    refetchOnWindowFocus: false,
  });
}
