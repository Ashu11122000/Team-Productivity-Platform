/*
 * ============================================================================
 * File: reminder-summary.dto.ts
 * ============================================================================
 *
 * Enterprise Reminder Summary DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents summarized reminder statistics.
 * - Used by dashboard widgets and analytics endpoints.
 * - Provides a lightweight overview without returning full reminder records.
 * - Serves as the API response contract for summary endpoints.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Response DTO only
 * - No business logic
 * - Immutable response model
 * - Swagger documented
 * - Mapper populated
 *
 * Notes
 * ----------------------------------------------------------------------------
 * This DTO is populated exclusively by ReminderMapper using aggregated data
 * returned from RemindersRepository.
 * ============================================================================
 */

import { ApiProperty } from '@nestjs/swagger';

export class ReminderSummaryDto {
  @ApiProperty({
    description: 'Total number of reminders.',
    example: 148,
  })
  total!: number;

  @ApiProperty({
    description: 'Number of pending reminders.',
    example: 62,
  })
  pending!: number;

  @ApiProperty({
    description: 'Number of completed reminders.',
    example: 54,
  })
  completed!: number;

  @ApiProperty({
    description: 'Number of cancelled reminders.',
    example: 8,
  })
  cancelled!: number;

  @ApiProperty({
    description: 'Number of overdue reminders.',
    example: 11,
  })
  overdue!: number;

  @ApiProperty({
    description: 'Number of reminders scheduled for today.',
    example: 9,
  })
  today!: number;

  @ApiProperty({
    description: 'Number of reminders scheduled within the next 7 days.',
    example: 27,
  })
  upcoming!: number;

  @ApiProperty({
    description: 'Number of recurring reminders.',
    example: 41,
  })
  recurring!: number;

  @ApiProperty({
    description: 'Number of archived (soft deleted) reminders.',
    example: 5,
  })
  deleted!: number;
}
