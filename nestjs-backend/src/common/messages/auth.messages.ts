/**
 * ============================================================================
 * File: auth.messages.ts
 * ============================================================================
 *
 * Authentication-related messages.
 *
 * Responsibilities
 * ----------------
 * - Centralize authentication messages.
 * - Standardize JWT/authentication responses.
 * - Avoid hardcoded authentication strings.
 *
 * Architecture Note
 * -----------------
 * FastAPI is the authentication owner.
 *
 * NestJS only:
 * - Validates JWT tokens.
 * - Authorizes access.
 * - Uses these messages for authentication failures.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Passport JWT
 * - FastAPI Shared JWT Authentication
 * ============================================================================
 */

/**
 * ============================================================================
 * Authentication Success Messages
 * ============================================================================
 */
export const AuthSuccessMessages = {
  /**
   * Successful authentication.
   */
  AUTHENTICATED: 'User authenticated successfully.',

  /**
   * Token validation.
   */
  TOKEN_VALID: 'Token validated successfully.',

  /**
   * Session information.
   */
  SESSION_VALID: 'Session is valid.',

  /**
   * Logout acknowledgement.
   */
  LOGGED_OUT: 'User logged out successfully.',
} as const;

/**
 * ============================================================================
 * Authentication Error Messages
 * ============================================================================
 */
export const AuthErrorMessages = {
  /**
   * Credentials
   */
  INVALID_CREDENTIALS: 'Invalid email or password.',

  ACCOUNT_NOT_FOUND: 'User account not found.',

  ACCOUNT_DISABLED: 'User account is disabled.',

  ACCOUNT_LOCKED: 'User account is temporarily locked.',

  /**
   * JWT Errors
   */
  INVALID_TOKEN: 'Invalid authentication token.',

  TOKEN_EXPIRED: 'Authentication token has expired.',

  TOKEN_MISSING: 'Authentication token is required.',

  TOKEN_MALFORMED: 'Authentication token format is invalid.',

  /**
   * Authorization
   */
  UNAUTHORIZED: 'Authentication is required.',

  FORBIDDEN: 'You do not have permission to access this resource.',

  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions to perform this action.',

  /**
   * User State
   */
  EMAIL_NOT_VERIFIED: 'Email address has not been verified.',

  SESSION_EXPIRED: 'User session has expired.',

  /**
   * External Authentication
   */
  AUTH_SERVICE_UNAVAILABLE: 'Authentication service is currently unavailable.',

  AUTH_SERVICE_TIMEOUT: 'Authentication service request timed out.',

  AUTH_SERVICE_ERROR: 'Authentication service returned an error.',
} as const;

/**
 * ============================================================================
 * JWT Validation Messages
 * ============================================================================
 *
 * Used by JwtStrategy and guards.
 */
export const JwtMessages = {
  VALIDATION_SUCCESS: 'JWT token validation successful.',

  INVALID_SIGNATURE: 'JWT signature verification failed.',

  INVALID_ISSUER: 'JWT issuer validation failed.',

  INVALID_AUDIENCE: 'JWT audience validation failed.',

  EXPIRED: 'JWT token has expired.',
} as const;

/**
 * ============================================================================
 * Authorization Messages
 * ============================================================================
 */
export const AuthorizationMessages = {
  ROLE_REQUIRED: 'Required role is missing.',

  ROLE_NOT_ALLOWED: 'User role is not allowed.',

  PERMISSION_REQUIRED: 'Required permission is missing.',

  ACCESS_RESTRICTED: 'Access to this resource is restricted.',
} as const;

/**
 * ============================================================================
 * FastAPI Integration Messages
 * ============================================================================
 *
 * Used when communicating with the authentication owner.
 */
export const FastApiAuthMessages = {
  CONNECTION_FAILED: 'Unable to connect with authentication service.',

  INVALID_RESPONSE: 'Invalid response received from authentication service.',

  USER_LOOKUP_FAILED:
    'Unable to retrieve user information from authentication service.',
} as const;
