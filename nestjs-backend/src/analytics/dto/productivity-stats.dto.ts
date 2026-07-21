import { ApiProperty } from '@nestjs/swagger';

/**
 * ============================================================================
 * File: productivity-stats.dto.ts
 * ============================================================================
 *
 * Productivity Statistics Response DTO.
 *
 * Responsibilities
 * ----------------
 * - Represent high-level productivity metrics.
 * - Provide aggregated task statistics.
 * - Support dashboard widgets and analytics reports.
 * - Prevent exposure of persistence-layer models.
 *
 * Notes
 * -----
 * Returned by:
 * - GET /analytics/productivity
 * - GET /analytics/dashboard
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Swagger
 * ============================================================================
 */
export class ProductivityStatsDto {
  @ApiProperty({
    description: 'Total number of tasks.',
    example: 150,
  })
  readonly totalTasks!: number;

  @ApiProperty({
    description: 'Number of completed tasks.',
    example: 110,
  })
  readonly completedTasks!: number;

  @ApiProperty({
    description: 'Number of pending tasks.',
    example: 25,
  })
  readonly pendingTasks!: number;

  @ApiProperty({
    description: 'Number of tasks currently in progress.',
    example: 15,
  })
  readonly inProgressTasks!: number;

  @ApiProperty({
    description: 'Number of overdue tasks.',
    example: 10,
  })
  readonly overdueTasks!: number;

  @ApiProperty({
    description: 'Overall task completion percentage.',
    example: 73.33,
  })
  readonly completionRate!: number;
}
