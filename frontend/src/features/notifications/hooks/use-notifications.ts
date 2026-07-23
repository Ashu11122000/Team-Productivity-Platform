'use client';

/**
 * ============================================================================
 * File: features/notifications/hooks/use-notifications.ts
 * ============================================================================
 *
 * Notifications Query Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Retrieve notifications from the NestJS backend.
 * - Cache notifications using TanStack Query.
 * - Optimize notification fetching with sensible cache settings.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Notifications are managed by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * ============================================================================
 */

import { useQuery } from '@tanstack/react-query';

import { getNotifications } from '../api/get-notifications';
import type { NotificationItem } from '../types/notification.types';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

/**
 * ============================================================================
 * Cache Configuration
 * ============================================================================
 */

export const NOTIFICATIONS_STALE_TIME = 5 * 60 * 1000;

export const NOTIFICATIONS_GC_TIME = 30 * 60 * 1000;

/**
 * ============================================================================
 * Notifications Query
 * ============================================================================
 */

export function useNotifications() {
  return useQuery<readonly NotificationItem[]>({
    queryKey: QUERY_KEYS.notifications,

    queryFn: getNotifications,

    staleTime: NOTIFICATIONS_STALE_TIME,

    gcTime: NOTIFICATIONS_GC_TIME,

    retry: 1,

    refetchOnWindowFocus: false,
  });
}
