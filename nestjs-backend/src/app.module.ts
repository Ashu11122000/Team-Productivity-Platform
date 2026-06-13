/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerModule } from 'nestjs-pino';

import { configuration } from './config';

import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { ActivityLogsModule } from './activity-logs/activity-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: configuration,
    }),

    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                },
              }
            : undefined,
      },
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (
        configService: ConfigService,
      ) => ({
        type: 'postgres',

        host: configService.get<string>(
          'database.host',
        ),

        port: configService.get<number>(
          'database.port',
        ),

        username: configService.get<string>(
          'database.username',
        ),

        password: configService.get<string>(
          'database.password',
        ),

        database: configService.get<string>(
          'database.name',
        ),

        autoLoadEntities: true,

        synchronize: false,

        logging:
          configService.get<string>(
            'nodeEnv',
          ) === 'development',
      }),
    }),

    AuthModule,
    HealthModule,
    TasksModule,
    CategoriesModule,
    TagsModule,
    ActivityLogsModule,
  ],
})
export class AppModule {}