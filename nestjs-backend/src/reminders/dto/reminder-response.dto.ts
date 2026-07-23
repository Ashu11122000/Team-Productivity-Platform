/*
 * ============================================================================
 * File: reminder-response.dto.ts
 * ============================================================================
 *
 * Enterprise Reminder Response DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents a reminder returned by the API.
 * - Prevents exposing TypeORM entities directly.
 * - Provides a stable response contract for clients.
 * - Documents all response fields using Swagger.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Response DTO only
 * - Immutable API contract
 * - No business logic
 * - No persistence concerns
 * - Swagger documented
 *
 * Notes
 * ----------------------------------------------------------------------------
 * This DTO is populated exclusively by ReminderMapper.
 * Controllers should never return ReminderEntity instances directly.
 * ============================================================================
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ReminderRepeat } from '../enums/reminder-repeat.enum';
import { ReminderStatus } from '../enums/reminder-status.enum';
import { ReminderType } from '../enums/reminder-type.enum';

export class ReminderResponseDto {
  @ApiProperty({
    description: 'Unique reminder identifier.',
    example: '6c9645b5-9988-4429-a8cf-1af9db44a111',
  })
  id!: string;

  @ApiProperty({
    description:
      'Owner of the reminder (FastAPI authenticated user identifier).',
    example: 1,
  })
  userId!: number;

  @ApiProperty({
    description: 'Reminder title.',
    example: 'Submit monthly progress report',
  })
  title!: string;

  @ApiPropertyOptional({
    description: 'Reminder description.',
    example: 'Prepare analytics and submit the report before the deadline.',
  })
  description?: string | null;

  @ApiProperty({
    description: 'Reminder type.',
    enum: ReminderType,
    example: ReminderType.TASK,
  })
  type!: ReminderType;

  @ApiProperty({
    description: 'Current reminder status.',
    enum: ReminderStatus,
    example: ReminderStatus.PENDING,
  })
  status!: ReminderStatus;

  @ApiProperty({
    description: 'Reminder repeat configuration.',
    enum: ReminderRepeat,
    example: ReminderRepeat.NONE,
  })
  repeat!: ReminderRepeat;

  @ApiProperty({
    description: 'Date and time when the reminder should trigger.',
    type: String,
    format: 'date-time',
    example: '2026-08-15T09:30:00.000Z',
  })
  remindAt!: Date;

  @ApiProperty({
    description: 'Minutes before remindAt when the reminder should trigger.',
    example: 15,
  })
  reminderOffsetMinutes!: number;

  @ApiProperty({
    description: 'Whether in-app notifications are enabled.',
    example: true,
  })
  sendNotification!: boolean;

  @ApiProperty({
    description: 'Whether email notifications are enabled.',
    example: false,
  })
  sendEmail!: boolean;

  @ApiPropertyOptional({
    description: 'Linked task identifier.',
    example: 'ef98714e-d26a-46c5-a760-d0bdbd4efb15',
  })
  taskId?: string | null;

  @ApiPropertyOptional({
    description: 'Linked notification identifier.',
    example: '29f4d9a2-79a8-42b7-8ef5-89d6e24c519b',
  })
  notificationId?: string | null;

  @ApiPropertyOptional({
    description: 'Additional reminder metadata.',
    type: Object,
    example: {
      source: 'dashboard',
      color: '#4F46E5',
      priority: 'high',
    },
  })
  metadata?: Record<string, unknown> | null;

  @ApiPropertyOptional({
    description: 'Date and time when the reminder was completed.',
    type: String,
    format: 'date-time',
    example: '2026-08-15T09:45:00.000Z',
  })
  completedAt?: Date | null;

  @ApiPropertyOptional({
    description: 'Date and time when the reminder was last triggered.',
    type: String,
    format: 'date-time',
    example: '2026-08-15T09:30:00.000Z',
  })
  triggeredAt?: Date | null;

  @ApiProperty({
    description: 'Reminder creation timestamp.',
    type: String,
    format: 'date-time',
    example: '2026-07-21T10:15:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Reminder last update timestamp.',
    type: String,
    format: 'date-time',
    example: '2026-07-22T11:45:00.000Z',
  })
  updatedAt!: Date;

  @ApiPropertyOptional({
    description: 'Soft deletion timestamp.',
    type: String,
    format: 'date-time',
    nullable: true,
    example: null,
  })
  deletedAt?: Date | null;
}
