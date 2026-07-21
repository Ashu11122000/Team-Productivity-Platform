import { ApiProperty } from '@nestjs/swagger';

/**
 * ============================================================================
 * File: analytics-overview.dto.ts
 * ============================================================================
 *
 * Analytics Overview Response DTO.
 *
 * Responsibilities
 * ----------------
 * - Represent high-level dashboard statistics.
 * - Aggregate task, category, tag, and notification metrics.
 * - Provide summary information for dashboards.
 * - Hide persistence-layer implementation details.
 *
 * Notes
 * -----
 * - Returned by AnalyticsController.
 * - Never expose entities.
 * - Contains presentation-friendly analytics only.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Swagger
 * ============================================================================
 */
export class AnalyticsOverviewDto {
  /**
   * ==========================================================================
   * Task Statistics
   * ==========================================================================
   */

  @ApiProperty({
    description: 'Total number of tasks.',
    example: 156,
  })
  totalTasks!: number;

  @ApiProperty({
    description: 'Number of completed tasks.',
    example: 98,
  })
  completedTasks!: number;

  @ApiProperty({
    description: 'Number of pending tasks.',
    example: 58,
  })
  pendingTasks!: number;

  @ApiProperty({
    description: 'Percentage of completed tasks.',
    example: 62.82,
  })
  completionRate!: number;

  /**
   * ==========================================================================
   * Categories
   * ==========================================================================
   */

  @ApiProperty({
    description: 'Total number of categories.',
    example: 12,
  })
  totalCategories!: number;

  /**
   * ==========================================================================
   * Tags
   * ==========================================================================
   */

  @ApiProperty({
    description: 'Total number of tags.',
    example: 34,
  })
  totalTags!: number;

  /**
   * ==========================================================================
   * Notifications
   * ==========================================================================
   */

  @ApiProperty({
    description: 'Total number of notifications.',
    example: 18,
  })
  totalNotifications!: number;
}
