/**
 * ============================================================================
 * File: jwt.config.ts
 * ============================================================================
 *
 * JWT configuration for the Team Productivity Platform.
 *
 * Responsibilities
 * ----------------
 * - Centralize JWT-related configuration.
 * - Provide strongly typed JWT settings.
 * - Share JWT configuration across authentication modules.
 * - Support compatibility with the FastAPI authentication service.
 *
 * This configuration is consumed by:
 * - JwtModule
 * - JwtStrategy
 * - JwtAuthGuard
 * - FastAPI integration
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - @nestjs/jwt
 * - Passport JWT
 * ============================================================================
 */

import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  /**
   * Shared secret.
   *
   * Must exactly match the FastAPI backend.
   */
  secret: process.env.JWT_SECRET,

  /**
   * JWT algorithm.
   *
   * Example:
   * HS256
   */
  algorithm: process.env.JWT_ALGORITHM,

  /**
   * Expected issuer.
   */
  issuer: process.env.JWT_ISSUER,

  /**
   * Expected audience.
   */
  audience: process.env.JWT_AUDIENCE,

  /**
   * Ignore expiration.
   *
   * Should always remain false in production.
   */
  ignoreExpiration: false,

  /**
   * Clock tolerance (seconds).
   *
   * Helps prevent issues caused by slight clock drift
   * between services.
   */
  clockTolerance: 5,
}));
