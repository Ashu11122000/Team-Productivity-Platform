/*
 * ============================================================================
 * File: dashboard.mapper.ts
 * ============================================================================
 *
 * Enterprise Dashboard Mapper
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Convert repository/domain results into response DTOs.
 * - Prevent database structures leaking outside application layer.
 * - Keep transformation logic isolated.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Mapper Pattern
 * - SRP
 * - Stateless
 * - DTO only transformation
 *
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';

import { DashboardCalendarDto } from '../dto/dashboard-calendar.dto';
import { DashboardNotificationDto } from '../dto/dashboard-notification.dto';
import { DashboardOverviewDto } from '../dto/dashboard-overview.dto';
import { DashboardProductivityDto } from '../dto/dashboard-productivity.dto';
import { DashboardResponseDto } from '../dto/dashboard-response.dto';
import { DashboardSummaryDto } from '../dto/dashboard-summary.dto';

@Injectable()
export class DashboardMapper {
  /**
   * Maps repository overview aggregation
   * into DashboardOverviewDto.
   */
  public toOverviewDto(overview: any): DashboardOverviewDto {
    const dto = new DashboardOverviewDto();

    dto.totalTasks = Number(overview.totalTasks ?? 0);

    dto.completedTasks = Number(overview.completedTasks ?? 0);

    dto.pendingTasks = Number(overview.pendingTasks ?? 0);

    dto.inProgressTasks = Number(overview.inProgressTasks ?? 0);

    dto.overdueTasks = Number(overview.overdueTasks ?? 0);

    dto.cancelledTasks = Number(overview.cancelledTasks ?? 0);

    dto.completionRate = Number(overview.completionRate ?? 0);

    dto.totalCategories = Number(overview.totalCategories ?? 0);

    dto.totalTags = Number(overview.totalTags ?? 0);

    dto.unreadNotifications = Number(overview.unreadNotifications ?? 0);

    dto.upcomingReminders = Number(overview.upcomingReminders ?? 0);

    return dto;
  }

  /**
   * Maps productivity repository result.
   */
  public toProductivityDto(productivity: any): DashboardProductivityDto {
    const dto = new DashboardProductivityDto();

    dto.completionRate = Number(productivity.completionRate ?? 0);

    dto.currentStreak = productivity.currentStreak ?? 0;

    dto.longestStreak = productivity.longestStreak ?? 0;

    dto.averageCompletedPerDay = productivity.averageCompletedPerDay ?? 0;

    dto.completedThisWeek = productivity.completedThisWeek ?? 0;

    dto.completedThisMonth = productivity.completedThisMonth ?? 0;

    dto.trend = productivity.trend ?? [];

    return dto;
  }

  /**
   * Maps calendar task aggregation.
   */
  public toCalendarDto(tasks: any[]): DashboardCalendarDto {
    const dto = new DashboardCalendarDto();

    dto.totalEvents = tasks.length;

    dto.upcomingEvents = tasks.map((task) => ({
      id: task.id,

      title: task.title,

      dueDate: task.dueDate,

      completed: task.status === 'COMPLETED',

      overdue: task.dueDate ? new Date(task.dueDate) < new Date() : false,
    }));

    return dto;
  }

  /**
   * Maps notification aggregation.
   */
  public toNotificationDto(notification: any): DashboardNotificationDto {
    const dto = new DashboardNotificationDto();

    dto.unreadCount = Number(
      notification.unread ?? notification.unreadCount ?? 0,
    );

    dto.notifications = notification.notifications ?? [];

    return dto;
  }

  /**
   * Maps complete dashboard summary.
   */
  public toSummaryDto(summary: any): DashboardSummaryDto {
    return Object.assign(new DashboardSummaryDto(), {
      overview: this.toOverviewDto(summary.overview),
      productivity: this.toProductivityDto(summary.productivity),
      calendar: this.toCalendarDto(summary.calendar),
      notifications: this.toNotificationDto(summary.notifications),
    });
  }

  /**
   * Final dashboard response mapper.
   */
  public toResponseDto(summary: any): DashboardResponseDto {
    const dto = new DashboardResponseDto();

    dto.dashboard = this.toSummaryDto(summary);

    return dto;
  }
}
