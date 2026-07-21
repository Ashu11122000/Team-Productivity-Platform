/*
 * ============================================================================
 * File: dashboard.module.ts
 * ============================================================================
 *
 * Enterprise Dashboard Module
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Register dashboard feature dependencies.
 * - Provide dashboard controllers/services.
 * - Configure repository access.
 * - Keep dashboard module isolated and scalable.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Feature-based architecture
 * - Dependency Injection
 * - Single Responsibility
 * - Modular design
 *
 * ============================================================================
 */

import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './controllers/dashboard.controller';

import { DashboardService } from './services/dashboard.service';

import { DashboardRepository } from './repositories/dashboard.repository';

import { DashboardMapper } from './mappers/dashboard.mapper';

import { TaskEntity } from '../tasks/entities/task.entity';

import { NotificationEntity } from '../notifications/entities/notification.entity';

import { TasksModule } from '../tasks/tasks.module';

import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    /**
     * Dashboard performs read operations
     * against task and notification data.
     */
    TypeOrmModule.forFeature([TaskEntity, NotificationEntity]),

    /**
     * Imported for future integrations:
     *
     * - Task ownership validation
     * - Notification services
     * - Activity integration
     *
     * Existing modules remain independent.
     */
    TasksModule,

    NotificationsModule,
  ],

  controllers: [DashboardController],

  providers: [DashboardService, DashboardRepository, DashboardMapper],

  exports: [DashboardService],
})
export class DashboardModule {}
