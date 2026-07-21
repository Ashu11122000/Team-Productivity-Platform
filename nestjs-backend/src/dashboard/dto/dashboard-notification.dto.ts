/*
 * ============================================================================
 * File: dashboard-notification.dto.ts
 * ============================================================================
 *
 * Enterprise Dashboard Notification DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents notification information displayed on the dashboard.
 * - Provides a lightweight summary of the user's latest notifications.
 * - Acts as a response-only DTO.
 * - Prevents persistence models from leaking outside the application.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - DTO Pattern
 * - Single Responsibility Principle (SRP)
 * - Strong Typing
 * - Swagger Compatible
 *
 * Compatible With
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - @nestjs/swagger
 *
 * Future Enhancements
 * ----------------------------------------------------------------------------
 * TODO:
 * - Support notification priority.
 * - Support notification category.
 * - Support notification actions.
 * - Support deep links.
 * - Support notification avatars/icons.
 * ============================================================================
 */

import { ApiProperty } from '@nestjs/swagger';

export class DashboardNotificationItemDto {
  @ApiProperty({
    description: 'Notification identifier.',
    format: 'uuid',
    example: '55a9628f-74b8-4a4d-92ba-88d7d6d2dcb5',
  })
  id!: string;

  @ApiProperty({
    description: 'Notification title.',
    example: 'Task Completed',
  })
  title!: string;

  @ApiProperty({
    description: 'Notification message.',
    example: 'Your task "Finish Dashboard Module" has been completed.',
  })
  message!: string;

  @ApiProperty({
    description: 'Notification type.',
    example: 'success',
  })
  type!: string;

  @ApiProperty({
    description: 'Whether the notification has been read.',
    example: false,
  })
  isRead!: boolean;

  @ApiProperty({
    description: 'Notification creation timestamp.',
    example: '2026-07-21T09:45:00.000Z',
  })
  createdAt!: Date;
}

export class DashboardNotificationDto {
  @ApiProperty({
    description: 'Total unread notifications.',
    example: 5,
  })
  unreadCount!: number;

  @ApiProperty({
    description: 'Latest notifications displayed on the dashboard.',
    type: () => [DashboardNotificationItemDto],
  })
  notifications!: DashboardNotificationItemDto[];
}
