import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { EventEmitterModule } from '@nestjs/event-emitter';

import { ScheduleModule } from '@nestjs/schedule';

import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerModule } from 'nestjs-pino';

import { configuration, validate } from './config';

import typeormConfig from './config/typeorm.config';

/**
 * Common Infrastructure
 */
import { AllExceptionsFilter } from './common/filters';

import {
  CacheInterceptor,
  LoggingInterceptor,
  ResponseInterceptor,
  TimeoutInterceptor,
} from './common/interceptors';

/**
 * Feature Modules
 */

import { AuthModule } from './auth/auth.module';

import { TasksModule } from './tasks/tasks.module';

import { CategoriesModule } from './categories/categories.module';

import { TagsModule } from './tags/tags.module';

import { ActivityLogsModule } from './activity-logs/activity-logs.module';

import { NotificationsModule } from './notifications/notifications.module';

import { AnalyticsModule } from './analytics/analytics.module';

import { DashboardModule } from './dashboard/dashboard.module';

import { CalendarModule } from './calendar/calendar.module';

import { RemindersModule } from './reminders/reminders.module';

/**
 * Database Infrastructure
 */

import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    /**
     * Configuration
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
     * Logger
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
     * Cache
     */

    CacheModule.register({
      isGlobal: true,
    }),

    /**
     * Scheduler
     */

    ScheduleModule.forRoot(),

    /**
     * Events
     */

    EventEmitterModule.forRoot(),

    /**
     * Database
     */

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],

      useFactory: () => ({
        ...typeormConfig(),
      }),
    }),

    /**
     * Database Services
     */

    DatabaseModule,

    /**
     * Feature Modules
     */

    AuthModule,

    TasksModule,

    CategoriesModule,

    TagsModule,

    ActivityLogsModule,

    NotificationsModule,

    RemindersModule,

    AnalyticsModule,

    DashboardModule,

    CalendarModule,
  ],

  providers: [
    AllExceptionsFilter,

    LoggingInterceptor,

    ResponseInterceptor,

    TimeoutInterceptor,

    CacheInterceptor,
  ],
})
export class AppModule {}
