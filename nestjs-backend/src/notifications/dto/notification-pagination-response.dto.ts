/*
 * ============================================================================
 * File: notification-pagination-response.dto.ts
 * ============================================================================
 *
 * Enterprise Notification Pagination Response DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents a paginated notification response.
 * - Encapsulates notification collection with pagination metadata.
 * - Returned by NotificationController list endpoints.
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

import { NotificationResponseDto } from './notification-response.dto';

export class NotificationPaginationResponseDto {
  @ApiProperty({
    description: 'Notifications.',
    type: () => [NotificationResponseDto],
  })
  items!: NotificationResponseDto[];

  @ApiProperty({
    description: 'Total notifications.',
    example: 150,
  })
  total!: number;

  @ApiProperty({
    description: 'Current page.',
    example: 1,
  })
  page!: number;

  @ApiProperty({
    description: 'Items per page.',
    example: 10,
  })
  limit!: number;

  @ApiProperty({
    description: 'Total pages.',
    example: 15,
  })
  totalPages!: number;

  @ApiProperty({
    description: 'Whether another page exists.',
    example: true,
  })
  hasNextPage!: boolean;

  @ApiProperty({
    description: 'Whether a previous page exists.',
    example: false,
  })
  hasPreviousPage!: boolean;
}
