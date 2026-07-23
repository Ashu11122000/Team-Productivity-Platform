/**
 * ============================================================================
 * File: features/auth/types/user.types.ts
 * ============================================================================
 *
 * User Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define the shared authenticated user model.
 * - Mirror the FastAPI user response contract.
 * - Provide reusable user-related types across the application.
 * - Maintain strict typing for authentication and authorization.
 * ============================================================================
 */

import type { UserRole } from '@/lib/constants/roles';

/**
 * ============================================================================
 * User Identifier
 * ============================================================================
 *
 * The frontend treats identifiers as strings to remain compatible with
 * backend UUIDs and avoid coupling to database implementation details.
 */

export type UserId = string;

/**
 * ============================================================================
 * User
 * ============================================================================
 */

export interface User {
  /**
   * Unique user identifier.
   */
  readonly id: UserId;

  /**
   * User email address.
   */
  readonly email: string;

  /**
   * Application role.
   */
  readonly role: UserRole;

  /**
   * Optional display name.
   * Reserved for future backend support.
   */
  readonly full_name?: string | null;

  /**
   * Indicates whether the account is active.
   */
  readonly is_active?: boolean;

  /**
   * Record creation timestamp (ISO 8601).
   */
  readonly created_at?: string | null;

  /**
   * Record last update timestamp (ISO 8601).
   */
  readonly updated_at?: string | null;
}
