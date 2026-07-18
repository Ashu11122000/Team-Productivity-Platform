/**
 * ============================================================================
 * File: swagger.config.ts
 * ============================================================================
 *
 * Swagger (OpenAPI) configuration for the Team Productivity Platform.
 *
 * Responsibilities
 * ----------------
 * - Centralize Swagger configuration.
 * - Provide strongly typed OpenAPI settings.
 * - Configure JWT Bearer authentication.
 * - Support environment-based Swagger enablement.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - @nestjs/swagger
 * ============================================================================
 */

import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  /**
   * --------------------------------------------------------------------------
   * Enable / Disable Swagger
   * --------------------------------------------------------------------------
   *
   * Example:
   * SWAGGER_ENABLED=true
   */
  enabled: process.env.SWAGGER_ENABLED === 'true',

  /**
   * --------------------------------------------------------------------------
   * Swagger Route
   * --------------------------------------------------------------------------
   *
   * Example:
   * api/docs
   */
  path: process.env.SWAGGER_PATH ?? 'api/docs',

  /**
   * --------------------------------------------------------------------------
   * API Metadata
   * --------------------------------------------------------------------------
   */
  title: process.env.APP_NAME ?? 'Team Productivity Platform API',

  description:
    'Enterprise-grade Team Productivity Platform backend built with NestJS.',

  version: process.env.APP_VERSION ?? '1.0.0',

  /**
   * --------------------------------------------------------------------------
   * Contact Information
   * --------------------------------------------------------------------------
   */
  contact: {
    name: 'Ashish Sharma',

    email: 'ashish@example.com',

    url: 'https://github.com/Ashu11122000',
  },

  /**
   * --------------------------------------------------------------------------
   * License Information
   * --------------------------------------------------------------------------
   */
  license: {
    name: 'MIT',

    url: 'https://opensource.org/licenses/MIT',
  },

  /**
   * --------------------------------------------------------------------------
   * API Tags
   * --------------------------------------------------------------------------
   *
   * Used for grouping controllers.
   */
  tags: [
    'Authentication',
    'Tasks',
    'Categories',
    'Tags',
    'Notifications',
    'Analytics',
    'Calendar',
    'Dashboard',
    'Reminders',
    'Health',
  ],

  /**
   * --------------------------------------------------------------------------
   * JWT Authentication
   * --------------------------------------------------------------------------
   */
  bearer: {
    type: 'http',

    scheme: 'bearer',

    bearerFormat: 'JWT',

    name: 'Authorization',

    description:
      'Enter JWT access token obtained from the FastAPI authentication service.',
  },
}));
