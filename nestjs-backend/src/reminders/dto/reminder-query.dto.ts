/*
 * ============================================================================
 * File: reminder-query.dto.ts
 * ============================================================================
 *
 * Enterprise Reminder Query DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Validate reminder query parameters.
 * - Support filtering, searching, sorting, and pagination.
 * - Provide a strongly typed request contract for controllers.
 * * Design Principles
 * ----------------------------------------------------------------------------
 * - DTO only
 * - No business logic
 * - Validation-first
 * - Swagger documented
 * - Reusable across repository and service layers
 *
 * Supported Features
 * ----------------------------------------------------------------------------
 * - Pagination
 * - Keyword search
 * - Status filtering
 * - Type filtering
 * - Repeat filtering
 * - Date range filtering
 * - Related Task filtering
 * - Notification filtering
 * - Sorting
 * - Active/Deleted filtering
 * ============================================================================
 */

import { ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { ReminderRepeat } from '../enums/reminder-repeat.enum';
import { ReminderStatus } from '../enums/reminder-status.enum';
import { ReminderType } from '../enums/reminder-type.enum';

export class ReminderQueryDto {
  @ApiPropertyOptional({
    description: 'Page number.',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Records per page.',
    example: 20,
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Search by title or description.',
    example: 'meeting',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by reminder status.',
    enum: ReminderStatus,
    example: ReminderStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(ReminderStatus)
  status?: ReminderStatus;

  @ApiPropertyOptional({
    description: 'Filter by reminder type.',
    enum: ReminderType,
    example: ReminderType.TASK,
  })
  @IsOptional()
  @IsEnum(ReminderType)
  type?: ReminderType;

  @ApiPropertyOptional({
    description: 'Filter by repeat type.',
    enum: ReminderRepeat,
    example: ReminderRepeat.DAILY,
  })
  @IsOptional()
  @IsEnum(ReminderRepeat)
  repeat?: ReminderRepeat;

  @ApiPropertyOptional({
    description: 'Filter reminders scheduled from this date.',
    type: String,
    format: 'date-time',
    example: '2026-08-01T00:00:00.000Z',
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  fromDate?: Date;

  @ApiPropertyOptional({
    description: 'Filter reminders scheduled until this date.',
    type: String,
    format: 'date-time',
    example: '2026-08-31T23:59:59.999Z',
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  toDate?: Date;

  @ApiPropertyOptional({
    description: 'Filter reminders linked to a specific task.',
    example: '8c6b3a0d-f2e5-4e6e-a15d-0d6390cf91ef',
  })
  @IsOptional()
  @IsUUID('4')
  taskId?: string;

  @ApiPropertyOptional({
    description: 'Filter reminders linked to a notification.',
    example: '5d8c23fb-8f83-4694-b90d-9dca68ab1c5d',
  })
  @IsOptional()
  @IsUUID('4')
  notificationId?: string;

  @ApiPropertyOptional({
    description: 'Return only overdue reminders.',
    example: false,
    default: false,
  })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  overdue?: boolean;

  @ApiPropertyOptional({
    description: 'Include soft deleted reminders.',
    example: false,
    default: false,
  })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  includeDeleted?: boolean;

  @ApiPropertyOptional({
    description: 'Sort field.',
    example: 'remindAt',
    default: 'remindAt',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  sortBy?: string = 'remindAt';

  @ApiPropertyOptional({
    description: 'Sort direction.',
    example: 'ASC',
    enum: ['ASC', 'DESC'],
    default: 'ASC',
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
