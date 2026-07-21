import { ApiProperty } from '@nestjs/swagger';

/**
 * ============================================================================
 * File: productivity-trend.dto.ts
 * ============================================================================
 *
 * Productivity Trend Response DTO.
 *
 * Responsibilities
 * ----------------
 * - Represent productivity metrics for a specific time period.
 * - Support dashboard charts and time-series analytics.
 * - Encapsulate task creation and completion statistics.
 * - Hide persistence-layer implementation details.
 *
 * Notes
 * -----
 * Returned by:
 * - GET /analytics/trends
 * - GET /analytics/productivity
 * - GET /analytics/dashboard
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Swagger
 * ============================================================================
 */
export class ProductivityTrendDto {
  @ApiProperty({
    description: 'Time period represented by this data point (ISO date).',
    example: '2026-07-21',
  })
  readonly period!: string;

  @ApiProperty({
    description: 'Number of tasks created during the selected period.',
    example: 18,
  })
  readonly tasksCreated!: number;

  @ApiProperty({
    description: 'Number of tasks completed during the selected period.',
    example: 14,
  })
  readonly tasksCompleted!: number;

  @ApiProperty({
    description: 'Number of overdue tasks during the selected period.',
    example: 2,
  })
  readonly overdueTasks!: number;

  @ApiProperty({
    description: 'Task completion percentage for the selected period.',
    example: 77.78,
  })
  readonly productivityRate!: number;
}
