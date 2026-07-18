/**
 * ============================================================================
 * File: database.config.ts
 * ============================================================================
 *
 * Database configuration for the Team Productivity Platform.
 *
 * Responsibilities
 * ----------------
 * - Provide strongly typed PostgreSQL configuration.
 * - Centralize all database-related environment variables.
 * - Supply configuration for TypeORM.
 * - Support future production SSL configuration.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - @nestjs/config
 * - PostgreSQL
 * - TypeORM 0.3+
 * ============================================================================
 */

import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  /**
   * Database connection information.
   */
  host: process.env.DATABASE_HOST ?? 'localhost',

  port: Number(process.env.DATABASE_PORT ?? 5432),

  username: process.env.DATABASE_USER ?? 'postgres',

  password: process.env.DATABASE_PASSWORD ?? '',

  database: process.env.DATABASE_NAME ?? 'postgres',

  /**
   * Connection settings.
   */
  synchronize: false,

  logging: process.env.NODE_ENV === 'development',

  ssl: process.env.NODE_ENV === 'production',

  /**
   * Connection Pool
   *
   * These values may be adjusted depending on workload.
   */
  pool: {
    min: 2,

    max: 10,

    idleTimeoutMillis: 30000,

    connectionTimeoutMillis: 5000,
  },

  /**
   * Retry configuration.
   */
  retryAttempts: 5,

  retryDelay: 3000,
}));
