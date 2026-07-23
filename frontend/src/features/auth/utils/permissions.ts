/**
 * ============================================================================
 * File: lib/constants/roles.ts
 * ============================================================================
 *
 * Role Constants & RBAC Utilities
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define application roles.
 * - Provide a strongly typed UserRole.
 * - Expose reusable role helper functions.
 * - Prevent hardcoded role strings throughout the application.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Authentication is owned by the FastAPI backend.
 * - Authorization is performed on the frontend using these shared role types.
 * ============================================================================
 */

/**
 * ============================================================================
 * Application Roles
 * ============================================================================
 */

export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

/**
 * ============================================================================
 * User Role Type
 * ============================================================================
 */

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

/**
 * ============================================================================
 * Role Helpers
 * ============================================================================
 */

export function isAdmin(role?: UserRole | null): boolean {
  return role === ROLES.ADMIN;
}

export function isUser(role?: UserRole | null): boolean {
  return role === ROLES.USER;
}

/**
 * ============================================================================
 * Permission Helpers
 * ============================================================================
 */

export function hasPermission(
  role: UserRole | null | undefined,
  allowedRoles: readonly UserRole[],
): boolean {
  if (!role) {
    return false;
  }

  return allowedRoles.includes(role);
}
