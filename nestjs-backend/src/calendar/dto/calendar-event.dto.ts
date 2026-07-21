/*
 * ============================================================================
 * File: calendar-event.dto.ts
 * ============================================================================
 *
 * Enterprise Calendar Event DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents a unified calendar event returned to the frontend.
 * - Normalizes events originating from multiple sources.
 * - Supports holidays, reminders, tasks, notifications, and custom events.
 * - Provides a consistent API contract for calendar views.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - DTO only
 * - Immutable response contract
 * - No business logic
 * - Swagger documented
 *
 * Notes
 * ----------------------------------------------------------------------------
 * Calendar events may originate from:
 *
 * - Public Holidays
 * - Tasks
 * - Reminders
 * - Notifications
 * - Future integrations
 *
 * This DTO intentionally abstracts the underlying source.
 * ============================================================================
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CalendarEventDto {
  @ApiProperty({
    description: 'Unique event identifier.',
    example: '9e3f7a56-55b0-4ef4-a20c-8a53c0b11d75',
  })
  id!: string;

  @ApiProperty({
    description: 'Event title.',
    example: 'Project Deadline',
  })
  title!: string;

  @ApiPropertyOptional({
    description: 'Optional event description.',
    example: 'Complete backend refactoring before release.',
  })
  description?: string;

  @ApiProperty({
    description: 'Date and time of the event.',
    type: String,
    format: 'date-time',
    example: '2026-08-10T10:00:00.000Z',
  })
  date!: Date;

  @ApiProperty({
    description: 'Business type of the calendar event.',
    example: 'TASK',
    enum: ['HOLIDAY', 'TASK', 'REMINDER', 'NOTIFICATION', 'CUSTOM'],
  })
  type!: 'HOLIDAY' | 'TASK' | 'REMINDER' | 'NOTIFICATION' | 'CUSTOM';

  @ApiProperty({
    description: 'Color associated with the event.',
    example: '#3B82F6',
  })
  color!: string;

  @ApiProperty({
    description: 'Whether the event lasts the entire day.',
    example: true,
  })
  allDay!: boolean;

  @ApiPropertyOptional({
    description: 'Optional URL associated with the event.',
    example: '/dashboard/tasks/9e3f7a56-55b0-4ef4-a20c-8a53c0b11d75',
  })
  url?: string;

  @ApiPropertyOptional({
    description: 'Additional event metadata.',
    type: Object,
    example: {
      priority: 'HIGH',
      source: 'tasks',
      category: 'Work',
    },
  })
  metadata?: Record<string, unknown>;
}
