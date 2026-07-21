import { ApiProperty } from '@nestjs/swagger';

import { AnalyticsOverviewDto } from './analytics-overview.dto';
import { ProductivityStatsDto } from './productivity-stats.dto';
import { ProductivityTrendDto } from './productivity-trend.dto';
import { TaskPriorityDto } from './task-priority.dto';
import { TaskStatusStatsDto } from './task-status-stats.dto';
import { TaskSummaryDto } from './task-summary.dto';

/**
 * ============================================================================
 * File: dashboard-response.dto.ts
 * ============================================================================
 *
 * Dashboard Response DTO.
 *
 * Responsibilities
 * ----------------
 * - Aggregate all analytics data required by the dashboard.
 * - Compose smaller response DTOs into a single dashboard response.
 * - Hide persistence-layer implementation details.
 * - Prevent database entities from being exposed through the API.
 *
 * Notes
 * -----
 * Returned by:
 *
 * GET /analytics/dashboard
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Swagger
 * ============================================================================
 */
export class DashboardResponseDto {
  @ApiProperty({
    description: 'Overall analytics overview.',
    type: AnalyticsOverviewDto,
  })
  readonly overview!: AnalyticsOverviewDto;

  @ApiProperty({
    description: 'Overall productivity statistics.',
    type: ProductivityStatsDto,
  })
  readonly productivity!: ProductivityStatsDto;

  @ApiProperty({
    description: 'Overall task summary.',
    type: TaskSummaryDto,
  })
  readonly summary!: TaskSummaryDto;

  @ApiProperty({
    description: 'Task distribution grouped by status.',
    type: [TaskStatusStatsDto],
  })
  readonly taskStatusStats!: TaskStatusStatsDto[];

  @ApiProperty({
    description: 'Task distribution grouped by priority.',
    type: [TaskPriorityDto],
  })
  readonly taskPriorityStats!: TaskPriorityDto[];

  @ApiProperty({
    description: 'Productivity trend for the selected period.',
    type: [ProductivityTrendDto],
  })
  readonly productivityTrend!: ProductivityTrendDto[];

  @ApiProperty({
    description: 'Timestamp indicating when the dashboard data was generated.',
    example: '2026-07-21T10:30:00.000Z',
  })
  readonly generatedAt!: Date;
}
