/*
 * ============================================================================
 * File: analytics.controller.ts
 * ============================================================================
 *
 * Enterprise Analytics Controller.
 *
 * Responsibilities
 * ----------------
 * - Handle analytics HTTP requests.
 * - Validate query parameters.
 * - Convert HTTP query DTO into AnalyticsFilter.
 * - Extract authenticated user.
 * - Delegate business operations to AnalyticsService.
 * - Return DTO responses.
 *
 * Rules
 * -----
 * - No business logic.
 * - No TypeORM access.
 * - No repository access.
 * - No entity leakage.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Swagger
 * - TypeScript 5+
 * ============================================================================
 */

import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AnalyticsService } from '../services/analytics.service';

import { AnalyticsQueryDto } from '../dto/analytics-query.dto';
import { AnalyticsOverviewDto } from '../dto/analytics-overview.dto';
import { ProductivityStatsDto } from '../dto/productivity-stats.dto';
import { ProductivityTrendDto } from '../dto/productivity-trend.dto';
import { TaskPriorityDto } from '../dto/task-priority.dto';
import { TaskStatusStatsDto } from '../dto/task-status-stats.dto';
import { TaskSummaryDto } from '../dto/task-summary.dto';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../../common/decorators/current-user.decorator';

import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import type { AnalyticsFilter } from '../interfaces/analytics-filter.interface';

@ApiTags('Analytics')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * ==========================================================================
   * Convert Query DTO To Analytics Filter
   * ==========================================================================
   */
  private buildAnalyticsFilter(
    query: AnalyticsQueryDto,
    userId: string,
  ): AnalyticsFilter {
    return {
      userId,

      startDate: query.startDate ? new Date(query.startDate) : undefined,

      endDate: query.endDate ? new Date(query.endDate) : undefined,

      status: query.status,

      priority: query.priority,

      categoryId: query.categoryId,

      completed: query.completed,

      overdue: query.overdue,
    };
  }

  /**
   * ==========================================================================
   * Analytics Overview
   * ==========================================================================
   */
  @Get('overview')
  @ApiOperation({
    summary: 'Analytics Overview',
  })
  @ApiResponse({
    status: 200,
    type: AnalyticsOverviewDto,
  })
  async getOverview(
    @Query() query: AnalyticsQueryDto,

    @CurrentUser() user: JwtPayload,
  ): Promise<AnalyticsOverviewDto> {
    return this.analyticsService.getOverview(
      user.sub,
      this.buildAnalyticsFilter(query, user.sub),
    );
  }

  /**
   * ==========================================================================
   * Task Summary
   * ==========================================================================
   */
  @Get('tasks/summary')
  @ApiOperation({
    summary: 'Task Summary',
  })
  @ApiResponse({
    status: 200,
    type: TaskSummaryDto,
  })
  async getTaskSummary(
    @Query() query: AnalyticsQueryDto,

    @CurrentUser() user: JwtPayload,
  ): Promise<TaskSummaryDto> {
    return this.analyticsService.getTaskSummary(
      user.sub,
      this.buildAnalyticsFilter(query, user.sub),
    );
  }

  /**
   * ==========================================================================
   * Productivity Statistics
   * ==========================================================================
   */
  @Get('productivity')
  @ApiOperation({
    summary: 'Productivity Statistics',
  })
  @ApiResponse({
    status: 200,
    type: ProductivityStatsDto,
  })
  async getProductivity(
    @Query() query: AnalyticsQueryDto,

    @CurrentUser() user: JwtPayload,
  ): Promise<ProductivityStatsDto> {
    return this.analyticsService.getProductivity(
      user.sub,
      this.buildAnalyticsFilter(query, user.sub),
    );
  }

  /**
   * ==========================================================================
   * Task Status Statistics
   * ==========================================================================
   */
  @Get('tasks/status')
  @ApiOperation({
    summary: 'Task Status Statistics',
  })
  @ApiResponse({
    status: 200,
    type: TaskStatusStatsDto,
    isArray: true,
  })
  async getTaskStatusStats(
    @Query() query: AnalyticsQueryDto,

    @CurrentUser() user: JwtPayload,
  ): Promise<TaskStatusStatsDto[]> {
    return this.analyticsService.getTaskStatusStats(
      user.sub,
      this.buildAnalyticsFilter(query, user.sub),
    );
  }

  /**
   * ==========================================================================
   * Task Priority Statistics
   * ==========================================================================
   */
  @Get('tasks/priority')
  @ApiOperation({
    summary: 'Task Priority Statistics',
  })
  @ApiResponse({
    status: 200,
    type: TaskPriorityDto,
    isArray: true,
  })
  async getTaskPriorityStats(
    @Query() query: AnalyticsQueryDto,

    @CurrentUser() user: JwtPayload,
  ): Promise<TaskPriorityDto[]> {
    return this.analyticsService.getTaskPriorityStats(
      user.sub,
      this.buildAnalyticsFilter(query, user.sub),
    );
  }

  /**
   * ==========================================================================
   * Productivity Trend
   * ==========================================================================
   */
  @Get('productivity/trend')
  @ApiOperation({
    summary: 'Productivity Trend',
  })
  @ApiResponse({
    status: 200,
    type: ProductivityTrendDto,
    isArray: true,
  })
  async getProductivityTrend(
    @Query() query: AnalyticsQueryDto,

    @CurrentUser() user: JwtPayload,
  ): Promise<ProductivityTrendDto[]> {
    return this.analyticsService.getProductivityTrend(
      user.sub,
      this.buildAnalyticsFilter(query, user.sub),
    );
  }
}
