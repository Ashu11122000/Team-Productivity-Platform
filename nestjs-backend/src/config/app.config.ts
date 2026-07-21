/**
 * ============================================================================
 * File: app.config.ts
 * ============================================================================
 *
 * Application configuration.
 *
 * Responsibilities
 * ----------------
 * - Provide strongly typed application configuration.
 * - Centralize application-level environment variables.
 * - Eliminate direct process.env usage throughout the project.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - @nestjs/config v4
 * ============================================================================
 */

import { registerAs } from '@nestjs/config';

/**
 * ============================================================================
 * Application Configuration Namespace
 * ============================================================================
 *
 * Usage:
 *
 * constructor(
 *   @Inject(appConfig.KEY)
 *   private readonly appConfig: ConfigType<typeof appConfig>,
 * ) {}
 *
 * ============================================================================
 */
export default registerAs('app', () => ({
  /**
   * --------------------------------------------------------------------------
   * Application Metadata
   * --------------------------------------------------------------------------
   */
  name: process.env.APP_NAME ?? 'Team Productivity Platform NestJS API',

  version: process.env.APP_VERSION ?? '1.0.0',

  /**
   * --------------------------------------------------------------------------
   * Runtime Environment
   * --------------------------------------------------------------------------
   */
  environment: process.env.NODE_ENV ?? 'development',

  isDevelopment: process.env.NODE_ENV === 'development',

  isProduction: process.env.NODE_ENV === 'production',

  isTest: process.env.NODE_ENV === 'test',

  /**
   * --------------------------------------------------------------------------
   * HTTP Server
   * --------------------------------------------------------------------------
   */
  port: Number(process.env.PORT ?? 3001),

  /**
   * Global API prefix.
   *
   * Example:
   * /api/v1/tasks
   */
  apiPrefix: process.env.API_PREFIX ?? 'api/v1',

  /**
   * Request timeout (milliseconds).
   *
   * Used by TimeoutInterceptor.
   */
  requestTimeout: Number(process.env.REQUEST_TIMEOUT ?? 30000),

  /**
   * Graceful shutdown timeout (milliseconds).
   */
  shutdownTimeout: Number(process.env.SHUTDOWN_TIMEOUT ?? 10000),

  /**
   * Enable URI versioning.
   */
  enableVersioning:
    (process.env.ENABLE_VERSIONING ?? 'true').toLowerCase() === 'true',

  /**
   * Enable Swagger documentation.
   *
   * The Swagger module may additionally check its own configuration namespace.
   */
  enableSwagger:
    (process.env.ENABLE_SWAGGER ?? 'true').toLowerCase() === 'true',

  /**
   * --------------------------------------------------------------------------
   * Frontend Configuration
   * --------------------------------------------------------------------------
   */
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',

  /**
   * --------------------------------------------------------------------------
   * FastAPI Integration
   * --------------------------------------------------------------------------
   */
  fastApiBaseUrl: process.env.FASTAPI_BASE_URL ?? 'http://localhost:8000',

  /**
   * --------------------------------------------------------------------------
   * Calendar / Holiday Configuration
   * --------------------------------------------------------------------------
   */
  holiday: {
    country: process.env.HOLIDAY_COUNTRY ?? 'IN',

    cacheTtl: Number(process.env.HOLIDAY_CACHE_TTL ?? 86400),
  },

  /**
   * --------------------------------------------------------------------------
   * Scheduler Configuration
   * --------------------------------------------------------------------------
   */
  scheduler: {
    reminderCron: process.env.REMINDER_CRON ?? '0 9 * * *',

    holidaySyncCron: process.env.HOLIDAY_SYNC_CRON ?? '0 0 * * *',
  },

  /**
   * --------------------------------------------------------------------------
   * Analytics Configuration
   * --------------------------------------------------------------------------
   */
  analytics: {
    cacheTtl: Number(process.env.ANALYTICS_CACHE_TTL ?? 600),
  },
}));
