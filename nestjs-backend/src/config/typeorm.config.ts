/**
 * ============================================================================
 * File: typeorm.config.ts
 * ============================================================================
 *
 * TypeORM configuration for Team Productivity Platform.
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Configure PostgreSQL connection.
 * - Configure TypeORM runtime options.
 * - Configure migrations.
 * - Configure subscribers.
 *
 * Runtime usage:
 * - NestJS application
 *
 * CLI usage:
 * - src/database/data-source.ts
 *
 * Compatible:
 * - NestJS 11
 * - TypeORM 0.3+
 * - PostgreSQL
 * ============================================================================
 */

import { join } from 'node:path';

import { registerAs } from '@nestjs/config';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('typeorm', (): TypeOrmModuleOptions => ({
  // ------------------------------------------------------------------------
  // Database
  // ------------------------------------------------------------------------

  type: 'postgres',

  host: process.env.DATABASE_HOST ?? 'localhost',

  port: Number(process.env.DATABASE_PORT ?? 5432),

  username: process.env.DATABASE_USER,

  password: process.env.DATABASE_PASSWORD,

  database: process.env.DATABASE_NAME,

  // ------------------------------------------------------------------------
  // Entities
  // ------------------------------------------------------------------------

  /**
   * Entities are registered through:
   *
   * TypeOrmModule.forFeature()
   *
   * inside feature modules.
   */
  autoLoadEntities: true,

  // ------------------------------------------------------------------------
  // Schema Management
  // ------------------------------------------------------------------------

  /**
   * NEVER enable in production.
   *
   * Database changes must happen through migrations.
   */
  synchronize: false,

  // ------------------------------------------------------------------------
  // Logging
  // ------------------------------------------------------------------------

  logging:
    process.env.NODE_ENV === 'development'
      ? ['error', 'warn', 'schema']
      : false,

  // ------------------------------------------------------------------------
  // SSL
  // ------------------------------------------------------------------------

  ssl:
    process.env.NODE_ENV === 'production'
      ? {
          rejectUnauthorized: false,
        }
      : false,

  // ------------------------------------------------------------------------
  // Connection Pool
  // ------------------------------------------------------------------------

  extra: {
    max: 10,

    min: 2,

    idleTimeoutMillis: 30000,

    connectionTimeoutMillis: 5000,
  },

  // ------------------------------------------------------------------------
  // Retry
  // ------------------------------------------------------------------------

  retryAttempts: 5,

  retryDelay: 3000,

  // ------------------------------------------------------------------------
  // Migrations
  // ------------------------------------------------------------------------

  migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],

  migrationsRun: false,

  // ------------------------------------------------------------------------
  // Subscribers
  // ------------------------------------------------------------------------

  subscribers: [join(__dirname, '../database/subscribers/*{.ts,.js}')],
}));
