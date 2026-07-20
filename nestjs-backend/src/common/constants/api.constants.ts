/**
 * ============================================================================
 * File: api.constants.ts
 * ============================================================================
 *
 * API-related constants for the Team Productivity Platform.
 *
 * Responsibilities
 * ----------------
 * - Centralize API constants.
 * - Eliminate magic strings.
 * - Standardize HTTP headers.
 * - Standardize content types.
 * - Standardize response formats.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Express
 * ============================================================================
 */

/**
 * ============================================================================
 * API
 * ============================================================================
 */
export const API_CONSTANTS = {
  /**
   * Default API version.
   */
  DEFAULT_VERSION: 'v1',

  /**
   * Default API prefix.
   *
   * NOTE:
   * The actual runtime value comes from app.config.ts.
   * This constant is intended only for reusable literals.
   */
  DEFAULT_PREFIX: 'api',

  /**
   * API response format.
   */
  DEFAULT_RESPONSE_TYPE: 'application/json',

  /**
   * Default character encoding.
   */
  DEFAULT_CHARSET: 'utf-8',
} as const;

/**
 * ============================================================================
 * HTTP Headers
 * ============================================================================
 */
export const API_HEADERS = {
  AUTHORIZATION: 'Authorization',

  CONTENT_TYPE: 'Content-Type',

  ACCEPT: 'Accept',

  ORIGIN: 'Origin',

  USER_AGENT: 'User-Agent',

  CACHE_CONTROL: 'Cache-Control',

  ETAG: 'ETag',

  IF_NONE_MATCH: 'If-None-Match',

  LOCATION: 'Location',

  X_REQUEST_ID: 'X-Request-Id',

  X_CORRELATION_ID: 'X-Correlation-Id',

  X_FORWARDED_FOR: 'X-Forwarded-For',

  X_FORWARDED_PROTO: 'X-Forwarded-Proto',
} as const;

/**
 * ============================================================================
 * Content Types
 * ============================================================================
 */
export const CONTENT_TYPES = {
  JSON: 'application/json',

  FORM_DATA: 'multipart/form-data',

  URL_ENCODED: 'application/x-www-form-urlencoded',

  TEXT: 'text/plain',

  HTML: 'text/html',

  PDF: 'application/pdf',

  CSV: 'text/csv',

  OCTET_STREAM: 'application/octet-stream',
} as const;

/**
 * ============================================================================
 * Cache Control
 * ============================================================================
 */
export const CACHE_CONTROL = {
  NO_CACHE: 'no-cache',

  NO_STORE: 'no-store',

  PUBLIC: 'public',

  PRIVATE: 'private',

  MUST_REVALIDATE: 'must-revalidate',
} as const;

/**
 * ============================================================================
 * Common Response Keys
 * ============================================================================
 */
export const RESPONSE_KEYS = {
  SUCCESS: 'success',

  MESSAGE: 'message',

  DATA: 'data',

  ERRORS: 'errors',

  TIMESTAMP: 'timestamp',

  PATH: 'path',

  STATUS_CODE: 'statusCode',

  META: 'meta',

  PAGINATION: 'pagination',
} as const;

/**
 * ============================================================================
 * HTTP Status Codes
 * ============================================================================
 *
 * These mirror RFC 9110 and NestJS HttpStatus values.
 */
export const HTTP_STATUS = {
  OK: 200,

  CREATED: 201,

  ACCEPTED: 202,

  NO_CONTENT: 204,

  BAD_REQUEST: 400,

  UNAUTHORIZED: 401,

  FORBIDDEN: 403,

  NOT_FOUND: 404,

  CONFLICT: 409,

  UNPROCESSABLE_ENTITY: 422,

  TOO_MANY_REQUESTS: 429,

  INTERNAL_SERVER_ERROR: 500,

  BAD_GATEWAY: 502,

  SERVICE_UNAVAILABLE: 503,

  GATEWAY_TIMEOUT: 504,
} as const;

/**
 * ============================================================================
 * Pagination Query Parameters
 * ============================================================================
 */
export const QUERY_PARAMETERS = {
  PAGE: 'page',

  LIMIT: 'limit',

  SEARCH: 'search',

  SORT_BY: 'sortBy',

  SORT_ORDER: 'sortOrder',

  FILTER: 'filter',
} as const;
