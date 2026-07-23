/**
 * ============================================================================
 * File: features/notifications/hooks/use-notification-stats.ts
 * ============================================================================
 *
 * Notification Statistics Query Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Fetch notification statistics from NestJS backend.
 * - Cache statistics using TanStack Query.
 * - Prevent unnecessary refetching.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Notifications are managed by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * ============================================================================
 */

'use client';

import { useQuery } from '@tanstack/react-query';

import { getNotificationStats } from '../api/get-notification-stats';

import type { NotificationStatsResponse } from '../types/notification-stats.types';

import {
  NOTIFICATIONS_GC_TIME,
  NOTIFICATIONS_STALE_TIME,
} from '../constants/notification.constants';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

/**
 * ============================================================================
 * Notification Statistics Query
 * ============================================================================
 */

export function useNotificationStats() {
  return useQuery<NotificationStatsResponse>({
    queryKey: QUERY_KEYS.notificationStats,

    queryFn: getNotificationStats,

    staleTime: NOTIFICATIONS_STALE_TIME,

    gcTime: NOTIFICATIONS_GC_TIME,

    retry: 1,

    refetchOnWindowFocus: false,
  });
}
