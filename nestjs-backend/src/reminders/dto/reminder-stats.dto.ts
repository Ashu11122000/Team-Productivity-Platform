/*
 * ============================================================================
 * File: reminder-stats.dto.ts
 * ============================================================================
 *
 * Enterprise Reminder Statistics DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents high-level reminder statistics.
 * - Used by dashboard, analytics, and reporting endpoints.
 * - Exposes aggregated metrics without leaking persistence models.
 * - Serves as the standardized API response contract for reminder statistics.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Response DTO only
 * - Immutable API contract
 * - No business logic
 * - Swagger documented
 * - Mapper populated
 *
 * Notes
 * ----------------------------------------------------------------------------
 * This DTO is populated by ReminderMapper using aggregated values returned
 * from RemindersRepository.
 *
 * Statistics are intended for dashboard cards, charts, widgets, and
 * productivity analytics.
 * ============================================================================
 */

import { ApiProperty } from '@nestjs/swagger';

export class ReminderStatsDto {
  @ApiProperty({
    description: 'Total number of reminders.',
    example: 245,
  })
  total!: number;

  @ApiProperty({
    description: 'Number of active reminders.',
    example: 196,
  })
  active!: number;

  @ApiProperty({
    description: 'Number of pending reminders.',
    example: 124,
  })
  pending!: number;

  @ApiProperty({
    description: 'Number of completed reminders.',
    example: 86,
  })
  completed!: number;

  @ApiProperty({
    description: 'Number of cancelled reminders.',
    example: 12,
  })
  cancelled!: number;

  @ApiProperty({
    description: 'Number of overdue reminders.',
    example: 18,
  })
  overdue!: number;

  @ApiProperty({
    description: 'Number of reminders scheduled for today.',
    example: 15,
  })
  today!: number;

  @ApiProperty({
    description: 'Number of upcoming reminders.',
    example: 42,
  })
  upcoming!: number;

  @ApiProperty({
    description: 'Number of recurring reminders.',
    example: 67,
  })
  recurring!: number;

  @ApiProperty({
    description: 'Number of reminders that have been soft deleted.',
    example: 9,
  })
  deleted!: number;

  @ApiProperty({
    description: 'Completion rate as a percentage.',
    example: 71.83,
  })
  completionRate!: number;

  @ApiProperty({
    description: 'Average reminders created per day.',
    example: 8.42,
  })
  averagePerDay!: number;
}
