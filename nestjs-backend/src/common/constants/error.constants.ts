/**
 * ============================================================================
 * File: error.constants.ts
 * ============================================================================
 *
 * Error-related constants for the Team Productivity Platform.
 *
 * Responsibilities
 * ----------------
 * - Centralize application error codes.
 * - Standardize business error identifiers.
 * - Eliminate magic strings.
 * - Improve consistency across exceptions.
 *
 * NOTE
 * ----
 * These are internal application error codes.
 *
 * User-facing error messages belong in:
 *
 * common/messages/
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - FastAPI Integration
 * ============================================================================
 */

/**
 * ============================================================================
 * Generic Error Codes
 * ============================================================================
 */
export const ERROR_CODES = {
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',

  VALIDATION_ERROR: 'VALIDATION_ERROR',

  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',

  BAD_REQUEST: 'BAD_REQUEST',

  UNAUTHORIZED: 'UNAUTHORIZED',

  FORBIDDEN: 'FORBIDDEN',

  NOT_FOUND: 'NOT_FOUND',

  CONFLICT: 'CONFLICT',

  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
} as const;

/**
 * ============================================================================
 * Authentication
 * ============================================================================
 */
export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',

  INVALID_TOKEN: 'AUTH_INVALID_TOKEN',

  TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',

  REFRESH_TOKEN_EXPIRED: 'AUTH_REFRESH_TOKEN_EXPIRED',

  ACCESS_DENIED: 'AUTH_ACCESS_DENIED',

  USER_DISABLED: 'AUTH_USER_DISABLED',

  EMAIL_NOT_VERIFIED: 'AUTH_EMAIL_NOT_VERIFIED',
} as const;

/**
 * ============================================================================
 * User Errors
 * ============================================================================
 */
export const USER_ERROR_CODES = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',

  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',

  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',

  USERNAME_ALREADY_EXISTS: 'USERNAME_ALREADY_EXISTS',
} as const;

/**
 * ============================================================================
 * Task Errors
 * ============================================================================
 */
export const TASK_ERROR_CODES = {
  TASK_NOT_FOUND: 'TASK_NOT_FOUND',

  TASK_ALREADY_EXISTS: 'TASK_ALREADY_EXISTS',

  TASK_ALREADY_COMPLETED: 'TASK_ALREADY_COMPLETED',

  INVALID_TASK_STATUS: 'INVALID_TASK_STATUS',
} as const;

/**
 * ============================================================================
 * Category Errors
 * ============================================================================
 */
export const CATEGORY_ERROR_CODES = {
  CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',

  CATEGORY_ALREADY_EXISTS: 'CATEGORY_ALREADY_EXISTS',
} as const;

/**
 * ============================================================================
 * Tag Errors
 * ============================================================================
 */
export const TAG_ERROR_CODES = {
  TAG_NOT_FOUND: 'TAG_NOT_FOUND',

  TAG_ALREADY_EXISTS: 'TAG_ALREADY_EXISTS',
} as const;

/**
 * ============================================================================
 * Note Errors
 * ============================================================================
 */
export const NOTE_ERROR_CODES = {
  NOTE_NOT_FOUND: 'NOTE_NOT_FOUND',

  NOTE_ALREADY_EXISTS: 'NOTE_ALREADY_EXISTS',
} as const;

/**
 * ============================================================================
 * Notification Errors
 * ============================================================================
 */
export const NOTIFICATION_ERROR_CODES = {
  NOTIFICATION_NOT_FOUND: 'NOTIFICATION_NOT_FOUND',
} as const;

/**
 * ============================================================================
 * Dashboard Errors
 * ============================================================================
 */
export const DASHBOARD_ERROR_CODES = {
  DASHBOARD_DATA_UNAVAILABLE: 'DASHBOARD_DATA_UNAVAILABLE',
} as const;

/**
 * ============================================================================
 * Calendar Errors
 * ============================================================================
 */
export const CALENDAR_ERROR_CODES = {
  HOLIDAY_NOT_FOUND: 'HOLIDAY_NOT_FOUND',

  HOLIDAY_SYNC_FAILED: 'HOLIDAY_SYNC_FAILED',
} as const;

/**
 * ============================================================================
 * Analytics Errors
 * ============================================================================
 */
export const ANALYTICS_ERROR_CODES = {
  ANALYTICS_NOT_AVAILABLE: 'ANALYTICS_NOT_AVAILABLE',
} as const;

/**
 * ============================================================================
 * Cache Errors
 * ============================================================================
 */
export const CACHE_ERROR_CODES = {
  CACHE_READ_FAILED: 'CACHE_READ_FAILED',

  CACHE_WRITE_FAILED: 'CACHE_WRITE_FAILED',

  CACHE_DELETE_FAILED: 'CACHE_DELETE_FAILED',
} as const;

/**
 * ============================================================================
 * Database Errors
 * ============================================================================
 */
export const DATABASE_ERROR_CODES = {
  DATABASE_CONNECTION_FAILED: 'DATABASE_CONNECTION_FAILED',

  DATABASE_QUERY_FAILED: 'DATABASE_QUERY_FAILED',

  DUPLICATE_KEY: 'DATABASE_DUPLICATE_KEY',

  FOREIGN_KEY_CONSTRAINT: 'DATABASE_FOREIGN_KEY_CONSTRAINT',
} as const;

/**
 * ============================================================================
 * External Service Errors
 * ============================================================================
 */
export const INTEGRATION_ERROR_CODES = {
  FASTAPI_UNAVAILABLE: 'FASTAPI_UNAVAILABLE',

  HOLIDAY_API_UNAVAILABLE: 'HOLIDAY_API_UNAVAILABLE',

  EXTERNAL_SERVICE_TIMEOUT: 'EXTERNAL_SERVICE_TIMEOUT',
} as const;
