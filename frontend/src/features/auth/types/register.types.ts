/**
 * ============================================================================
 * File: features/auth/types/register.types.ts
 * ============================================================================
 *
 * Registration Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define request and response contracts for user registration.
 * - Mirror the FastAPI registration API.
 * - Keep registration types strongly typed.
 * ============================================================================
 */

import type { UserRole } from '@/lib/constants/roles';

/**
 * ============================================================================
 * Register Request
 * ============================================================================
 */

export interface RegisterRequest {
  readonly email: string;

  readonly password: string;

  readonly confirmPassword: string;
}

/**
 * ============================================================================
 * Register Response
 * ============================================================================
 *
 * Represents the newly created user returned by the FastAPI backend.
 */

export interface RegisterResponse {
  readonly id: string;

  readonly email: string;

  readonly role: UserRole;
}
