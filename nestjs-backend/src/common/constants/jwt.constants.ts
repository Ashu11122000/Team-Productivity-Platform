/**
 * ============================================================================
 * File: jwt.constants.ts
 * ============================================================================
 *
 * JWT authentication constants.
 *
 * Responsibilities
 * ----------------
 * - Centralize JWT-related constants.
 * - Eliminate magic strings.
 * - Provide reusable authentication values.
 *
 * NOTE
 * ----
 * Environment-dependent values such as:
 *
 * - JWT_SECRET
 * - JWT_ISSUER
 * - JWT_AUDIENCE
 * - JWT_ALGORITHM
 *
 * belong in:
 *
 * src/config/jwt.config.ts
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Passport JWT
 * - FastAPI Shared Authentication
 * ============================================================================
 */

/**
 * ============================================================================
 * JWT Strategy
 * ============================================================================
 */
export const JWT_STRATEGY = {
  /**
   * Passport strategy name.
   */
  NAME: 'jwt',
} as const;

/**
 * ============================================================================
 * Authentication Scheme
 * ============================================================================
 */
export const AUTH_SCHEME = {
  /**
   * Authorization scheme.
   */
  BEARER: 'Bearer',

  /**
   * Authorization header.
   */
  BEARER_PREFIX: 'Bearer ',
} as const;

/**
 * ============================================================================
 * HTTP Headers
 * ============================================================================
 */
export const JWT_HEADERS = {
  AUTHORIZATION: 'Authorization',
} as const;

/**
 * ============================================================================
 * JWT Claims
 * ============================================================================
 *
 * Standard JWT claim names used across services.
 *
 * References:
 * RFC 7519
 */
export const JWT_CLAIMS = {
  SUBJECT: 'sub',

  ISSUER: 'iss',

  AUDIENCE: 'aud',

  ISSUED_AT: 'iat',

  EXPIRATION: 'exp',

  NOT_BEFORE: 'nbf',

  JWT_ID: 'jti',

  TYPE: 'typ',
} as const;

/**
 * ============================================================================
 * Custom Claims
 * ============================================================================
 *
 * Shared between FastAPI and NestJS.
 *
 * These claims should remain consistent across both backends.
 */
export const JWT_CUSTOM_CLAIMS = {
  USER_ID: 'user_id',

  EMAIL: 'email',

  ROLE: 'role',

  PERMISSIONS: 'permissions',

  TOKEN_TYPE: 'token_type',
} as const;

/**
 * ============================================================================
 * Token Types
 * ============================================================================
 */
export const TOKEN_TYPES = {
  ACCESS: 'access',

  REFRESH: 'refresh',
} as const;

/**
 * ============================================================================
 * Authentication Context Keys
 * ============================================================================
 *
 * Keys attached to the Express request object after successful authentication.
 */
export const AUTH_CONTEXT = {
  USER: 'user',

  TOKEN: 'token',
} as const;

/**
 * ============================================================================
 * Authorization Header Parsing
 * ============================================================================
 */
export const AUTHORIZATION = {
  HEADER_INDEX: 0,

  TOKEN_INDEX: 1,

  PARTS: 2,
} as const;

/**
 * ============================================================================
 * Authentication Decorators
 * ============================================================================
 *
 * Metadata keys used by custom decorators.
 */
export const AUTH_METADATA = {
  PUBLIC: 'isPublic',

  ROLES: 'roles',
} as const;

/**
 * ============================================================================
 * Swagger
 * ============================================================================
 */
export const SWAGGER_AUTH = {
  NAME: 'JWT',

  DESCRIPTION: 'JWT access token issued by the FastAPI authentication service.',
} as const;
