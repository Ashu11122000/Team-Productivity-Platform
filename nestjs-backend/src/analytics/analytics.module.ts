/**
 * ============================================================================
 * File: analytics.module.ts
 * ============================================================================
 *
 * Enterprise Analytics Module.
 *
 * Responsibilities
 * ----------------
 * - Register analytics feature dependencies.
 * - Configure TypeORM entities required by analytics repository.
 * - Provide analytics service, repository, and mapper.
 * - Expose analytics controller endpoints.
 *
 *
 * Architecture
 * ------------
 *
 * Controller
 *      |
 *      ▼
 * AnalyticsService
 *      |
 *      ▼
 * AnalyticsRepository
 *      |
 *      ▼
 * TypeORM
 *      |
 *      ▼
 * PostgreSQL
 *
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM 0.3+
 *
 * ============================================================================
 */

import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AnalyticsController } from './controllers/analytics.controller';

import { AnalyticsService } from './services/analytics.service';

import { AnalyticsRepository } from './repositories/analytics.repository';

import { AnalyticsMapper } from './mappers/analytics.mapper';

import { TaskEntity } from '../tasks/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity])],

  controllers: [AnalyticsController],

  providers: [AnalyticsService, AnalyticsRepository, AnalyticsMapper],

  exports: [AnalyticsService],
})
export class AnalyticsModule {}
