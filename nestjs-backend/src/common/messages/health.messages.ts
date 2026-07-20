/**
 * ============================================================================
 * File: health.messages.ts
 * ============================================================================
 *
 * Health check related application messages.
 *
 * Responsibilities
 * ----------------
 * - Centralize health endpoint messages.
 * - Standardize service health responses.
 * - Support monitoring and infrastructure checks.
 *
 * Used By
 * -------
 * - Health Module
 * - Docker Health Checks
 * - Kubernetes Probes
 * - Monitoring Systems
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Terminus Health Checks
 * ============================================================================
 */

/**
 * ============================================================================
 * Health Success Messages
 * ============================================================================
 */
export const HealthSuccessMessages = {
  /**
   * General health
   */
  HEALTHY: 'Application is healthy.',

  READY: 'Application is ready.',

  ALIVE: 'Application is alive.',

  /**
   * Dependencies
   */
  DATABASE_CONNECTED: 'Database connection is healthy.',

  CACHE_CONNECTED: 'Cache connection is healthy.',

  EXTERNAL_SERVICES_AVAILABLE: 'External services are available.',
} as const;

/**
 * ============================================================================
 * Health Error Messages
 * ============================================================================
 */
export const HealthErrorMessages = {
  /**
   * Application
   */
  UNHEALTHY: 'Application health check failed.',

  NOT_READY: 'Application is not ready.',

  SERVICE_UNAVAILABLE: 'Application service is unavailable.',

  /**
   * Database
   */
  DATABASE_CONNECTION_FAILED: 'Database health check failed.',

  DATABASE_UNAVAILABLE: 'Database service is unavailable.',

  DATABASE_TIMEOUT: 'Database connection timed out.',

  /**
   * Cache
   */
  CACHE_CONNECTION_FAILED: 'Cache health check failed.',

  CACHE_UNAVAILABLE: 'Cache service is unavailable.',

  /**
   * External dependencies
   */
  EXTERNAL_SERVICE_FAILED: 'External service health check failed.',

  EXTERNAL_SERVICE_TIMEOUT: 'External service health check timed out.',
} as const;

/**
 * ============================================================================
 * Health Status Messages
 * ============================================================================
 */
export const HealthStatusMessages = {
  UP: 'UP',

  DOWN: 'DOWN',

  DEGRADED: 'DEGRADED',

  UNKNOWN: 'UNKNOWN',
} as const;

/**
 * ============================================================================
 * Health Component Messages
 * ============================================================================
 *
 * Used for individual dependency checks.
 */
export const HealthComponentMessages = {
  APPLICATION: 'Application',

  DATABASE: 'Database',

  CACHE: 'Cache',

  REDIS: 'Redis',

  FASTAPI: 'FastAPI Authentication Service',

  HOLIDAY_API: 'Holiday Provider API',
} as const;

/**
 * ============================================================================
 * Health Check Messages
 * ============================================================================
 */
export const HealthCheckMessages = {
  CHECK_STARTED: 'Health check started.',

  CHECK_COMPLETED: 'Health check completed.',

  CHECK_FAILED: 'Health check failed.',

  ALL_SERVICES_HEALTHY: 'All services are healthy.',

  DEGRADED_SERVICE: 'One or more services are degraded.',
} as const;
