/**
 * ============================================================================
 * File: activity-logs.module.ts
 * ============================================================================
 *
 * Enterprise Activity Logs Module.
 *
 * Responsibilities
 * ----------------
 * - Register Activity Logs domain components.
 * - Configure TypeORM entities.
 * - Register repositories.
 * - Register business services.
 * - Register HTTP controllers.
 *
 * Notes
 * -----
 * This module provides an immutable audit trail for all significant
 * business operations across the application.
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

import { ActivityLogsController } from './controllers/activity-logs.controller';

import { ActivityLog } from './entities/activity-log.entity';

import { ActivityLogsRepository } from './repositories/activity-logs.repository';

import { ActivityLogsService } from './services/activity-logs.service';

/**
 * ============================================================================
 * Activity Logs Module
 * ============================================================================
 */
@Module({
  /**
   * --------------------------------------------------------------------------
   * Imports
   * --------------------------------------------------------------------------
   */
  imports: [TypeOrmModule.forFeature([ActivityLog])],

  /**
   * --------------------------------------------------------------------------
   * Controllers
   * --------------------------------------------------------------------------
   */
  controllers: [ActivityLogsController],

  /**
   * --------------------------------------------------------------------------
   * Providers
   * --------------------------------------------------------------------------
   */
  providers: [ActivityLogsRepository, ActivityLogsService],

  /**
   * --------------------------------------------------------------------------
   * Exports
   * --------------------------------------------------------------------------
   */
  exports: [ActivityLogsRepository, ActivityLogsService],
})
export class ActivityLogsModule {}
