'use client';

/**
 * ============================================================================
 * File: features/notifications/hooks/use-notification-read.ts
 * ============================================================================
 *
 * Mark Notification as Read Mutation Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Mark a notification as read via the NestJS backend.
 * - Invalidate cached notification queries.
 * - Display success and error notifications.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Notifications are managed by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * ============================================================================
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { markNotificationRead } from '../api/mark-notification-read';

import type { NotificationActionResponse } from '../types/notification.types';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

/**
 * ============================================================================
 * Mark Notification as Read Mutation
 * ============================================================================
 */

export function useNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation<NotificationActionResponse, Error, string>({
    mutationFn: markNotificationRead,

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.notifications,
      });

      toast.success(response.message ?? 'Notification marked as read.');
    },

    onError: (error) => {
      toast.error(error.message ?? 'Failed to mark notification as read.');
    },
  });
}
