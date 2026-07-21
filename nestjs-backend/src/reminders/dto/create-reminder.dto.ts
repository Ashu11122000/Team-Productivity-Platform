/*
 * ============================================================================
 * File: create-reminder.dto.ts
 * ============================================================================
 *
 * Enterprise Create Reminder DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Validate incoming reminder creation requests.
 * - Provide Swagger documentation.
 * - Enforce business validation rules.
 * - Prevent invalid payloads from reaching the service layer.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - DTO only
 * - No business logic
 * - Validation-first
 * - Immutable request contract
 * - Swagger documented
 *
 * Notes
 * ----------------------------------------------------------------------------
 * FastAPI remains responsible for authentication.
 * NestJS validates the authenticated JWT and associates the reminder with
 * the authenticated user inside the service layer.
 * Therefore, userId is intentionally excluded from this DTO.
 * ============================================================================
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { ReminderRepeat } from '../enums/reminder-repeat.enum';
import { ReminderType } from '../enums/reminder-type.enum';

export class CreateReminderDto {
  @ApiProperty({
    example: 'Submit monthly progress report',
    description: 'Reminder title.',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @ApiPropertyOptional({
    example: 'Prepare analytics and submit the report before the deadline.',
    description: 'Optional reminder description.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    enum: ReminderType,
    example: ReminderType.TASK,
    description: 'Business type of the reminder.',
  })
  @IsEnum(ReminderType)
  type!: ReminderType;

  @ApiProperty({
    example: '2026-08-15T09:30:00.000Z',
    description: 'Reminder trigger date and time (UTC).',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  remindAt!: Date;

  @ApiPropertyOptional({
    enum: ReminderRepeat,
    example: ReminderRepeat.NONE,
    description: 'Reminder recurrence pattern.',
    default: ReminderRepeat.NONE,
  })
  @IsOptional()
  @IsEnum(ReminderRepeat)
  repeat?: ReminderRepeat = ReminderRepeat.NONE;

  @ApiPropertyOptional({
    example: true,
    description:
      'Whether this reminder should generate an in-app notification.',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  sendNotification?: boolean = true;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether this reminder should trigger an email notification.',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  sendEmail?: boolean = false;

  @ApiPropertyOptional({
    example: 15,
    description:
      'Number of minutes before remindAt when the reminder should trigger.',
    minimum: 0,
    maximum: 10080,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10080)
  reminderOffsetMinutes?: number = 0;

  @ApiPropertyOptional({
    example: '6c9645b5-9988-4429-a8cf-1af9db44a111',
    description:
      'Optional related Task identifier if this reminder belongs to a task.',
  })
  @IsOptional()
  @IsUUID('4')
  taskId?: string;

  @ApiPropertyOptional({
    example: 'fca774cb-bef8-4ee0-bc7b-d0b91e0ef95d',
    description:
      'Optional related Notification identifier for cross-module linking.',
  })
  @IsOptional()
  @IsUUID('4')
  notificationId?: string;

  @ApiPropertyOptional({
    example: {
      source: 'dashboard',
      color: '#4F46E5',
      priority: 'high',
    },
    description:
      'Optional metadata associated with the reminder. Stored as JSON.',
    type: Object,
  })
  @IsOptional()
  metadata?: Record<string, unknown>;
}
