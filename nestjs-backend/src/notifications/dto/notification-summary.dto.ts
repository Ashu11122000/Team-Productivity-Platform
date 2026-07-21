/*
 * ============================================================================
 * File: notification-summary.dto.ts
 * ============================================================================
 *
 * Enterprise Notification Summary DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents aggregated notification statistics.
 * - Used for notification summary endpoints and dashboard widgets.
 * - Exposes high-level notification metrics to API consumers.
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
 * Future Enhancements
 * ----------------------------------------------------------------------------
 * TODO:
 * - Add notification breakdown by type.
 * - Add archived notification count.
 * - Add today's notification count.
 * - Add weekly notification statistics.
 * ============================================================================
 */

import { ApiProperty } from '@nestjs/swagger';

export class NotificationSummaryDto {
  @ApiProperty({
    description: 'Total number of notifications.',
    example: 125,
  })
  total: number = 0;

  @ApiProperty({
    description: 'Total unread notifications.',
    example: 12,
  })
  unread: number = 0;

  @ApiProperty({
    description: 'Total read notifications.',
    example: 113,
  })
  read: number = 0;
}
