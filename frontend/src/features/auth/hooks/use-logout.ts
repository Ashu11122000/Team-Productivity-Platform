'use client';

/**
 * ============================================================================
 * File: features/auth/hooks/use-logout.ts
 * ============================================================================
 *
 * Logout Mutation Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Logout the authenticated user.
 * - Clear authentication state.
 * - Remove cached authenticated user data.
 * - Display logout notifications.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Authentication is owned by the FastAPI backend.
 * - The auth store is the single source of truth.
 * - The shared Axios client automatically removes the JWT after logout.
 * ============================================================================
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { logout } from '../api/logout';

import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { useAuthStore } from '@/store/auth-store';

/**
 * ============================================================================
 * Logout Mutation
 * ============================================================================
 */

export function useLogout() {
  const queryClient = useQueryClient();

  const logoutStore = useAuthStore((state) => state.logout);

  return useMutation<void, Error, void>({
    mutationFn: logout,

    onSuccess: async () => {
      logoutStore();

      await queryClient.removeQueries({
        queryKey: QUERY_KEYS.profile,
      });

      toast.success('Logged out successfully');
    },

    onError: async () => {
      /**
       * Even if the API request fails (network/server),
       * clear the local authentication state to prevent
       * stale sessions.
       */
      logoutStore();

      await queryClient.removeQueries({
        queryKey: QUERY_KEYS.profile,
      });

      toast.info('Session cleared');
    },
  });
}
