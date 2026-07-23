/**
 * ============================================================================
 * File: features/auth/types/user.types.ts
 * ============================================================================
 *
 * User Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Shared authenticated user model.
 * - Matches FastAPI user responses.
 * - Used throughout authentication and protected pages.
 * ============================================================================
 */

import type { UserRole } from '@/lib/constants/roles';

/**
 * ============================================================================
 * User Identifier
 * ============================================================================
 */

export type UserId = number;

/**
 * ============================================================================
 * User
 * ============================================================================
 */

export interface User {
  /**
   * Database primary key.
   */
  id: UserId;

  /**
   * User email address.
   */
  email: string;

  /**
   * Application role.
   */
  role: UserRole;

  /**
   * Optional display name.
   * Reserved for future backend support.
   */
  full_name?: string | null;

  /**
   * Whether the account is active.
   */
  is_active?: boolean;

  /**
   * Record creation timestamp.
   */
  created_at?: string | null;

  /**
   * Record last update timestamp.
   */
  updated_at?: string | null;
}
