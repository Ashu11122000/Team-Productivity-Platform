/**
 * ============================================================================
 * File: dashboard-calendar.dto.ts
 * ============================================================================
 *
 * Enterprise Dashboard Calendar DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents calendar information displayed on the dashboard.
 * - Provides a lightweight summary of upcoming task deadlines.
 * - Acts as a response-only DTO.
 * - Prevents persistence models from leaking outside the application.
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
 * - Add public holidays.
 * - Add recurring reminders.
 * - Add meeting events.
 * - Add task duration.
 * - Add event color coding.
 * ============================================================================
 */

import { ApiProperty } from '@nestjs/swagger';

export class DashboardCalendarItemDto {
  @ApiProperty({
    description: 'Task identifier.',
    format: 'uuid',
    example: '7d7a83a7-4d8b-4db6-b45d-0a45d1b13d9f',
  })
  id!: string;

  @ApiProperty({
    description: 'Task title.',
    example: 'Finish Dashboard Module',
  })
  title!: string;

  @ApiProperty({
    description: 'Due date.',
    example: '2026-07-28T10:30:00.000Z',
  })
  dueDate!: Date;

  @ApiProperty({
    description: 'Task completion status.',
    example: false,
  })
  completed!: boolean;

  @ApiProperty({
    description: 'Whether the task is overdue.',
    example: false,
  })
  overdue!: boolean;
}

export class DashboardCalendarDto {
  @ApiProperty({
    description: 'Total upcoming calendar events.',
    example: 8,
  })
  totalEvents: number = 0;

  @ApiProperty({
    description: 'Upcoming tasks shown on the dashboard calendar.',
    type: () => [DashboardCalendarItemDto],
  })
  upcomingEvents: DashboardCalendarItemDto[] = [];
}
