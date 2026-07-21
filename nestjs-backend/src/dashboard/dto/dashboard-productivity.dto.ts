/***
 * ============================================================================
 * File: dashboard-productivity.dto.ts
 * ============================================================================
 *
 * Enterprise Dashboard Productivity DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents productivity statistics displayed on the dashboard.
 * - Provides summary metrics for user productivity.
 * - Contains trend information for charts.
 * - Acts as a response-only DTO.
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
 * - Add weekly productivity score.
 * - Add monthly productivity score.
 * - Add longest completion streak.
 * - Add AI productivity insights.
 * - Add team productivity comparison.
 * ============================================================================
 */

import { ApiProperty } from '@nestjs/swagger';

export class DashboardTrendPointDto {
  @ApiProperty({
    description: 'Chart label.',
    example: 'Mon',
  })
  label!: string;

  @ApiProperty({
    description: 'Number of tasks created.',
    example: 12,
  })
  created!: number;

  @ApiProperty({
    description: 'Number of tasks completed.',
    example: 9,
  })
  completed!: number;
}

export class DashboardProductivityDto {
  @ApiProperty({
    description: 'Overall completion rate.',
    example: 82.5,
  })
  completionRate!: number;

  @ApiProperty({
    description: 'Current task completion streak.',
    example: 14,
  })
  currentStreak!: number;

  @ApiProperty({
    description: 'Longest task completion streak.',
    example: 37,
  })
  longestStreak!: number;

  @ApiProperty({
    description: 'Average tasks completed per day.',
    example: 8.4,
  })
  averageCompletedPerDay!: number;

  @ApiProperty({
    description: 'Total completed this week.',
    example: 42,
  })
  completedThisWeek!: number;

  @ApiProperty({
    description: 'Total completed this month.',
    example: 176,
  })
  completedThisMonth!: number;

  @ApiProperty({
    description: 'Daily/weekly/monthly productivity trend.',
    type: () => [DashboardTrendPointDto],
  })
  trend!: DashboardTrendPointDto[];
}
