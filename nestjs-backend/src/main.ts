/*
 * ============================================================================
 * File: main.ts
 * ============================================================================
 *
 * Enterprise application bootstrap.
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
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
 * Compatible With
 * ----------------------------------------------------------------------------
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
   * ==========================================================================
   * Create Application
   * ==========================================================================
   */

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  /**
   * ==========================================================================
   * Logger
   * ==========================================================================
   */

  app.useLogger(app.get(PinoLogger));

  const logger = new Logger('Bootstrap');

  /**
   * ==========================================================================
   * Configuration
   * ==========================================================================
   */

  const configService = app.get(ConfigService);

  const appConfig = configService.get('app', { infer: true });

  const corsConfig = configService.get('cors', { infer: true });

  const swaggerConfig = configService.get('swagger', { infer: true });

  /**
   * ==========================================================================
   * Security Middleware
   * ==========================================================================
   */

  app.use(helmet());

  app.use(compression());

  app.use(cookieParser());

  /**
   * ==========================================================================
   * CORS
   * ==========================================================================
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
   * ==========================================================================
   * Global Prefix
   * ==========================================================================
   */

  app.setGlobalPrefix(appConfig?.globalPrefix ?? 'api');

  /**
   * ==========================================================================
   * API Versioning
   * ==========================================================================
   */

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: appConfig?.apiVersion ?? '1',
  });

  /**
   * ==========================================================================
   * Resolve Global Providers
   * ==========================================================================
   */

  const validationPipe = app.get(AppValidationPipe);

  const exceptionFilter = app.get(AllExceptionsFilter);

  const loggingInterceptor = app.get(LoggingInterceptor);

  const responseInterceptor = app.get(ResponseInterceptor);

  const timeoutInterceptor = app.get(TimeoutInterceptor);

  const cacheInterceptor = app.get(CacheInterceptor);

  /**
   * ==========================================================================
   * Global Validation
   * ==========================================================================
   */

  app.useGlobalPipes(validationPipe);

  /**
   * ==========================================================================
   * Global Exception Filter
   * ==========================================================================
   */

  app.useGlobalFilters(exceptionFilter);

  /**
   * ==========================================================================
   * Global Interceptors
   * ==========================================================================
   */

  app.useGlobalInterceptors(
    loggingInterceptor,
    responseInterceptor,
    timeoutInterceptor,
    cacheInterceptor,
  );

  /**
   * ==========================================================================
   * Swagger
   * ==========================================================================
   */

  if (swaggerConfig?.enabled) {
    setupSwagger(app);
  }

  /**
   * ==========================================================================
   * Graceful Shutdown
   * ==========================================================================
   */

  app.enableShutdownHooks();

  /**
   * ==========================================================================
   * Start Server
   * ==========================================================================
   */

  const port = appConfig?.port ?? 3001;

  await app.listen(port);

  /**
   * ==========================================================================
   * Startup Information
   * ==========================================================================
   */

  const applicationUrl = await app.getUrl();

  logger.log('========================================');
  logger.log(appConfig?.name ?? 'Team Productivity Platform');
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
