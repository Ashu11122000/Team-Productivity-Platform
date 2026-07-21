import { ApiProperty } from '@nestjs/swagger';

/**
 * ============================================================================
 * File: task-summary.dto.ts
 * ============================================================================
 *
 * Task Summary Response DTO.
 *
 * Responsibilities
 * ----------------
 * - Represent aggregated task statistics.
 * - Provide dashboard-friendly metrics.
 * - Hide persistence-layer implementation details.
 * - Prevent exposure of database entities.
 *
 * Notes
 * -----
 * Returned by:
 * - GET /analytics/dashboard
 * - GET /analytics/task-summary
 *
 * This DTO mirrors the summary returned by the Tasks module and is intended
 * solely for API responses.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Swagger
 * ============================================================================
 */

export class TaskSummaryDto {
  @ApiProperty({
    description: 'Total number of tasks.',
    example: 120,
  })
  readonly totalTasks!: number;

  @ApiProperty({
    description: 'Number of completed tasks.',
    example: 40,
  })
  readonly completedTasks!: number;

  @ApiProperty({
    description: 'Number of pending tasks.',
    example: 55,
  })
  readonly pendingTasks!: number;

  @ApiProperty({
    description: 'Number of tasks currently in progress.',
    example: 15,
  })
  readonly inProgressTasks!: number;

  @ApiProperty({
    description: 'Number of overdue tasks.',
    example: 8,
  })
  readonly overdueTasks!: number;

  @ApiProperty({
    description: 'Number of cancelled tasks.',
    example: 10,
  })
  readonly cancelledTasks!: number;

  @ApiProperty({
    description: 'Task completion percentage.',
    example: 33.33,
  })
  readonly completionRate!: number;
}
