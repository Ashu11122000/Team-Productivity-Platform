/**
 * ============================================================================
 * File: index.ts
 * ============================================================================
 *
 * Configuration barrel exports.
 *
 * Responsibilities
 * ----------------
 * - Provide a single entry point for all configuration modules.
 * - Simplify imports throughout the application.
 * - Reduce import path duplication.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - @nestjs/config
 * ============================================================================
 */

import appConfig from './app.config';
import corsConfig from './cors.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';
import loggerConfig from './logger.config';
import swaggerConfig from './swagger.config';
import typeormConfig from './typeorm.config';

/**
 * --------------------------------------------------------------------------
 * Configuration Namespaces
 * --------------------------------------------------------------------------
 */

export { default as appConfig } from './app.config';
export { default as corsConfig } from './cors.config';
export { default as databaseConfig } from './database.config';
export { default as jwtConfig } from './jwt.config';
export { default as loggerConfig } from './logger.config';
export { default as swaggerConfig } from './swagger.config';
export { default as typeormConfig } from './typeorm.config';

/**
 * --------------------------------------------------------------------------
 * Environment Validation
 * --------------------------------------------------------------------------
 */

export { validate } from './validation';

/**
 * --------------------------------------------------------------------------
 * Convenience Export
 * --------------------------------------------------------------------------
 *
 * Import this array directly into ConfigModule.forRoot():
 *
 * ConfigModule.forRoot({
 *   isGlobal: true,
 *   load: configuration,
 *   validate,
 * });
 */

export const configuration = [
  appConfig,
  corsConfig,
  databaseConfig,
  jwtConfig,
  loggerConfig,
  swaggerConfig,
  typeormConfig,
] as const;
