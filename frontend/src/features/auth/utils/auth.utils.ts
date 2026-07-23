/**
 * ============================================================================
 * File: features/auth/utils/auth.utils.ts
 * ============================================================================
 *
 * Authentication Utilities
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Build authorization headers.
 * - Validate authentication state.
 * - Normalize bearer tokens.
 * - Provide reusable authentication helpers.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Authentication is fully owned by the FastAPI backend.
 * - NestJS only validates JWTs.
 * - These utilities are framework-agnostic and contain no React code.
 * ============================================================================
 */

import { AUTHORIZATION_HEADER, AUTH_BEARER_PREFIX } from '../constants/auth.constants';

/**
 * ============================================================================
 * Authentication Header
 * ============================================================================
 */

export interface AuthorizationHeader {
  readonly Authorization: string;
}

/**
 * ============================================================================
 * Check Access Token
 * ============================================================================
 */

export function hasAccessToken(token: string | null | undefined): token is string {
  return typeof token === 'string' && token.trim().length > 0;
}

/**
 * ============================================================================
 * Normalize Token
 * ============================================================================
 *
 * Removes an existing Bearer prefix if present.
 */

export function normalizeAccessToken(token: string): string {
  return token.replace(new RegExp(`^${AUTH_BEARER_PREFIX}\\s+`, 'i'), '');
}

/**
 * ============================================================================
 * Build Authorization Header
 * ============================================================================
 */

export function buildAuthorizationHeader(token: string): AuthorizationHeader {
  return {
    [AUTHORIZATION_HEADER]: `${AUTH_BEARER_PREFIX} ${normalizeAccessToken(token)}`,
  };
}

/**
 * ============================================================================
 * Bearer Token
 * ============================================================================
 */

export function getBearerToken(token: string): string {
  return `${AUTH_BEARER_PREFIX} ${normalizeAccessToken(token)}`;
}

/**
 * ============================================================================
 * Authentication State
 * ============================================================================
 */

export function isAuthenticated(token: string | null | undefined): boolean {
  return hasAccessToken(token);
}
