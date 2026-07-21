/**
 * ============================================================================
 * File: tags.module.ts
 * ============================================================================
 *
 * Enterprise Tags Module.
 *
 * Responsibilities
 * ----------------
 * - Register Tags feature dependencies.
 * - Configure TypeORM entities.
 * - Provide Controller, Service, Repository, and Mapper.
 * - Export TagsService for other modules.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM 0.3+
 * ============================================================================
 */

import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { TagEntity } from './entities/tag.entity';

import { TagsController } from './controllers/tags.controller';

import { TagsService } from './services/tags.service';

import { TagsRepository } from './repositories/tags.repository';

import { TagMapper } from './mappers/tag.mapper';

import { ActivityLogsModule } from '../activity-logs/activity-logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity]), ActivityLogsModule],

  controllers: [TagsController],

  providers: [TagsService, TagsRepository, TagMapper],

  exports: [TagsService],
})
export class TagsModule {}
