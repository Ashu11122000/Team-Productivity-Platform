/*
 * ============================================================================
 * File: calendar-response.dto.ts
 * ============================================================================
 *
 * Enterprise Calendar Response DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Standard API response for calendar endpoints.
 * - Wraps calendar events together with summary information.
 * - Provides a consistent response contract for frontend applications.
 * - Supports future expansion without breaking API compatibility.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - DTO only
 * - Immutable response contract
 * - No business logic
 * - Swagger documented
 * - Production ready
 *
 * Notes
 * ----------------------------------------------------------------------------
 * Unlike CalendarOverviewDto (used for dashboards), this DTO represents the
 * standard response returned by Calendar APIs.
 *
 * It can be safely extended in the future with pagination, filtering metadata,
 * or synchronization information without changing existing consumers.
 * ============================================================================
 */

import { ApiProperty } from '@nestjs/swagger';

import { CalendarEventDto } from './calendar-event.dto';

export class CalendarResponseDto {
  @ApiProperty({
    description: 'Calendar events.',
    type: () => [CalendarEventDto],
  })
  events!: CalendarEventDto[];

  @ApiProperty({
    description: 'Total number of calendar events.',
    example: 24,
  })
  total!: number;

  @ApiProperty({
    description: 'Whether additional events are available.',
    example: false,
  })
  hasMore!: boolean;

  @ApiProperty({
    description: 'Timestamp when the response was generated.',
    type: String,
    format: 'date-time',
    example: '2026-07-21T11:30:00.000Z',
  })
  generatedAt!: Date;
}
