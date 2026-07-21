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
 * - Build Swagger documentation.
 * - Register Swagger UI.
 * - Keep main.ts clean.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - @nestjs/swagger
 * ============================================================================
 */

import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { registerAs } from '@nestjs/config';

/**
 * ============================================================================
 * Swagger Configuration Namespace
 * ============================================================================
 */
export default registerAs('swagger', () => ({
  /**
   * Enable / Disable Swagger
   */
  enabled: process.env.SWAGGER_ENABLED === 'true',

  /**
   * Swagger Route
   */
  path: process.env.SWAGGER_PATH ?? 'api/docs',

  /**
   * API Metadata
   */
  title: process.env.APP_NAME ?? 'Team Productivity Platform API',

  description:
    'Enterprise-grade Team Productivity Platform backend built with NestJS.',

  version: process.env.APP_VERSION ?? '1.0.0',

  /**
   * Contact Information
   */
  contact: {
    name: 'Ashish Sharma',

    email: 'ashish@example.com',

    url: 'https://github.com/Ashu11122000',
  },

  /**
   * License Information
   */
  license: {
    name: 'MIT',

    url: 'https://opensource.org/licenses/MIT',
  },

  /**
   * API Tags
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
   * JWT Authentication
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

/**
 * ============================================================================
 * Swagger Bootstrap
 * ============================================================================
 *
 * Builds and registers the OpenAPI document.
 *
 * This function should be called once from main.ts.
 *
 * ============================================================================
 */
export function setupSwagger(app: INestApplication): void {
  const configService = app.get(ConfigService);

  const swagger = configService.get('swagger');

  if (!swagger?.enabled) {
    return;
  }

  const builder = new DocumentBuilder()
    .setTitle(swagger.title)
    .setDescription(swagger.description)
    .setVersion(swagger.version)
    .setContact(
      swagger.contact.name,
      swagger.contact.url,
      swagger.contact.email,
    )
    .setLicense(swagger.license.name, swagger.license.url)
    .addBearerAuth(
      {
        type: swagger.bearer.type,
        scheme: swagger.bearer.scheme,
        bearerFormat: swagger.bearer.bearerFormat,
        description: swagger.bearer.description,
        name: swagger.bearer.name,
        in: 'header',
      },
      'JWT',
    );

  for (const tag of swagger.tags) {
    builder.addTag(tag);
  }

  const document = SwaggerModule.createDocument(app, builder.build());

  SwaggerModule.setup(swagger.path, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },

    customSiteTitle: `${swagger.title} Documentation`,
  });
}
