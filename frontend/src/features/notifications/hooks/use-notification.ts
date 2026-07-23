'use client';

/**
 * ============================================================================
 * File: features/notifications/hooks/use-notification.ts
 * ============================================================================
 *
 * Notification Query Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Retrieve a single notification by its identifier.
 * - Cache notification data using TanStack Query.
 * - Avoid unnecessary requests when no identifier is provided.
 * ============================================================================
 */

import { useQuery } from '@tanstack/react-query';

import { getNotification } from '../api/get-notification';

import type { NotificationItem } from '../types/notification.types';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

export interface UseNotificationOptions {
  readonly enabled?: boolean;
}

const NOTIFICATION_STALE_TIME = 5 * 60 * 1000;

const NOTIFICATION_GC_TIME = 30 * 60 * 1000;

export function useNotification(id: string, options: UseNotificationOptions = {}) {
  const { enabled = true } = options;

  return useQuery<NotificationItem>({
    queryKey: [...QUERY_KEYS.notifications, id],

    queryFn: () => getNotification(id),

    enabled: enabled && Boolean(id),

    staleTime: NOTIFICATION_STALE_TIME,

    gcTime: NOTIFICATION_GC_TIME,

    retry: 1,

    refetchOnWindowFocus: false,
  });
}
