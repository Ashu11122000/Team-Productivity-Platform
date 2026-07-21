/*
 * ============================================================================
 * File: notification.entity.ts
 * ============================================================================
 *
 * Enterprise Notification Entity
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents user notifications.
 * - Stores notification lifecycle information.
 * - Supports soft deletion.
 * * Design Principles
 * ----------------------------------------------------------------------------
 * - Clean Architecture
 * - Single Responsibility Principle (SRP)
 * - TypeORM Best Practices
 * - Strong Typing
 *
 * Compatible With
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - TypeORM 0.3+
 * - PostgreSQL
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Authentication is handled by FastAPI.
 * - userId comes from the authenticated JWT.
 * - Notifications are owned by a single user.
 * ============================================================================
 */

import { ApiProperty } from '@nestjs/swagger';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { NotificationStatus } from '../../common/enums/notification-status.enum';
import { NotificationType } from '../../common/enums/notification-type.enum';

@Entity({
  name: 'notifications',
})
@Index('IDX_NOTIFICATION_USER_STATUS', ['userId', 'status'])
@Index('IDX_NOTIFICATION_USER_TYPE', ['userId', 'type'])
@Index('IDX_NOTIFICATION_CREATED_AT', ['createdAt'])
@Index('IDX_NOTIFICATION_USER_STATUS_CREATED', [
  'userId',
  'status',
  'createdAt',
])
export class NotificationEntity {
  @ApiProperty({
    description: 'Notification unique identifier.',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    description: 'Notification title.',
    example: 'Task Due Soon',
  })
  @Column({
    type: 'varchar',
    length: 255,
  })
  title!: string;

  @ApiProperty({
    description: 'Notification message.',
    example: 'Your task "Complete NestJS Assignment" is due soon.',
  })
  @Column({
    type: 'text',
  })
  message!: string;

  @ApiProperty({
    description: 'Notification type.',
    enum: NotificationType,
    example: NotificationType.TASK_DUE,
  })
  @Index('IDX_NOTIFICATION_TYPE')
  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type!: NotificationType;

  @ApiProperty({
    description: 'Notification status.',
    enum: NotificationStatus,
    example: NotificationStatus.UNREAD,
  })
  @Index('IDX_NOTIFICATION_STATUS')
  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.UNREAD,
  })
  status!: NotificationStatus;

  @ApiProperty({
    description: 'Authenticated user identifier.',
    example: '1',
  })
  @Index('IDX_NOTIFICATION_USER_ID')
  @Column({
    type: 'varchar',
    length: 255,
  })
  userId!: string;

  @ApiProperty({
    description: 'Related entity identifier.',
    format: 'uuid',
    required: false,
    nullable: true,
    example: '550e8400-e29b-41d4-a716-446655440111',
  })
  @Column({
    type: 'uuid',
    nullable: true,
  })
  entityId?: string | null;

  @ApiProperty({
    description: 'Related entity type.',
    required: false,
    nullable: true,
    example: 'task',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  entityType?: string | null;

  @ApiProperty({
    description: 'Timestamp when the notification was read.',
    required: false,
    nullable: true,
    example: '2026-06-13T10:30:00.000Z',
  })
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  readAt?: Date | null;

  @ApiProperty({
    description: 'Notification creation timestamp.',
    example: '2026-06-13T08:00:00.000Z',
  })
  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Notification last update timestamp.',
    example: '2026-06-13T10:30:00.000Z',
  })
  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt!: Date;

  @ApiProperty({
    description: 'Soft deletion timestamp.',
    required: false,
    nullable: true,
  })
  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt?: Date | null;
}
