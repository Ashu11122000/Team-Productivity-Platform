/*
 * ============================================================================
 * File: notification-stats.dto.ts
 * ============================================================================
 *
 * Enterprise Notification Statistics DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents aggregated notification statistics returned by the API.
 * - Used for analytics and dashboard endpoints.
 * - Exposes notification statistics to API consumers.
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
 * - Add daily statistics.
 * - Add weekly statistics.
 * - Add monthly statistics.
 * - Add notification trend analytics.
 * - Add average notifications per day.
 * ============================================================================
 */

import { ApiProperty } from '@nestjs/swagger';

import { NotificationType } from '../../common/enums/notification-type.enum';

export class NotificationTypeStatsDto {
  @ApiProperty({
    description: 'Notification type.',
    enum: NotificationType,
    example: NotificationType.TASK_DUE,
  })
  type!: NotificationType;

  @ApiProperty({
    description: 'Number of notifications.',
    example: 15,
  })
  count!: number;
}

export class NotificationStatsDto {
  @ApiProperty({
    description: 'Total active notifications.',
    example: 150,
  })
  total!: number;

  @ApiProperty({
    description: 'Total unread notifications.',
    example: 18,
  })
  unread!: number;

  @ApiProperty({
    description: 'Total read notifications.',
    example: 132,
  })
  read!: number;

  @ApiProperty({
    description: 'Total soft-deleted notifications.',
    example: 7,
  })
  deleted!: number;

  @ApiProperty({
    description: 'Notification distribution by type.',
    type: () => [NotificationTypeStatsDto],
  })
  byType!: NotificationTypeStatsDto[];
}
