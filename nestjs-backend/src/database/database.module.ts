/*
 * ============================================================================
 * File: database.module.ts
 * ============================================================================
 *
 * Enterprise Database Module
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Provide database infrastructure services.
 * - Register database seed infrastructure.
 * - Register database subscribers.
 * - Centralize database-related providers.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Modular Architecture
 * - Dependency Injection
 * - Single Responsibility
 * - Infrastructure Isolation
 *
 * Important
 * ----------------------------------------------------------------------------
 * This module does NOT:
 *
 * - Run migrations
 * - Contain business logic
 * - Own feature repositories
 * - Replace feature modules
 *
 *
 * TypeORM runtime configuration:
 *
 * src/config/typeorm.config.ts
 *
 *
 * TypeORM CLI DataSource:
 *
 * src/database/data-source.ts
 *
 * ============================================================================
 */

import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

// ============================================================================
// Entities
// ============================================================================

import { Category as CategoryEntity } from '../categories/entities/category.entity';

import { TagEntity } from '../tags/entities/tag.entity';

// ============================================================================
// Seeder Infrastructure
// ============================================================================

import { SeedService } from './seeds/seed.service';

import { SeedCategoryRepository } from './seeds/repositories/seed-category.repository';

import { SeedTagRepository } from './seeds/repositories/seed-tag.repository';

// ============================================================================
// Database Subscribers
// ============================================================================

import { TimestampSubscriber } from './subscribers';

@Module({
  imports: [
    /**
     * Seed repositories require TypeORM repositories.
     */
    TypeOrmModule.forFeature([CategoryEntity, TagEntity]),
  ],

  providers: [
    /**
     * Seeder orchestration.
     */
    SeedService,

    /**
     * Seeder repositories.
     */
    SeedCategoryRepository,

    SeedTagRepository,

    /**
     * Global database lifecycle hooks.
     */
    TimestampSubscriber,
  ],

  exports: [
    /**
     * Export only what other modules need.
     */
    SeedService,
  ],
})
export class DatabaseModule {}
