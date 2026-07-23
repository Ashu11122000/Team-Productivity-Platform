'use client';

/**
 * ============================================================================
 * File: features/notifications/hooks/use-mark-all-read.ts
 * ============================================================================
 *
 * Mark All Notifications as Read Mutation Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Mark all notifications as read.
 * - Invalidate notification queries.
 * - Display success and error toast messages.
 * - Keep the UI synchronized with the backend.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Notifications are managed by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * ============================================================================
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { markAllRead } from '../api/mark-all-read';

import type { NotificationActionResponse } from '../types/notification.types';

import { NOTIFICATION_MESSAGES } from '../constants/notification.constants';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

/**
 * ============================================================================
 * Mark All Notifications Read Mutation
 * ============================================================================
 */

export function useMarkAllRead() {
  const queryClient = useQueryClient();

  return useMutation<NotificationActionResponse, Error, void>({
    mutationFn: markAllRead,

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.notifications,
      });

      toast.success(response.message ?? NOTIFICATION_MESSAGES.MARK_ALL_READ_SUCCESS);
    },

    onError: (error) => {
      toast.error(error.message ?? NOTIFICATION_MESSAGES.MARK_ALL_READ_ERROR);
    },
  });
}
