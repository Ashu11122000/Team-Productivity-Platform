/*
 * ============================================================================
 * File: dashboard.service.ts
 * ============================================================================
 *
 * Enterprise Dashboard Service
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Orchestrate dashboard use cases.
 * - Delegate persistence operations to DashboardRepository.
 * - Convert internal models through DashboardMapper.
 * - Keep business logic isolated from controllers and repositories.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Clean Architecture
 * - Repository Pattern
 * - Mapper Pattern
 * - SOLID
 * - No TypeORM access
 * - No QueryBuilder
 * - No entity leakage
 *
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';

import { DashboardRepository } from '../repositories/dashboard.repository';
import { DashboardMapper } from '../mappers/dashboard.mapper';

import { DashboardFilter } from '../interfaces/dashboard-filter.interface';

import { DashboardResponseDto } from '../dto/dashboard-response.dto';

import { DashboardSummaryDto } from '../dto/dashboard-summary.dto';

import { DashboardProductivityDto } from '../dto/dashboard-productivity.dto';

import { DashboardCalendarDto } from '../dto/dashboard-calendar.dto';

import { DashboardNotificationDto } from '../dto/dashboard-notification.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly dashboardRepository: DashboardRepository,

    private readonly dashboardMapper: DashboardMapper,
  ) {}

  // ==========================================================================
  // Complete Dashboard
  // ==========================================================================

  /**
   * Returns complete dashboard response.
   */
  async getDashboard(filter: DashboardFilter): Promise<DashboardResponseDto> {
    const [overview, summary, productivity, calendar, notifications] =
      await Promise.all([
        this.dashboardRepository.getOverview(filter),

        this.dashboardRepository.getTaskSummary(filter),

        this.dashboardRepository.getProductivityScore(filter),

        this.dashboardRepository.getCalendarTasks(filter),

        this.dashboardRepository.getNotificationSummary(filter),
      ]);

    const dashboardSummary = {
      overview,

      productivity,

      calendar,

      notifications,

      summary,
    };

    return this.dashboardMapper.toResponseDto(dashboardSummary as any);
  }

  // ==========================================================================
  // Overview
  // ==========================================================================

  /**
   * Returns dashboard overview.
   */
  async getOverview(filter: DashboardFilter) {
    const overview = await this.dashboardRepository.getOverview(filter);

    return this.dashboardMapper.toOverviewDto(overview as any);
  }

  // ==========================================================================
  // Summary
  // ==========================================================================

  /**
   * Returns dashboard summary.
   */
  async getSummary(filter: DashboardFilter): Promise<DashboardSummaryDto> {
    const [overview, productivity, calendar, notifications] = await Promise.all(
      [
        this.dashboardRepository.getOverview(filter),

        this.dashboardRepository.getProductivityScore(filter),

        this.dashboardRepository.getCalendarTasks(filter),

        this.dashboardRepository.getNotificationSummary(filter),
      ],
    );

    return this.dashboardMapper.toSummaryDto({
      overview,

      productivity,

      calendar,

      notifications,
    } as any);
  }

  // ==========================================================================
  // Productivity
  // ==========================================================================

  /**
   * Returns productivity metrics.
   */
  async getProductivity(
    filter: DashboardFilter,
  ): Promise<DashboardProductivityDto> {
    const productivity =
      await this.dashboardRepository.getProductivityScore(filter);

    return this.dashboardMapper.toProductivityDto(productivity as any);
  }

  // ==========================================================================
  // Calendar
  // ==========================================================================

  /**
   * Returns dashboard calendar data.
   */
  async getCalendar(filter: DashboardFilter): Promise<DashboardCalendarDto> {
    const tasks = await this.dashboardRepository.getCalendarTasks(filter);

    const calendar = {
      totalEvents: tasks.length,

      upcomingEvents: tasks.map((task) => ({
        id: task.id,

        title: task.title,

        dueDate: task.dueDate,

        completed: String(task.status) === 'COMPLETED',

        overdue: task.dueDate ? new Date(task.dueDate) < new Date() : false,
      })),
    };

    return this.dashboardMapper.toCalendarDto(calendar as any);
  }

  // ==========================================================================
  // Notifications
  // ==========================================================================

  /**
   * Returns notification widget data.
   */
  async getNotifications(
    filter: DashboardFilter,
  ): Promise<DashboardNotificationDto> {
    const notification =
      await this.dashboardRepository.getNotificationSummary(filter);

    return this.dashboardMapper.toNotificationDto(notification as any);
  }

  // ==========================================================================
  // Statistics
  // ==========================================================================

  /**
   * Returns raw dashboard statistics.
   *
   * NOTE:
   * There is intentionally no mapper call here because
   * DashboardMapper currently has no statistics DTO mapper.
   *
   * If required later:
   *
   * dashboard-statistics.dto.ts
   * +
   * toStatisticsDto()
   *
   * can be added.
   */
  async getStatistics(filter: DashboardFilter) {
    const [widgets, status, priority] = await Promise.all([
      this.dashboardRepository.getWidgetStatistics(filter),

      this.dashboardRepository.getStatusStatistics(filter),

      this.dashboardRepository.getPriorityStatistics(filter),
    ]);

    return {
      widgets,

      status,

      priority,
    };
  }
}
