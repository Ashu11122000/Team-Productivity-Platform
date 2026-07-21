/*
 * ============================================================================
 * File: reminders.module.ts
 * ============================================================================
 *
 * Enterprise Reminders Module
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Registers the Reminders feature.
 * - Configures dependency injection.
 * - Registers TypeORM entities.
 * - Wires together Controller, Service, Repository, and Mapper.
 *
 * Architecture
 * ----------------------------------------------------------------------------
 *
 * Controller
 *      │
 *      ▼
 * Service
 *      │
 *      ▼
 * Repository
 *      │
 *      ▼
 * PostgreSQL (TypeORM)
 *
 * Entity → Mapper → DTO
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Clean Architecture
 * - SOLID
 * - Repository Pattern
 * - Mapper Pattern
 * - Modular
 * - Production Ready
 * ============================================================================
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RemindersController } from './controllers/reminders.controller';

import { ReminderEntity } from './entities/reminder.entity';

import { ReminderMapper } from './mappers/reminder.mapper';

import { RemindersRepository } from './repositories/reminders.repository';

import { RemindersService } from './services/reminders.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReminderEntity])],

  controllers: [RemindersController],

  providers: [RemindersRepository, ReminderMapper, RemindersService],

  exports: [RemindersService, RemindersRepository, ReminderMapper],
})
export class RemindersModule {}
