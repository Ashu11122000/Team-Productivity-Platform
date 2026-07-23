/**
 * ============================================================================
 * File: lib/constants/roles.ts
 * ============================================================================
 *
 * User Roles
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Single source of truth for application roles.
 * - Match FastAPI authentication roles.
 * - Used by NestJS authorization.
 * - Used by frontend RBAC.
 * ============================================================================
 */

/**
 * ============================================================================
 * Roles
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
 * Role List
 * ============================================================================
 */

export const ALL_ROLES: readonly UserRole[] = [ROLES.ADMIN, ROLES.USER] as const;

/**
 * ============================================================================
 * Default Role
 * ============================================================================
 */

export const DEFAULT_ROLE = ROLES.USER;

/**
 * ============================================================================
 * Role Helpers
 * ============================================================================
 */

export function isAdmin(role: UserRole | null | undefined): boolean {
  return role === ROLES.ADMIN;
}

export function isUser(role: UserRole | null | undefined): boolean {
  return role === ROLES.USER;
}
