/**
 * ============================================================================
 * File: typeorm.config.ts
 * ============================================================================
 *
 * TypeORM configuration for the Team Productivity Platform.
 *
 * Responsibilities
 * ----------------
 * - Build TypeORM options.
 * - Configure PostgreSQL.
 * - Configure entities.
 * - Configure migrations.
 * - Configure logging.
 * - Configure connection pool.
 *
 * This file is ONLY used by NestJS.
 *
 * The TypeORM CLI DataSource will be created separately in:
 *
 * src/database/data-source.ts
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM 0.3+
 * - PostgreSQL
 * ============================================================================
 */

import { join } from 'node:path';

import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('typeorm', (): TypeOrmModuleOptions => ({
  /**
   * ------------------------------------------------------------------------
   * Database Type
   * ------------------------------------------------------------------------
   */
  type: 'postgres',

  /**
   * ------------------------------------------------------------------------
   * Connection
   * ------------------------------------------------------------------------
   */
  host: process.env.DATABASE_HOST,

  port: Number(process.env.DATABASE_PORT),

  username: process.env.DATABASE_USER,

  password: process.env.DATABASE_PASSWORD,

  database: process.env.DATABASE_NAME,

  /**
   * ------------------------------------------------------------------------
   * Entities
   * ------------------------------------------------------------------------
   *
   * Automatically loads entities registered with
   * TypeOrmModule.forFeature().
   */
  autoLoadEntities: true,

  /**
   * ------------------------------------------------------------------------
   * Synchronization
   * ------------------------------------------------------------------------
   *
   * Never enable synchronize in production.
   */
  synchronize: false,

  /**
   * ------------------------------------------------------------------------
   * Logging
   * ------------------------------------------------------------------------
   */
  logging: process.env.NODE_ENV === 'development',

  /**
   * ------------------------------------------------------------------------
   * SSL
   * ------------------------------------------------------------------------
   */
  ssl:
    process.env.NODE_ENV === 'production'
      ? {
          rejectUnauthorized: false,
        }
      : false,

  /**
   * ------------------------------------------------------------------------
   * Connection Pool
   * ------------------------------------------------------------------------
   */
  extra: {
    max: 10,

    min: 2,

    idleTimeoutMillis: 30000,

    connectionTimeoutMillis: 5000,
  },

  /**
   * ------------------------------------------------------------------------
   * Retry
   * ------------------------------------------------------------------------
   */
  retryAttempts: 5,

  retryDelay: 3000,

  /**
   * ------------------------------------------------------------------------
   * Migrations
   * ------------------------------------------------------------------------
   */
  migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],

  migrationsRun: false,

  /**
   * ------------------------------------------------------------------------
   * Subscribers
   * ------------------------------------------------------------------------
   */
  subscribers: [join(__dirname, '../database/subscribers/*{.ts,.js}')],
}));
