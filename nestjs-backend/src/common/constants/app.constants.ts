/**
 * ============================================================================
 * File: app.constants.ts
 * ============================================================================
 *
 * Application-wide constants.
 *
 * Responsibilities
 * ----------------
 * - Define application metadata.
 * - Centralize common application constants.
 * - Eliminate magic strings.
 * - Provide reusable values across the application.
 *
 * NOTE
 * ----
 * Do NOT store environment-specific values here.
 * Those belong in the configuration layer (src/config).
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Node.js 22+
 * ============================================================================
 */

/**
 * ============================================================================
 * Application
 * ============================================================================
 */
export const APP_CONSTANTS = {
  /**
   * Character encoding used throughout the application.
   */
  DEFAULT_ENCODING: 'utf-8',

  /**
   * Default locale.
   */
  DEFAULT_LOCALE: 'en',

  /**
   * Default timezone.
   *
   * India Standard Time
   */
  DEFAULT_TIMEZONE: 'Asia/Kolkata',

  /**
   * Default language.
   */
  DEFAULT_LANGUAGE: 'en',

  /**
   * ISO date format.
   */
  DATE_FORMAT: 'YYYY-MM-DD',

  /**
   * ISO datetime format.
   */
  DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',

  /**
   * Timestamp format.
   */
  TIMESTAMP_FORMAT: 'YYYY-MM-DDTHH:mm:ss.SSSZ',

  /**
   * UTF-8 content type.
   */
  DEFAULT_CHARSET: 'utf-8',

  /**
   * Maximum upload size.
   *
   * 10 MB
   */
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,

  /**
   * Health endpoint.
   */
  HEALTH_ENDPOINT: '/health',

  /**
   * Root endpoint.
   */
  ROOT_ENDPOINT: '/',

  /**
   * Default request timeout.
   *
   * Milliseconds.
   */
  DEFAULT_REQUEST_TIMEOUT: 30_000,

  /**
   * Default response timeout.
   *
   * Milliseconds.
   */
  DEFAULT_RESPONSE_TIMEOUT: 30_000,
} as const;

/**
 * ============================================================================
 * Environment Names
 * ============================================================================
 */
export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',

  PRODUCTION: 'production',

  TEST: 'test',
} as const;

/**
 * ============================================================================
 * HTTP Methods
 * ============================================================================
 */
export const HTTP_METHODS = {
  GET: 'GET',

  POST: 'POST',

  PUT: 'PUT',

  PATCH: 'PATCH',

  DELETE: 'DELETE',

  OPTIONS: 'OPTIONS',

  HEAD: 'HEAD',
} as const;

/**
 * ============================================================================
 * Sort Direction
 * ============================================================================
 */
export const SORT_DIRECTION = {
  ASC: 'ASC',

  DESC: 'DESC',
} as const;

/**
 * ============================================================================
 * Common Boolean Flags
 * ============================================================================
 */
export const BOOLEAN_FLAGS = {
  ENABLED: true,

  DISABLED: false,
} as const;

/**
 * ============================================================================
 * Default Numeric Values
 * ============================================================================
 */
export const DEFAULT_VALUES = {
  ZERO: 0,

  ONE: 1,

  TEN: 10,

  HUNDRED: 100,
} as const;

/**
 * ============================================================================
 * Application Headers
 * ============================================================================
 */
export const APP_HEADERS = {
  REQUEST_ID: 'x-request-id',

  CORRELATION_ID: 'x-correlation-id',

  USER_AGENT: 'user-agent',

  AUTHORIZATION: 'authorization',
} as const;
