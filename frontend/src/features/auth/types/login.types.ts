/**
 * ============================================================================
 * File: features/auth/types/login.types.ts
 * ============================================================================
 *
 * Login Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define request and response contracts for the login API.
 * - Mirror the FastAPI authentication endpoints.
 * - Reuse shared authentication types.
 * ============================================================================
 */

import type { AuthTokens } from './auth.types';
import type { User } from './user.types';

/**
 * ============================================================================
 * Login Request
 * ============================================================================
 */

export interface LoginRequest {
  readonly email: string;

  readonly password: string;
}

/**
 * ============================================================================
 * Login Response Data
 * ============================================================================
 */

export interface LoginResponseData extends AuthTokens {
  readonly user: User;
}

/**
 * ============================================================================
 * Login Response
 * ============================================================================
 *
 * Mirrors the FastAPI response wrapper.
 */

export interface LoginResponse {
  readonly success: boolean;

  readonly message: string;

  readonly data: LoginResponseData;
}
