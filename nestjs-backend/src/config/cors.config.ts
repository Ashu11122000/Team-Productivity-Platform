/**
 * ============================================================================
 * File: cors.config.ts
 * ============================================================================
 *
 * CORS (Cross-Origin Resource Sharing) configuration.
 *
 * Responsibilities
 * ----------------
 * - Centralize CORS configuration.
 * - Parse allowed origins from environment variables.
 * - Provide a strongly typed configuration object.
 * - Supply configuration for NestJS enableCors().
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Express
 * - Docker
 * ============================================================================
 */

import { registerAs } from '@nestjs/config';

/**
 * ============================================================================
 * CORS Configuration Namespace
 * ============================================================================
 *
 * Environment Variable
 * --------------------
 *
 * CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
 *
 * ============================================================================
 */
export default registerAs('cors', () => {
  /**
   * Parse comma-separated origins.
   */
  const origins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return {
    /**
     * Allowed origins.
     */
    origins,

    /**
     * Enable cookies / Authorization headers.
     */
    credentials: true,

    /**
     * Allowed HTTP methods.
     */
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    /**
     * Allowed request headers.
     */
    allowedHeaders: [
      'Authorization',
      'Content-Type',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],

    /**
     * Exposed response headers.
     */
    exposedHeaders: ['Content-Disposition'],

    /**
     * Browser cache duration (seconds).
     */
    maxAge: 86400,
  };
});
