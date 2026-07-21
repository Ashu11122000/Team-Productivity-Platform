/*
 * ============================================================================
 * File: notifications.module.ts
 * ============================================================================
 *
 * Enterprise Notifications Module
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Registers all notification dependencies.
 * - Configures TypeORM entity registration.
 * - Wires Controller, Service, Repository, and Mapper.
 * - Exposes NotificationsService to other modules.
 *
 * Architecture
 * ----------------------------------------------------------------------------
 *
 * NotificationsModule
 * │
 * ├── NotificationEntity
 * ├── NotificationsRepository
 * ├── NotificationMapper
 * ├── NotificationsService
 * └── NotificationsController
 *
 * Compatible With
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - TypeORM 0.3+
 * ============================================================================
 */

import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationEntity } from './entities/notification.entity';

import { NotificationsController } from './controllers/notifications.controller';

import { NotificationMapper } from './mapper/notification.mapper';

import { NotificationsRepository } from './repositories/notifications.repository';

import { NotificationsService } from './services/notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity])],

  controllers: [NotificationsController],

  providers: [
    NotificationsRepository,
    NotificationMapper,
    NotificationsService,
  ],

  exports: [NotificationsService],
})
export class NotificationsModule {}
