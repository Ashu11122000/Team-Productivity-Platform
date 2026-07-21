/*
 * ============================================================================
 * File: mark-notification-read.dto.ts
 * ============================================================================
 *
 * Enterprise Mark Notification Read DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Defines the payload for marking a notification as read or unread.
 * - Validates the incoming request.
 * - Used by PATCH endpoints.
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
 * - Defaults to marking a notification as read.
 * - Can also be used to mark a notification as unread.
 * ============================================================================
 */

import { ApiPropertyOptional } from '@nestjs/swagger';

import { Transform } from 'class-transformer';

import { IsBoolean, IsOptional } from 'class-validator';

export class MarkNotificationReadDto {
  @ApiPropertyOptional({
    description: 'Whether the notification is marked as read.',
    example: true,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }

    return value;
  })
  @IsBoolean()
  read?: boolean = true;
}
