/***
 * ============================================================================
 * File: dashboard-overview.dto.ts
 * ============================================================================
 *
 * Enterprise Dashboard Overview DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents the high-level dashboard overview returned to API clients.
 * - Provides aggregated statistics for the authenticated user.
 * - Serves as a response-only DTO.
 * - Prevents internal business models from leaking outside the application.
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
 * - Add active projects count.
 * - Add archived tasks count.
 * - Add productivity score.
 * - Add weekly completion rate.
 * ============================================================================
 */

import { ApiProperty } from '@nestjs/swagger';

export class DashboardOverviewDto {
  @ApiProperty({
    description: 'Total number of tasks.',
    example: 125,
  })
  totalTasks!: number;

  @ApiProperty({
    description: 'Number of completed tasks.',
    example: 87,
  })
  completedTasks!: number;

  @ApiProperty({
    description: 'Number of pending tasks.',
    example: 28,
  })
  pendingTasks!: number;

  @ApiProperty({
    description: 'Number of in-progress tasks.',
    example: 8,
  })
  inProgressTasks!: number;

  @ApiProperty({
    description: 'Number of overdue tasks.',
    example: 2,
  })
  overdueTasks!: number;

  @ApiProperty({
    description: 'Number of cancelled tasks.',
    example: 0,
  })
  cancelledTasks!: number;

  @ApiProperty({
    description: 'Task completion percentage.',
    example: 69.6,
  })
  completionRate!: number;

  @ApiProperty({
    description: 'Total number of categories.',
    example: 12,
  })
  totalCategories!: number;

  @ApiProperty({
    description: 'Total number of tags.',
    example: 31,
  })
  totalTags!: number;

  @ApiProperty({
    description: 'Total unread notifications.',
    example: 5,
  })
  unreadNotifications!: number;

  @ApiProperty({
    description: 'Total upcoming reminders.',
    example: 4,
  })
  upcomingReminders!: number;
}
