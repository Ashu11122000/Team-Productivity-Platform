/**
 * ============================================================================
 * File: role.enum.ts
 * ============================================================================
 *
 * User Role Enumeration
 *
 * Responsibilities
 * ----------------
 * - Define all supported application roles.
 * - Eliminate magic strings.
 * - Provide strongly typed role-based authorization.
 * - Serve as the single source of truth for RBAC.
 *
 * NOTE
 * ----
 * Roles represent high-level permissions within the application.
 * Fine-grained authorization should be implemented using
 * Permission enums and PermissionsGuard.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Passport JWT
 * - TypeORM
 * - PostgreSQL
 * - TypeScript 5+
 * - Node.js 22+
 * ============================================================================
 */

/**
 * Supported application roles.
 */
export enum Role {
  /**
   * Full administrative access.
   */
  ADMIN = 'ADMIN',

  /**
   * Standard authenticated user.
   */
  USER = 'USER',
}
