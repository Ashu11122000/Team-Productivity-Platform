/*
 * ============================================================================
 * File: data-source.ts
 * ============================================================================
 *
 * TypeORM CLI DataSource
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Used ONLY by TypeORM CLI.
 * - Runs migrations.
 * - Generates migrations.
 * - Reverts migrations.
 *
 * This file is NOT used by NestJS runtime.
 *
 * NestJS runtime configuration:
 *
 * src/config/typeorm.config.ts
 *
 * Compatible:
 * ----------------------------------------------------------------------------
 * - TypeORM 0.3+
 * - PostgreSQL
 * - NestJS 11
 *
 * ============================================================================
 */

import 'dotenv/config';

import { DataSource } from 'typeorm';

import { join } from 'node:path';

const entitiesPath = join(__dirname, '../**/*.entity{.ts,.js}');

const migrationsPath = join(__dirname, './migrations/*{.ts,.js}');

const subscribersPath = join(__dirname, './subscribers/*{.ts,.js}');

const AppDataSource = new DataSource({
  // =========================================================================
  // DATASOURCE NAME
  // =========================================================================

  name: 'productivity-db',

  // =========================================================================
  // DATABASE
  // =========================================================================

  type: 'postgres',

  host: process.env.DATABASE_HOST,

  port: Number(process.env.DATABASE_PORT ?? 5432),

  username: process.env.DATABASE_USER,

  password: process.env.DATABASE_PASSWORD,

  database: process.env.DATABASE_NAME,

  // =========================================================================
  // SCHEMA MANAGEMENT
  // =========================================================================

  /**
   * Migrations control schema changes.
   *
   * NEVER enable synchronize.
   */
  synchronize: false,

  // =========================================================================
  // MIGRATION SETTINGS
  // =========================================================================

  migrationsRun: false,

  // =========================================================================
  // LOGGING
  // =========================================================================

  logging:
    process.env.NODE_ENV === 'development'
      ? ['error', 'warn', 'schema']
      : false,

  // =========================================================================
  // ENTITIES
  // =========================================================================

  entities: [entitiesPath],

  // =========================================================================
  // MIGRATIONS
  // =========================================================================

  migrations: [migrationsPath],

  // =========================================================================
  // SUBSCRIBERS
  // =========================================================================

  subscribers: [subscribersPath],

  // =========================================================================
  // POSTGRES CONNECTION POOL
  // =========================================================================

  extra: {
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),

    min: Number(process.env.DATABASE_POOL_MIN ?? 2),

    idleTimeoutMillis: 30000,

    connectionTimeoutMillis: 5000,

    /**
     * Prevent silent pool failures.
     */
    application_name: 'team-productivity-nestjs',
  },
});

export default AppDataSource;
