/*
 * ============================================================================
 * File: notification-response.dto.ts
 * ============================================================================
 *
 * Enterprise Notification Response DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents a notification returned by the API.
 * - Serves as the response contract between the controller and clients.
 * - Prevents NotificationEntity from being exposed directly.
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
 * ============================================================================
 */

import { ApiProperty } from '@nestjs/swagger';

import { NotificationStatus } from '../../common/enums/notification-status.enum';
import { NotificationType } from '../../common/enums/notification-type.enum';

export class NotificationResponseDto {
  @ApiProperty({
    description: 'Notification identifier.',
    format: 'uuid',
    example: '8b3a1d9d-73a8-4d84-9c87-2d90b95b0b0e',
  })
  id!: string;

  @ApiProperty({
    description: 'Notification title.',
    example: 'Task Completed',
  })
  title!: string;

  @ApiProperty({
    description: 'Notification message.',
    example: 'Your task "Enterprise Dashboard" has been completed.',
  })
  message!: string;

  @ApiProperty({
    description: 'Notification type.',
    enum: NotificationType,
    example: 'INFO',
  })
  type!: NotificationType;

  @ApiProperty({
    description: 'Notification status.',
    enum: NotificationStatus,
    example: NotificationStatus.UNREAD,
  })
  status!: NotificationStatus;

  @ApiProperty({
    description: 'Owner of the notification.',
    format: 'uuid',
    example: '54c5d0d4-f0e2-4fb5-bad3-cdb9ef93e8e7',
  })
  userId!: string;

  @ApiProperty({
    description: 'Notification creation timestamp.',
    example: '2026-07-21T10:15:30.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Notification last update timestamp.',
    example: '2026-07-21T10:20:45.000Z',
  })
  updatedAt!: Date;
}
