/**
 * ============================================================================
 * File: lib/rbac.ts
 * ============================================================================
 *
 * Role Based Access Control (RBAC)
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Role validation.
 * - Permission helpers.
 * - Route authorization.
 * - Component authorization.
 * - Shared across FastAPI & NestJS modules.
 * ============================================================================
 */

import type { UserRole } from '@/lib/constants/roles';

/**
 * ============================================================================
 * Check Single Role
 * ============================================================================
 */

export function hasRole(
  userRole: UserRole | null | undefined,
  allowedRoles: readonly UserRole[],
): boolean {
  if (!userRole) {
    return false;
  }

  return allowedRoles.includes(userRole);
}

/**
 * ============================================================================
 * Check Any Role
 * ============================================================================
 */

export function hasAnyRole(
  userRole: UserRole | null | undefined,
  ...allowedRoles: UserRole[]
): boolean {
  return hasRole(userRole, allowedRoles);
}

/**
 * ============================================================================
 * Check Multiple Roles
 * ============================================================================
 */

export function hasAllRoles(
  userRoles: readonly UserRole[] | null | undefined,
  requiredRoles: readonly UserRole[],
): boolean {
  if (!userRoles || userRoles.length === 0) {
    return false;
  }

  return requiredRoles.every((role) => userRoles.includes(role));
}

/**
 * ============================================================================
 * Admin
 * ============================================================================
 */

export function isAdmin(role: UserRole | null | undefined): boolean {
  return role === 'ADMIN';
}

/**
 * ============================================================================
 * User
 * ============================================================================
 */

export function isUser(role: UserRole | null | undefined): boolean {
  return Boolean(role);
}

/**
 * ============================================================================
 * Authorization
 * ============================================================================
 */

export function canAccess(
  role: UserRole | null | undefined,
  allowedRoles: readonly UserRole[],
): boolean {
  return hasRole(role, allowedRoles);
}
