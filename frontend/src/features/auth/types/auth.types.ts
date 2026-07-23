/**
 * ============================================================================
 * File: features/auth/types/auth.types.ts
 * ============================================================================
 *
 * Authentication Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define authentication-related contracts.
 * - Match the FastAPI authentication responses.
 * - Provide shared authentication state for the frontend.
 * ============================================================================
 */

import type { User } from './user.types';

/**
 * ============================================================================
 * Current Authenticated User
 * ============================================================================
 */

export interface AuthMeResponse {
  id: string;

  email: string;

  role: string;
}

/**
 * ============================================================================
 * Login Response
 * ============================================================================
 *
 * FastAPI returns an access token after successful authentication.
 * If your backend later adds a refresh token, simply make
 * refresh_token required instead of optional.
 */

export interface LoginResponse {
  access_token: string;

  token_type: 'bearer';

  user: User;

  refresh_token?: string;
}

/**
 * ============================================================================
 * Refresh Token Response
 * ============================================================================
 */

export interface RefreshTokenResponse {
  access_token: string;

  token_type: 'bearer';
}

/**
 * ============================================================================
 * Authentication State
 * ============================================================================
 */

export interface AuthState {
  accessToken: string | null;

  user: User | null;

  isAuthenticated: boolean;
}
