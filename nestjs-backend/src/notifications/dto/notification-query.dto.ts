/*
 * ============================================================================
 * File: notification-query.dto.ts
 * ============================================================================
 *
 * Enterprise Notification Query DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Validates notification query parameters.
 * - Supports pagination.
 * - Supports filtering.
 * - Supports sorting.
 * - Used by NotificationController.
 *
 * Compatible With
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - class-validator
 * - class-transformer
 * - @nestjs/swagger
 * ============================================================================
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

import { NotificationStatus } from '../../common/enums/notification-status.enum';
import { NotificationType } from '../../common/enums/notification-type.enum';

export class NotificationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number.',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page.',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Notification status.',
    enum: NotificationStatus,
  })
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  @ApiPropertyOptional({
    description: 'Notification type.',
    enum: NotificationType,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiPropertyOptional({
    description: 'Field used for sorting.',
    example: 'createdAt',
    default: 'createdAt',
    enum: ['title', 'type', 'status', 'createdAt', 'updatedAt'],
  })
  @IsOptional()
  @IsIn(['title', 'type', 'status', 'createdAt', 'updatedAt'])
  sortBy?: 'title' | 'type' | 'status' | 'createdAt' | 'updatedAt' =
    'createdAt';

  @ApiPropertyOptional({
    description: 'Sort direction.',
    example: 'DESC',
    default: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
