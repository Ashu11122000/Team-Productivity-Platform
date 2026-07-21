/*
 * ============================================================================
 * File: user.type.ts
 * ============================================================================
 *
 * External User Integration Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define user contracts received from external services.
 * - Represent FastAPI-owned user information.
 * - Provide type safety across integrations.
 *
 * Important:
 * ----------------------------------------------------------------------------
 * NestJS does NOT own the User entity.
 *
 * User lifecycle:
 *
 * FastAPI
 *    |
 *    ↓
 * JWT Token
 *    |
 *    ↓
 * NestJS
 *
 *
 * Does NOT:
 * ----------------------------------------------------------------------------
 * - Create database entities.
 * - Manage authentication.
 * - Store users.
 *
 * ============================================================================
 */

// ============================================================================
// User Role
// ============================================================================

export type UserRole = 'USER' | 'ADMIN';

// ============================================================================
// External User Contract
// ============================================================================

export interface UserType {
  /**
   * FastAPI user identifier.
   */
  id: string;

  /**
   * User email address.
   */
  email: string;

  /**
   * Display username.
   */
  username?: string;

  /**
   * User role from FastAPI.
   */
  role?: UserRole;

  /**
   * Account status.
   */
  isActive?: boolean;

  /**
   * Profile information.
   */
  firstName?: string;

  lastName?: string;

  avatar?: string;

  /**
   * External timestamps.
   */
  createdAt?: string;

  updatedAt?: string;
}
