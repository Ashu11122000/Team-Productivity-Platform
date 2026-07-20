/**
 * ============================================================================
 * File: jwt-payload.interface.ts
 * ============================================================================
 *
 * Enterprise JWT Payload Interface
 *
 * Responsibilities
 * ----------------
 * - Define the structure of authenticated JWT payloads.
 * - Provide strong typing for JWT validation.
 * - Ensure consistency across authentication components.
 * - Support FastAPI-issued access tokens.
 *
 * NOTE
 * ----
 * FastAPI is the authentication provider.
 * NestJS only validates and consumes the JWT payload.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Passport JWT
 * - FastAPI Authentication Service
 * - TypeScript 5+
 * - Node.js 22+
 * ============================================================================
 */

import { UserRole } from '../constants/roles.constants';

/**
 * Represents the payload contained within a validated JWT access token.
 */
export interface JwtPayload {
  /**
   * Subject (unique user identifier).
   */
  readonly sub: string;

  /**
   * Application user identifier.
   */
  readonly user_id: string;

  /**
   * User role.
   */
  readonly role: UserRole;

  /**
   * JWT issuer.
   */
  readonly iss: string;

  /**
   * JWT audience.
   */
  readonly aud: string;

  /**
   * User email.
   *
   * Optional because it depends on what the FastAPI
   * authentication service includes in the token.
   */
  readonly email?: string;

  /**
   * Fine-grained permissions.
   */
  readonly permissions?: readonly string[];

  /**
   * JWT ID.
   */
  readonly jti?: string;

  /**
   * Issued-at timestamp (Unix seconds).
   */
  readonly iat?: number;

  /**
   * Expiration timestamp (Unix seconds).
   */
  readonly exp?: number;
}
