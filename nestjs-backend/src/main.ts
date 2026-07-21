/* eslint-disable prettier/prettier */

/**
 * ============================================================================
 * File: main.ts
 * ============================================================================
 *
 * Enterprise application bootstrap.
 *
 * Responsibilities
 * ----------------
 * - Create Nest application
 * - Configure logger
 * - Configure security middleware
 * - Configure HTTP middleware
 * - Configure CORS
 * - Configure API versioning
 * - Configure global prefix
 * - Register global pipes
 * - Register global filters
 * - Register global interceptors
 * - Configure Swagger
 * - Enable graceful shutdown
 * - Start HTTP server
 *
 * This file intentionally contains NO business logic.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Node.js 22+
 * ============================================================================
 */

import { Logger, VersioningType } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { Logger as PinoLogger } from 'nestjs-pino';

import { AppModule } from './app.module';

import { setupSwagger } from './config/swagger.config';

import { AllExceptionsFilter } from './common/filters';

import {
  CacheInterceptor,
  LoggingInterceptor,
  ResponseInterceptor,
  TimeoutInterceptor,
} from './common/interceptors';

import { AppValidationPipe } from './common/pipes';

async function bootstrap(): Promise<void> {
  /**
   * --------------------------------------------------------------------------
   * Create Application
   * --------------------------------------------------------------------------
   */

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  /**
   * --------------------------------------------------------------------------
   * Logger
   * --------------------------------------------------------------------------
   */

  app.useLogger(app.get(PinoLogger));

  const logger = new Logger('Bootstrap');

  /**
   * --------------------------------------------------------------------------
   * Configuration
   * --------------------------------------------------------------------------
   */

  const configService = app.get(ConfigService);

  const appConfig = configService.get('app');
  const corsConfig = configService.get('cors');
  const swaggerConfig = configService.get('swagger');

  /**
   * --------------------------------------------------------------------------
   * Security Middleware
   * --------------------------------------------------------------------------
   */

  app.use(helmet());

  app.use(compression());

  app.use(cookieParser());

  /**
   * --------------------------------------------------------------------------
   * CORS
   * --------------------------------------------------------------------------
   */

  app.enableCors({
    origin: corsConfig?.origin,
    credentials: corsConfig?.credentials,
    methods: corsConfig?.methods,
    allowedHeaders: corsConfig?.allowedHeaders,
    exposedHeaders: corsConfig?.exposedHeaders,
    maxAge: corsConfig?.maxAge,
  });

  /**
   * --------------------------------------------------------------------------
   * Global Prefix
   * --------------------------------------------------------------------------
   */

  app.setGlobalPrefix(appConfig?.globalPrefix ?? 'api');

  /**
   * --------------------------------------------------------------------------
   * URI Versioning
   * --------------------------------------------------------------------------
   */

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: appConfig?.apiVersion ?? '1',
  });

  /**
   * --------------------------------------------------------------------------
   * Global Pipes
   * --------------------------------------------------------------------------
   */

  app.useGlobalPipes(app.get(AppValidationPipe));

  /**
   * --------------------------------------------------------------------------
   * Global Exception Filter
   * --------------------------------------------------------------------------
   */

  app.useGlobalFilters(app.get(AllExceptionsFilter));

  /**
   * --------------------------------------------------------------------------
   * Global Interceptors
   * --------------------------------------------------------------------------
   *
   * Order Matters:
   *
   * Logging
   *      ↓
   * Response
   *      ↓
   * Timeout
   *      ↓
   * Cache
   * --------------------------------------------------------------------------
   */

  app.useGlobalInterceptors(
    app.get(LoggingInterceptor),
    app.get(ResponseInterceptor),
    app.get(TimeoutInterceptor),
    app.get(CacheInterceptor),
  );

  /**
   * --------------------------------------------------------------------------
   * Swagger
   * --------------------------------------------------------------------------
   */

  if (swaggerConfig?.enabled) {
    setupSwagger(app);
  }

  /**
   * --------------------------------------------------------------------------
   * Graceful Shutdown
   * --------------------------------------------------------------------------
   */

  app.enableShutdownHooks();

  /**
   * --------------------------------------------------------------------------
   * Start Server
   * --------------------------------------------------------------------------
   */

  const port = appConfig?.port ?? 3001;

  await app.listen(port);

  /**
   * --------------------------------------------------------------------------
   * Startup Logs
   * --------------------------------------------------------------------------
   */

  const applicationUrl = await app.getUrl();

  logger.log('========================================');
  logger.log(`${appConfig?.name}`);
  logger.log('Application started successfully');
  logger.log(`Environment : ${appConfig?.environment}`);
  logger.log(`Port        : ${port}`);
  logger.log(`API         : ${applicationUrl}/${appConfig?.globalPrefix}/v1`);

  if (swaggerConfig?.enabled) {
    logger.log(`Swagger     : ${applicationUrl}/${swaggerConfig.path}`);
  }

  logger.log('========================================');
}

void bootstrap();
