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
 * - Shared across the entire frontend application.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Authentication is handled by the FastAPI backend.
 * - Authorization is performed on the frontend using shared role definitions.
 * ============================================================================
 */

import { ROLES, type UserRole } from '@/lib/constants/roles';

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
  ...allowedRoles: readonly UserRole[]
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
 * Check Admin Role
 * ============================================================================
 */

export function isAdmin(role: UserRole | null | undefined): boolean {
  return role === ROLES.ADMIN;
}

/**
 * ============================================================================
 * Check User Role
 * ============================================================================
 */

export function isUser(role: UserRole | null | undefined): boolean {
  return role === ROLES.USER;
}

/**
 * ============================================================================
 * Permission Helper
 * ============================================================================
 */

export function hasPermission(
  role: UserRole | null | undefined,
  allowedRoles: readonly UserRole[],
): boolean {
  return hasRole(role, allowedRoles);
}

/**
 * ============================================================================
 * Route / Component Authorization
 * ============================================================================
 */

export function canAccess(
  role: UserRole | null | undefined,
  allowedRoles: readonly UserRole[],
): boolean {
  return hasPermission(role, allowedRoles);
}
