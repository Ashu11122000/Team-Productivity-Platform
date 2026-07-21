/*
 * ============================================================================
 * File: update-notification.dto.ts
 * ============================================================================
 *
 * Enterprise Update Notification DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Defines the payload for updating an existing notification.
 * - Supports partial updates.
 * - Validates incoming request data.
 * - Prevents invalid values from reaching the service layer.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - DTO Pattern
 * - Single Responsibility Principle (SRP)
 * - Strong Validation
 * - Swagger Compatible
 *
 * Compatible With
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - class-validator
 * - class-transformer
 * - @nestjs/swagger
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - All properties are optional.
 * - Clients cannot update:
 *   - id
 *   - userId
 *   - createdAt
 *   - updatedAt
 * - Ownership is enforced by the authenticated JWT.
 *
 * ============================================================================
 */

import { ApiPropertyOptional } from '@nestjs/swagger';

import { Transform } from 'class-transformer';

import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { NotificationType } from '../../common/enums';

export class UpdateNotificationDto {
  @ApiPropertyOptional({
    description: 'Notification title.',
    example: 'Task Updated',
    maxLength: 150,
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MaxLength(150)
  title?: string;

  @ApiPropertyOptional({
    description: 'Notification message.',
    example: 'Your task has been successfully updated.',
    maxLength: 1000,
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MaxLength(1000)
  message?: string;

  @ApiPropertyOptional({
    description: 'Notification type.',
    enum: NotificationType,
    // Use a string example matching enum keys/values to avoid TS errors when a specific member
    // may not exist across different enum definitions.
    example: 'INFO',
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiPropertyOptional({
    description: 'Associated entity identifier.',
    format: 'uuid',
    example: '6d62b0b0-d1fb-4e8c-ae9b-80e3e8e9d5c3',
  })
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiPropertyOptional({
    description: 'Associated entity type.',
    example: 'task',
    maxLength: 50,
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MaxLength(50)
  entityType?: string;

  @ApiPropertyOptional({
    description: 'Whether the notification has been read.',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
