/**
 * ============================================================================
 * File: features/auth/types/auth.types.ts
 * ============================================================================
 *
 * Authentication Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define authentication-related API contracts.
 * - Mirror FastAPI authentication responses.
 * - Provide shared authentication state.
 * - Keep authentication strongly typed across the application.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Authentication is fully owned by the FastAPI backend.
 * - NestJS only validates JWTs and never performs authentication.
 * - This file contains only shared frontend authentication contracts.
 * ============================================================================
 */

import type { UserRole } from '@/lib/constants/roles';

import type { User } from './user.types';

/**
 * ============================================================================
 * Authenticated User (/auth/me)
 * ============================================================================
 */

export interface AuthMeResponse extends User {
  readonly role: UserRole;
}

/**
 * ============================================================================
 * Authentication Tokens
 * ============================================================================
 */

export interface AuthTokens {
  readonly access_token: string;

  readonly token_type: 'bearer';

  readonly refresh_token?: string;
}

/**
 * ============================================================================
 * Login Response
 * ============================================================================
 */

export interface LoginResponse extends AuthTokens {
  readonly user: User;
}

/**
 * ============================================================================
 * Refresh Token Response
 * ============================================================================
 *
 * The current FastAPI implementation returns the same token payload as
 * AuthTokens. Using a type alias avoids duplicating the contract while
 * satisfying the ESLint `no-empty-object-type` rule.
 */

export type RefreshTokenResponse = AuthTokens;

/**
 * ============================================================================
 * Authentication State
 * ============================================================================
 */

export interface AuthState {
  readonly accessToken: string | null;

  readonly user: User | null;

  readonly isAuthenticated: boolean;
}
