/**
 * ============================================================================
 * File: categories.module.ts
 * ============================================================================
 *
 * Enterprise Categories Module.
 *
 * Responsibilities
 * ----------------
 * - Register Categories domain components.
 * - Configure TypeORM entities.
 * - Register repositories.
 * - Register business services.
 * - Register HTTP controllers.
 * - Import supporting modules.
 *
 * Notes
 * -----
 * This module manages user-owned task categories.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM 0.3+
 * - PostgreSQL
 * - Node.js 22+
 * ============================================================================
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { NotificationsModule } from '../notifications/notifications.module';

import { CategoriesController } from './controllers/categories.controller';

import { Category } from './entities/category.entity';

import { CategoriesRepository } from './repositories/categories.repository';

import { CategoriesService } from './services/categories.service';

/**
 * ============================================================================
 * Categories Module
 * ============================================================================
 */
@Module({
  /**
   * --------------------------------------------------------------------------
   * Imports
   * --------------------------------------------------------------------------
   */
  imports: [
    TypeOrmModule.forFeature([Category]),

    ActivityLogsModule,

    NotificationsModule,
  ],

  /**
   * --------------------------------------------------------------------------
   * Controllers
   * --------------------------------------------------------------------------
   */
  controllers: [CategoriesController],

  /**
   * --------------------------------------------------------------------------
   * Providers
   * --------------------------------------------------------------------------
   */
  providers: [CategoriesRepository, CategoriesService],

  /**
   * --------------------------------------------------------------------------
   * Exports
   * --------------------------------------------------------------------------
   */
  exports: [CategoriesRepository, CategoriesService],
})
export class CategoriesModule {}
