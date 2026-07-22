/*
 * ============================================================================
 * File: main.ts
 * ============================================================================
 *
 * Enterprise application bootstrap.
 * Compatible with NestJS 11
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

  app.useLogger(app.get(PinoLogger));

  const logger = new Logger('Bootstrap');

  /**
   * --------------------------------------------------------------------------
   * Configuration
   * --------------------------------------------------------------------------
   */

  const configService = app.get(ConfigService);

  const appConfig = configService.get('app', { infer: true });

  const corsConfig = configService.get('cors', { infer: true });

  const swaggerConfig = configService.get('swagger', { infer: true });

  /**
   * --------------------------------------------------------------------------
   * Defaults (if config missing)
   * --------------------------------------------------------------------------
   */

  const appName = appConfig?.name ?? 'Team Productivity Platform NestJS API';

  const environment =
    appConfig?.environment ?? process.env.NODE_ENV ?? 'development';

  const port = appConfig?.port ?? Number(process.env.PORT ?? 3001);

  const globalPrefix =
    appConfig?.globalPrefix ??
    process.env.API_PREFIX?.replace('/v1', '') ??
    'api';

  const apiVersion = appConfig?.apiVersion ?? '1';

  /**
   * --------------------------------------------------------------------------
   * Middleware
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

  app.setGlobalPrefix(globalPrefix);

  /**
   * --------------------------------------------------------------------------
   * Versioning
   * --------------------------------------------------------------------------
   */

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: apiVersion,
  });

  /**
   * --------------------------------------------------------------------------
   * Global Providers
   * --------------------------------------------------------------------------
   */

  app.useGlobalPipes(app.get(AppValidationPipe));

  app.useGlobalFilters(app.get(AllExceptionsFilter));

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

  await app.listen(port);

  const url = await app.getUrl();

  logger.log('========================================');
  logger.log(appName);
  logger.log('Application started successfully');
  logger.log(`Environment : ${environment}`);
  logger.log(`Port        : ${port}`);
  logger.log(`API         : ${url}/${globalPrefix}/v${apiVersion}`);

  if (swaggerConfig?.enabled) {
    logger.log(`Swagger     : ${url}/${swaggerConfig.path ?? 'api/docs'}`);
  }

  logger.log('========================================');
}

void bootstrap();
