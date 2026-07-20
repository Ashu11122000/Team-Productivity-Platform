/**
 * ============================================================================
 * File: roles.constants.ts
 * ============================================================================
 *
 * Role and authorization constants.
 *
 * Responsibilities
 * ----------------
 * - Centralize application roles.
 * - Define role hierarchy.
 * - Provide reusable role metadata.
 * - Eliminate magic strings.
 *
 * NOTE
 * ----
 * These are application-level roles.
 *
 * Permissions will be introduced later as a separate layer for RBAC.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Passport JWT
 * - RolesGuard
 * - @Roles() Decorator
 * ============================================================================
 */

/**
 * ============================================================================
 * User Roles
 * ============================================================================
 *
 * Primary roles supported by the application.
 */
export enum UserRole {
  ADMIN = 'ADMIN',

  USER = 'USER',
}

/**
 * ============================================================================
 * Default Role
 * ============================================================================
 */
export const DEFAULT_ROLE = UserRole.USER;

/**
 * ============================================================================
 * Role Hierarchy
 * ============================================================================
 *
 * Higher roles inherit permissions from lower roles.
 *
 * ADMIN
 * └── USER
 */
export const ROLE_HIERARCHY: Readonly<Record<UserRole, readonly UserRole[]>> = {
  [UserRole.ADMIN]: [UserRole.ADMIN, UserRole.USER],

  [UserRole.USER]: [UserRole.USER],
};

/**
 * ============================================================================
 * Role Priority
 * ============================================================================
 *
 * Used when comparing privilege levels.
 */
export const ROLE_PRIORITY: Readonly<Record<UserRole, number>> = {
  [UserRole.ADMIN]: 100,

  [UserRole.USER]: 10,
};

/**
 * ============================================================================
 * System Roles
 * ============================================================================
 *
 * Useful for validation.
 */
export const SYSTEM_ROLES = Object.freeze(Object.values(UserRole));

/**
 * ============================================================================
 * Role Metadata Keys
 * ============================================================================
 *
 * Used by @Roles() decorator.
 */
export const ROLE_METADATA = {
  KEY: 'roles',
} as const;

/**
 * ============================================================================
 * Helper Functions
 * ============================================================================
 */

/**
 * Returns true if the supplied role exists.
 */
export function isValidRole(role: string): role is UserRole {
  return SYSTEM_ROLES.includes(role as UserRole);
}

/**
 * Returns true if the user's role satisfies the required role.
 */
export function hasRequiredRole(
  userRole: UserRole,
  requiredRole: UserRole,
): boolean {
  return ROLE_HIERARCHY[userRole].includes(requiredRole);
}
