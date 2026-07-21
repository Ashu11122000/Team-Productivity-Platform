/*
 * ============================================================================
 * File: dashboard.controller.ts
 * ============================================================================
 *
 * Enterprise Dashboard Controller
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Expose dashboard REST endpoints.
 * - Validate incoming query parameters.
 * - Convert request DTO into internal filter.
 * - Extract authenticated user context.
 * - Delegate operations to DashboardService.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Thin Controller
 * - Clean Architecture
 * - DTO based responses
 * - No business logic
 * - No repository access
 *
 * Authentication
 * ----------------------------------------------------------------------------
 * FastAPI issues JWT.
 *
 * NestJS validates JWT through JwtAuthGuard.
 *
 * ============================================================================
 */

import { Controller, Get, Query } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { DashboardService } from '../services/dashboard.service';

import { DashboardQueryDto } from '../dto/dashboard-query.dto';

import { DashboardResponseDto } from '../dto/dashboard-response.dto';

import { DashboardOverviewDto } from '../dto/dashboard-overview.dto';

import { DashboardSummaryDto } from '../dto/dashboard-summary.dto';

import { DashboardProductivityDto } from '../dto/dashboard-productivity.dto';

import { DashboardCalendarDto } from '../dto/dashboard-calendar.dto';

import { DashboardNotificationDto } from '../dto/dashboard-notification.dto';

import { CurrentUser } from '../../common/decorators';

// The JwtUser interface is defined here to avoid import errors when the
// original declaration is not available at the expected path.
interface JwtUser {
  userId: string;
  tenantId?: string;
  username?: string;
  roles?: string[];
}

import { DashboardFilter } from '../interfaces/dashboard-filter.interface';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // ==========================================================================
  // Query DTO → Filter Transformation
  // ==========================================================================

  /**
   * Converts HTTP query parameters into internal dashboard filter.
   *
   * Controller is the boundary between:
   *
   * HTTP Layer
   *      |
   *      ↓
   * Application Layer
   */
  private buildFilter(
    user: JwtUser,
    query: DashboardQueryDto,
  ): DashboardFilter {
    return {
      userId: user.userId,

      startDate: query.startDate ? new Date(query.startDate) : undefined,

      endDate: query.endDate ? new Date(query.endDate) : undefined,

      categoryId: query.categoryId,

      completed: query.completed,

      overdue: query.overdue,

      groupBy: query.groupBy,
    };
  }

  // ==========================================================================
  // Complete Dashboard
  // ==========================================================================

  @Get()
  @ApiOperation({
    summary: 'Get complete dashboard',
    description: 'Returns complete dashboard overview and widgets.',
  })
  @ApiResponse({
    status: 200,
    type: DashboardResponseDto,
  })
  async getDashboard(
    @CurrentUser()
    user: JwtUser,

    @Query()
    query: DashboardQueryDto,
  ): Promise<DashboardResponseDto> {
    return this.dashboardService.getDashboard(this.buildFilter(user, query));
  }

  // ==========================================================================
  // Overview
  // ==========================================================================

  @Get('overview')
  @ApiOperation({
    summary: 'Get dashboard overview',
  })
  @ApiResponse({
    status: 200,
    type: DashboardOverviewDto,
  })
  async getOverview(
    @CurrentUser()
    user: JwtUser,

    @Query()
    query: DashboardQueryDto,
  ): Promise<DashboardOverviewDto> {
    return this.dashboardService.getOverview(this.buildFilter(user, query));
  }

  // ==========================================================================
  // Summary
  // ==========================================================================

  @Get('summary')
  @ApiOperation({
    summary: 'Get dashboard summary',
  })
  @ApiResponse({
    status: 200,
    type: DashboardSummaryDto,
  })
  async getSummary(
    @CurrentUser()
    user: JwtUser,

    @Query()
    query: DashboardQueryDto,
  ): Promise<DashboardSummaryDto> {
    return this.dashboardService.getSummary(this.buildFilter(user, query));
  }

  // ==========================================================================
  // Productivity
  // ==========================================================================

  @Get('productivity')
  @ApiOperation({
    summary: 'Get productivity metrics',
  })
  @ApiResponse({
    status: 200,
    type: DashboardProductivityDto,
  })
  async getProductivity(
    @CurrentUser()
    user: JwtUser,

    @Query()
    query: DashboardQueryDto,
  ): Promise<DashboardProductivityDto> {
    return this.dashboardService.getProductivity(this.buildFilter(user, query));
  }

  // ==========================================================================
  // Calendar
  // ==========================================================================

  @Get('calendar')
  @ApiOperation({
    summary: 'Get dashboard calendar data',
  })
  @ApiResponse({
    status: 200,
    type: DashboardCalendarDto,
  })
  async getCalendar(
    @CurrentUser()
    user: JwtUser,

    @Query()
    query: DashboardQueryDto,
  ): Promise<DashboardCalendarDto> {
    return this.dashboardService.getCalendar(this.buildFilter(user, query));
  }

  // ==========================================================================
  // Notifications
  // ==========================================================================

  @Get('notifications')
  @ApiOperation({
    summary: 'Get dashboard notifications',
  })
  @ApiResponse({
    status: 200,
    type: DashboardNotificationDto,
  })
  async getNotifications(
    @CurrentUser()
    user: JwtUser,

    @Query()
    query: DashboardQueryDto,
  ): Promise<DashboardNotificationDto> {
    return this.dashboardService.getNotifications(
      this.buildFilter(user, query),
    );
  }

  // ==========================================================================
  // Statistics
  // ==========================================================================

  @Get('statistics')
  @ApiOperation({
    summary: 'Get dashboard statistics',
  })
  async getStatistics(
    @CurrentUser()
    user: JwtUser,

    @Query()
    query: DashboardQueryDto,
  ) {
    return this.dashboardService.getStatistics(this.buildFilter(user, query));
  }
}
