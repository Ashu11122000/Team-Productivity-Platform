/**
 * ============================================================================
 * File: features/auth/hooks/use-current-user.ts
 * ============================================================================
 *
 * Current User Query Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Fetch the authenticated user's profile from the FastAPI backend.
 * - Cache the authenticated user using TanStack Query.
 * - Provide configurable enable/disable behavior.
 * - Avoid unnecessary refetches for stable user profile data.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Authentication is fully owned by the FastAPI backend.
 * - The shared Axios client automatically attaches the JWT.
 * - This hook should only execute after authentication restoration.
 * ============================================================================
 */

import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '../api/current-user';
import type { AuthMeResponse } from '../types/auth.types';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

/**
 * ============================================================================
 * Hook Options
 * ============================================================================
 */

export interface UseCurrentUserOptions {
  readonly enabled?: boolean;
}

/**
 * ============================================================================
 * Cache Configuration
 * ============================================================================
 */

/**
 * User profile changes infrequently.
 */
export const CURRENT_USER_STALE_TIME = 10 * 60 * 1000;

/**
 * Keep cached profile for 30 minutes after becoming unused.
 */
export const CURRENT_USER_GC_TIME = 30 * 60 * 1000;

/**
 * ============================================================================
 * Current User Query
 * ============================================================================
 */

export function useCurrentUser(options: UseCurrentUserOptions = {}) {
  const { enabled = true } = options;

  return useQuery<AuthMeResponse>({
    queryKey: QUERY_KEYS.profile,

    queryFn: getCurrentUser,

    enabled,

    staleTime: CURRENT_USER_STALE_TIME,

    gcTime: CURRENT_USER_GC_TIME,

    retry: false,

    refetchOnWindowFocus: false,

    refetchOnReconnect: true,

    refetchOnMount: false,
  });
}
