/**
 * ============================================================================
 * File: features/notifications/hooks/use-restore-notification.ts
 * ============================================================================
 *
 * Restore Notification Mutation Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Restore a deleted notification.
 * - Invalidate notification queries.
 * - Keep UI synchronized with backend state.
 * - Display success and error notifications.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Notifications are managed by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * ============================================================================
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { restoreNotification } from '../api/restore-notification';

import type { NotificationActionResponse } from '../types/notification.types';

import { NOTIFICATION_MESSAGES } from '../constants/notification.constants';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

/**
 * ============================================================================
 * Restore Notification Mutation
 * ============================================================================
 */

export function useRestoreNotification() {
  const queryClient = useQueryClient();

  return useMutation<NotificationActionResponse, Error, string>({
    mutationFn: restoreNotification,

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.notifications,
      });

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.notificationSummary,
      });

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.notificationStats,
      });

      toast.success(response.message ?? NOTIFICATION_MESSAGES.RESTORE_SUCCESS);
    },

    onError: (error) => {
      toast.error(error.message ?? NOTIFICATION_MESSAGES.RESTORE_ERROR);
    },
  });
}
