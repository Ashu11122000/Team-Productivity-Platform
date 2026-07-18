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
   * Application metadata.
   */
  name: process.env.APP_NAME ?? 'Team Productivity Platform NestJS API',

  version: process.env.APP_VERSION ?? '1.0.0',

  /**
   * Current runtime environment.
   */
  environment: process.env.NODE_ENV ?? 'development',

  /**
   * HTTP server configuration.
   */
  port: Number(process.env.PORT ?? 3001),

  apiPrefix: process.env.API_PREFIX ?? 'api/v1',

  /**
   * Frontend configuration.
   */
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',

  /**
   * FastAPI integration.
   */
  fastApiBaseUrl: process.env.FASTAPI_BASE_URL ?? 'http://localhost:8000',

  /**
   * Calendar / Holiday configuration.
   */
  holiday: {
    country: process.env.HOLIDAY_COUNTRY ?? 'IN',

    cacheTtl: Number(process.env.HOLIDAY_CACHE_TTL ?? 86400),
  },

  /**
   * Scheduler configuration.
   */
  scheduler: {
    reminderCron: process.env.REMINDER_CRON ?? '0 9 * * *',

    holidaySyncCron: process.env.HOLIDAY_SYNC_CRON ?? '0 0 * * *',
  },

  /**
   * Analytics configuration.
   */
  analytics: {
    cacheTtl: Number(process.env.ANALYTICS_CACHE_TTL ?? 600),
  },

  /**
   * Application information.
   */
  isDevelopment: process.env.NODE_ENV === 'development',

  isProduction: process.env.NODE_ENV === 'production',

  isTest: process.env.NODE_ENV === 'test',
}));
