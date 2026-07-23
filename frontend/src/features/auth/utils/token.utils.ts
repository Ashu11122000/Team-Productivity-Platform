/**
 * ============================================================================
 * File: features/auth/utils/token.utils.ts
 * ============================================================================
 *
 * JWT Token Utilities
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Decode JWT payloads.
 * - Check token expiration.
 * - Extract standard JWT claims.
 * - Provide reusable JWT helper functions.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Authentication is fully owned by the FastAPI backend.
 * - These utilities DO NOT verify JWT signatures.
 * - They only decode and inspect JWT payloads.
 * ============================================================================
 */

/**
 * ============================================================================
 * JWT Payload
 * ============================================================================
 */

export interface JwtPayload {
  /**
   * Subject (typically the user identifier).
   */
  readonly sub?: string;

  /**
   * User email.
   */
  readonly email?: string;

  /**
   * User role.
   */
  readonly role?: string;

  /**
   * Issued at (Unix timestamp).
   */
  readonly iat?: number;

  /**
   * Expiration time (Unix timestamp).
   */
  readonly exp?: number;

  /**
   * Allow additional custom claims.
   */
  readonly [key: string]: unknown;
}

/**
 * ============================================================================
 * Decode JWT Payload
 * ============================================================================
 */

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split('.');

    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');

    const decoded = atob(normalized);

    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * ============================================================================
 * Get Token Expiration
 * ============================================================================
 */

export function getTokenExpiration(token: string): Date | null {
  const payload = decodeJwt(token);

  if (!payload?.exp) {
    return null;
  }

  return new Date(payload.exp * 1000);
}

/**
 * ============================================================================
 * Check Token Expiration
 * ============================================================================
 */

export function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token);

  if (!expiration) {
    return true;
  }

  return expiration.getTime() <= Date.now();
}

/**
 * ============================================================================
 * Get Token Remaining Lifetime
 * ============================================================================
 *
 * Returns the remaining lifetime in milliseconds.
 */

export function getRemainingTokenLifetime(token: string): number {
  const expiration = getTokenExpiration(token);

  if (!expiration) {
    return 0;
  }

  return Math.max(expiration.getTime() - Date.now(), 0);
}

/**
 * ============================================================================
 * Get User Identifier
 * ============================================================================
 */

export function getUserIdFromToken(token: string): string | null {
  return decodeJwt(token)?.sub ?? null;
}

/**
 * ============================================================================
 * Get User Email
 * ============================================================================
 */

export function getUserEmailFromToken(token: string): string | null {
  const email = decodeJwt(token)?.email;

  return typeof email === 'string' ? email : null;
}

/**
 * ============================================================================
 * Get User Role
 * ============================================================================
 */

export function getUserRoleFromToken(token: string): string | null {
  const role = decodeJwt(token)?.role;

  return typeof role === 'string' ? role : null;
}
