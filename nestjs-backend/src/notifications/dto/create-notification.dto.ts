/*
 * ============================================================================
 * File: create-notification.dto.ts
 * ============================================================================
 *
 * Enterprise Create Notification DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Validates notification creation requests.
 * - Defines the contract for creating notifications.
 * - Prevents invalid payloads from reaching the service layer.
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
 * - userId is NOT supplied by clients.
 * - userId is obtained from the authenticated JWT.
 * - createdAt, updatedAt and isRead are managed by the server.
 *
 * ============================================================================
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { NotificationType } from '../../common/enums';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Notification title.',
    example: 'Task Completed',
    maxLength: 150,
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  // definite assignment assertion because properties are populated by validation/transform at runtime
  title!: string;

  @ApiProperty({
    description: 'Notification message.',
    example: 'Your task "Build Dashboard" has been completed.',
    maxLength: 1000,
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  // definite assignment assertion: populated by validation/transform at runtime
  message!: string;

  @ApiProperty({
    description: 'Notification type.',
    enum: NotificationType,
    example: 'info',
  })
  @IsEnum(NotificationType)
  // definite assignment assertion because properties are populated by validation/transform at runtime
  type!: NotificationType;

  @ApiPropertyOptional({
    description: 'Related entity identifier.',
    format: 'uuid',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiPropertyOptional({
    description: 'Related entity type.',
    example: 'task',
  })
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  @MaxLength(50)
  entityType?: string;

  @ApiPropertyOptional({
    description: 'Whether the notification is already read.',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean = false;
}
