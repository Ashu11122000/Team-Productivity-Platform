/*
 * ============================================================================
 * File: calendar-overview.dto.ts
 * ============================================================================
 *
 * Enterprise Calendar Overview DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents the complete calendar overview returned to the frontend.
 * - Aggregates holidays, reminders, tasks, notifications, and upcoming events.
 * - Provides a single response model for calendar dashboards.
 * - Prevents leaking provider-specific models.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - DTO only
 * - Immutable response contract
 * - No business logic
 * - Swagger documented
 * - Portfolio ready
 *
 * Notes
 * ----------------------------------------------------------------------------
 * This DTO is intended for the Calendar Dashboard page where multiple event
 * sources are displayed together in a single response.
 *
 * Data is populated by CalendarService and transformed through CalendarMapper.
 * ============================================================================
 */

import { ApiProperty } from '@nestjs/swagger';

import { CalendarEventDto } from './calendar-event.dto';

export class CalendarOverviewDto {
  @ApiProperty({
    description: 'All calendar events.',
    type: () => [CalendarEventDto],
  })
  events!: CalendarEventDto[];

  @ApiProperty({
    description: 'Upcoming calendar events.',
    type: () => [CalendarEventDto],
  })
  upcomingEvents!: CalendarEventDto[];

  @ApiProperty({
    description: 'Public holidays.',
    type: () => [CalendarEventDto],
  })
  holidays!: CalendarEventDto[];

  @ApiProperty({
    description: 'Task-related calendar events.',
    type: () => [CalendarEventDto],
  })
  tasks!: CalendarEventDto[];

  @ApiProperty({
    description: 'Reminder-related calendar events.',
    type: () => [CalendarEventDto],
  })
  reminders!: CalendarEventDto[];

  @ApiProperty({
    description: 'Notification-related calendar events.',
    type: () => [CalendarEventDto],
  })
  notifications!: CalendarEventDto[];

  @ApiProperty({
    description: 'Total number of events.',
    example: 42,
  })
  totalEvents!: number;

  @ApiProperty({
    description: 'Total number of holidays.',
    example: 12,
  })
  totalHolidays!: number;

  @ApiProperty({
    description: 'Total number of reminders.',
    example: 8,
  })
  totalReminders!: number;

  @ApiProperty({
    description: 'Total number of task events.',
    example: 15,
  })
  totalTasks!: number;

  @ApiProperty({
    description: 'Total number of notification events.',
    example: 7,
  })
  totalNotifications!: number;
}
