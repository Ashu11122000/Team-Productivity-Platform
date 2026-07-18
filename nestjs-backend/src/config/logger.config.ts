/**
 * ============================================================================
 * File: logger.config.ts
 * ============================================================================
 *
 * Logger configuration for the Team Productivity Platform.
 *
 * Responsibilities
 * ----------------
 * - Centralize logger configuration.
 * - Configure nestjs-pino.
 * - Support pretty logging in development.
 * - Support JSON logging in production.
 * - Configure log levels.
 * - Configure sensitive data redaction.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - nestjs-pino
 * - Pino
 * ============================================================================
 */

import { registerAs } from '@nestjs/config';

export default registerAs('logger', () => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return {
    /**
     * ------------------------------------------------------------------------
     * Log Level
     * ------------------------------------------------------------------------
     */
    level: process.env.LOG_LEVEL ?? 'info',

    /**
     * ------------------------------------------------------------------------
     * Pretty Printing
     * ------------------------------------------------------------------------
     *
     * Enabled only during development.
     */
    pretty: process.env.LOG_PRETTY === 'true' && isDevelopment,

    /**
     * ------------------------------------------------------------------------
     * Request Logging
     * ------------------------------------------------------------------------
     */
    autoLogging: true,

    /**
     * ------------------------------------------------------------------------
     * Timestamp
     * ------------------------------------------------------------------------
     */
    timestamp: true,

    /**
     * ------------------------------------------------------------------------
     * Redact Sensitive Information
     * ------------------------------------------------------------------------
     */
    redact: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'req.body.currentPassword',
      'req.body.newPassword',
      'req.body.confirmPassword',
      'req.body.accessToken',
      'req.body.refreshToken',
      'res.headers["set-cookie"]',
    ],

    /**
     * ------------------------------------------------------------------------
     * Request ID Header
     * ------------------------------------------------------------------------
     */
    requestIdHeader: 'x-request-id',

    /**
     * ------------------------------------------------------------------------
     * Generate Request IDs
     * ------------------------------------------------------------------------
     */
    generateRequestId: true,

    /**
     * ------------------------------------------------------------------------
     * Response Time Logging
     * ------------------------------------------------------------------------
     */
    responseTime: true,

    /**
     * ------------------------------------------------------------------------
     * Ignore Health Endpoint
     * ------------------------------------------------------------------------
     *
     * Can be used later to reduce log noise.
     */
    ignorePaths: ['/health'],
  };
});
