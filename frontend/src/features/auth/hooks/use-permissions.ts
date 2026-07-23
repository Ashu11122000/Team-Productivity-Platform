'use client';

/**
 * ============================================================================
 * File: features/auth/hooks/use-permissions.ts
 * ============================================================================
 *
 * Permission Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Expose the authenticated user's role.
 * - Provide role helper flags.
 * - Provide reusable permission helpers.
 * - Memoize computed permission values.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Authentication is managed by the FastAPI backend.
 * - Authorization is performed using shared RBAC utilities.
 * - Role definitions are shared across the application.
 * ============================================================================
 */

import { useCallback, useMemo } from 'react';

import type { UserRole } from '@/lib/constants/roles';
import { hasPermission, isAdmin, isUser } from '@/lib/rbac';
import { useAuthStore } from '@/store/auth-store';

/**
 * ============================================================================
 * Hook Return Type
 * ============================================================================
 */

export interface UsePermissionsResult {
  readonly role: UserRole | undefined;

  readonly isAdmin: boolean;

  readonly isUser: boolean;

  readonly hasPermission: (allowedRoles: readonly UserRole[]) => boolean;
}

/**
 * ============================================================================
 * Permission Hook
 * ============================================================================
 */

export function usePermissions(): UsePermissionsResult {
  const role = useAuthStore((state) => state.user?.role);

  const checkPermission = useCallback(
    (allowedRoles: readonly UserRole[]) => hasPermission(role, allowedRoles),
    [role],
  );

  return useMemo(
    () => ({
      /**
       * Current authenticated role.
       */
      role,

      /**
       * Role helpers.
       */
      isAdmin: isAdmin(role),

      isUser: isUser(role),

      /**
       * Generic permission checker.
       */
      hasPermission: checkPermission,
    }),
    [role, checkPermission],
  );
}
