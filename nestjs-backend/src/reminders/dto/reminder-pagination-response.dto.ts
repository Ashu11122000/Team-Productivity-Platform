/*
 * ============================================================================
 * File: reminder-pagination-response.dto.ts
 * ============================================================================
 *
 * Enterprise Reminder Pagination Response DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents a paginated collection of reminders.
 * - Provides pagination metadata required by frontend applications.
 * - Standardizes paginated API responses across modules.
 * - Prevents exposing persistence-layer pagination models.
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
 * This DTO is populated by ReminderMapper using the paginated result returned
 * from RemindersRepository.
 *
 * The structure intentionally mirrors the pagination response used in the
 * Tasks, Tags, and Notifications modules to maintain consistency throughout
 * the application.
 * ============================================================================
 */

import { ApiProperty } from '@nestjs/swagger';

import { ReminderResponseDto } from './reminder-response.dto';

export class ReminderPaginationResponseDto {
  @ApiProperty({
    description: 'Paginated reminder records.',
    type: () => [ReminderResponseDto],
  })
  items!: ReminderResponseDto[];

  @ApiProperty({
    description: 'Total number of matching reminders.',
    example: 128,
  })
  total!: number;

  @ApiProperty({
    description: 'Current page number.',
    example: 1,
  })
  page!: number;

  @ApiProperty({
    description: 'Number of records per page.',
    example: 20,
  })
  limit!: number;

  @ApiProperty({
    description: 'Total number of available pages.',
    example: 7,
  })
  totalPages!: number;

  @ApiProperty({
    description: 'Whether another page exists after the current page.',
    example: true,
  })
  hasNext!: boolean;

  @ApiProperty({
    description: 'Whether a previous page exists before the current page.',
    example: false,
  })
  hasPrevious!: boolean;
}
