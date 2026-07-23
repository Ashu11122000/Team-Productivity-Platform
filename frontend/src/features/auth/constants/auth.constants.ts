/**
 * ============================================================================
 * File: features/auth/constants/auth.constants.ts
 * ============================================================================
 *
 * Authentication Constants
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Centralize authentication-related constants.
 * - Avoid duplicated string literals.
 * - Provide reusable configuration across the Auth feature.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Authentication is fully owned by the FastAPI backend.
 * - NestJS only validates JWTs.
 * ============================================================================
 */

/**
 * ============================================================================
 * JWT
 * ============================================================================
 */

/**
 * Expected token type returned by FastAPI.
 */
export const AUTH_TOKEN_TYPE = 'bearer' as const;

/**
 * Authorization header prefix.
 */
export const AUTH_BEARER_PREFIX = 'Bearer';

/**
 * ============================================================================
 * Storage Keys
 * ============================================================================
 */

export const AUTH_STORAGE_KEYS = {
  /**
   * JWT access token.
   */
  ACCESS_TOKEN: 'auth.access-token',

  /**
   * Authenticated user.
   */
  USER: 'auth.user',

  /**
   * Theme preference (shared).
   */
  THEME: 'app.theme',
} as const;

/**
 * ============================================================================
 * Query Configuration
 * ============================================================================
 */

/**
 * Current user rarely changes during a session.
 */
export const AUTH_STALE_TIME = 10 * 60 * 1000;

/**
 * Keep authentication cache for 30 minutes.
 */
export const AUTH_GC_TIME = 30 * 60 * 1000;

/**
 * ============================================================================
 * Authentication
 * ============================================================================
 */

/**
 * Default redirect after successful login.
 */
export const DEFAULT_LOGIN_REDIRECT = '/dashboard';

/**
 * Redirect after logout.
 */
export const DEFAULT_LOGOUT_REDIRECT = '/login';

/**
 * ============================================================================
 * HTTP
 * ============================================================================
 */

/**
 * Authorization header name.
 */
export const AUTHORIZATION_HEADER = 'Authorization';

/**
 * ============================================================================
 * Validation
 * ============================================================================
 */

/**
 * Minimum password length.
 *
 * Keep synchronized with the FastAPI backend validation.
 */
export const PASSWORD_MIN_LENGTH = 6;

/**
 * ============================================================================
 * Messages
 * ============================================================================
 */

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful.',

  LOGIN_FAILED: 'Invalid email or password.',

  LOGOUT_SUCCESS: 'Logged out successfully.',

  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',

  REGISTER_SUCCESS: 'Registration successful. Please sign in.',

  REGISTER_FAILED: 'Registration failed.',
} as const;
