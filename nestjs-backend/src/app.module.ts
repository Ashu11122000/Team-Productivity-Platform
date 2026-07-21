/* eslint-disable prettier/prettier */

import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

import { configuration, validate } from './config';

/**
 * --------------------------------------------------------------------------
 * Common Infrastructure
 * --------------------------------------------------------------------------
 */

import { AllExceptionsFilter } from './common/filters';

import {
  CacheInterceptor,
  LoggingInterceptor,
  ResponseInterceptor,
  TimeoutInterceptor,
} from './common/interceptors';

/**
 * --------------------------------------------------------------------------
 * Feature Modules
 * --------------------------------------------------------------------------
 */

import { ActivityLogsModule } from './activity-logs/activity-logs.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TagsModule } from './tags/tags.module';
import { TasksModule } from './tasks/tasks.module';

/**
 * ============================================================================
 * Root Application Module
 * ============================================================================
 *
 * Responsibilities
 * ----------------
 * - Configure global infrastructure.
 * - Register configuration.
 * - Configure logging.
 * - Configure database.
 * - Configure cache.
 * - Configure scheduler.
 * - Configure event emitter.
 * - Register feature modules.
 * - Register infrastructure providers.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Node.js 22+
 * ============================================================================
 */

@Module({
  imports: [
    /**
     * ------------------------------------------------------------------------
     * Configuration
     * ------------------------------------------------------------------------
     */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [...configuration],
      validate,
      expandVariables: true,
      cache: true,
    }),

    /**
     * ------------------------------------------------------------------------
     * Logger
     * ------------------------------------------------------------------------
     */
    LoggerModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          transport: configService.get<boolean>('app.isDevelopment')
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  colorize: true,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname',
                },
              }
            : undefined,

          autoLogging: true,
        },
      }),
    }),

    /**
     * ------------------------------------------------------------------------
     * Cache
     * ------------------------------------------------------------------------
     */
    CacheModule.register({
      isGlobal: true,
    }),

    /**
     * ------------------------------------------------------------------------
     * Scheduler
     * ------------------------------------------------------------------------
     */
    ScheduleModule.forRoot(),

    /**
     * ------------------------------------------------------------------------
     * Event Emitter
     * ------------------------------------------------------------------------
     */
    EventEmitterModule.forRoot(),

    /**
     * ------------------------------------------------------------------------
     * Database
     * ------------------------------------------------------------------------
     */
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',

        host: configService.get<string>('database.host'),

        port: configService.get<number>('database.port'),

        username: configService.get<string>('database.username'),

        password: configService.get<string>('database.password'),

        database: configService.get<string>('database.name'),

        autoLoadEntities: true,

        synchronize:
          configService.get<boolean>('database.synchronize') ?? false,

        logging: configService.get<boolean>('app.isDevelopment') ?? false,
      }),
    }),

    /**
     * ------------------------------------------------------------------------
     * Feature Modules
     * ------------------------------------------------------------------------
     */

    AuthModule,

    TasksModule,

    CategoriesModule,

    TagsModule,

    ActivityLogsModule,

    NotificationsModule,

    AnalyticsModule,

    /**
     * ------------------------------------------------------------------------
     * Upcoming Modules
     * ------------------------------------------------------------------------
     *
     * HealthModule
     * DashboardModule
     * CalendarModule
     * RemindersModule
     */
  ],

  /**
   * --------------------------------------------------------------------------
   * Infrastructure Providers
   * --------------------------------------------------------------------------
   *
   * Registered for Dependency Injection.
   *
   * They are intentionally NOT registered as APP_FILTER or
   * APP_INTERCEPTOR because bootstrap is handled explicitly
   * in main.ts.
   * --------------------------------------------------------------------------
   */
  providers: [
    AllExceptionsFilter,

    LoggingInterceptor,

    ResponseInterceptor,

    TimeoutInterceptor,

    CacheInterceptor,
  ],
})
export class AppModule {}