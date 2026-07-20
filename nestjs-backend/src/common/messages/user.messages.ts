/**
 * ============================================================================
 * File: user.messages.ts
 * ============================================================================
 *
 * User-related application messages.
 *
 * Responsibilities
 * ----------------
 * - Centralize user resource messages.
 * - Standardize user-related API responses.
 * - Avoid hardcoded strings.
 *
 * Architecture Note
 * -----------------
 * FastAPI owns:
 * - User registration
 * - Login
 * - JWT issuing
 *
 * NestJS uses these messages for:
 * - User context handling
 * - User lookups
 * - User-related operations
 * - Ownership validation
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - FastAPI Shared JWT Authentication
 * ============================================================================
 */

/**
 * ============================================================================
 * User Success Messages
 * ============================================================================
 */
export const UserSuccessMessages = {
  /**
   * User retrieval.
   */
  FOUND: 'User retrieved successfully.',

  PROFILE_FETCHED: 'User profile retrieved successfully.',

  /**
   * User updates.
   */
  UPDATED: 'User updated successfully.',

  PROFILE_UPDATED: 'User profile updated successfully.',

  /**
   * User preferences.
   */
  PREFERENCES_UPDATED: 'User preferences updated successfully.',
} as const;

/**
 * ============================================================================
 * User Error Messages
 * ============================================================================
 */
export const UserErrorMessages = {
  /**
   * Resource lookup.
   */
  NOT_FOUND: 'User not found.',

  INVALID_ID: 'Invalid user identifier.',

  /**
   * Duplicate data.
   */
  ALREADY_EXISTS: 'User already exists.',

  EMAIL_ALREADY_EXISTS: 'Email address is already registered.',

  USERNAME_ALREADY_EXISTS: 'Username is already taken.',

  /**
   * User state.
   */
  INACTIVE: 'User account is inactive.',

  DISABLED: 'User account has been disabled.',

  DELETED: 'User account has been deleted.',

  /**
   * Permission / ownership.
   */
  ACCESS_DENIED: 'You do not have permission to access this user.',

  NOT_OWNER: 'User does not own this resource.',

  /**
   * External user service.
   */
  LOOKUP_FAILED: 'Unable to retrieve user information.',

  SERVICE_UNAVAILABLE: 'User service is currently unavailable.',
} as const;

/**
 * ============================================================================
 * User Validation Messages
 * ============================================================================
 */
export const UserValidationMessages = {
  INVALID_EMAIL: 'Invalid email address.',

  INVALID_USERNAME: 'Invalid username format.',

  INVALID_NAME: 'Invalid name format.',

  NAME_TOO_SHORT: 'Name is too short.',

  NAME_TOO_LONG: 'Name is too long.',

  INVALID_ROLE: 'Invalid user role.',
} as const;

/**
 * ============================================================================
 * User Permission Messages
 * ============================================================================
 */
export const UserPermissionMessages = {
  CANNOT_ACCESS: 'User does not have access to this resource.',

  CANNOT_UPDATE: 'User does not have permission to update this resource.',

  CANNOT_DELETE: 'User does not have permission to delete this resource.',
} as const;

/**
 * ============================================================================
 * User Integration Messages
 * ============================================================================
 *
 * Used when NestJS communicates with FastAPI.
 */
export const UserIntegrationMessages = {
  FASTAPI_USER_FETCH_FAILED:
    'Failed to fetch user information from FastAPI service.',

  FASTAPI_TIMEOUT: 'User information request timed out.',

  FASTAPI_INVALID_RESPONSE:
    'Invalid user information received from FastAPI service.',
} as const;
