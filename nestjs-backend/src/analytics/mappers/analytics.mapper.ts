/**
 * ============================================================================
 * File: analytics.mapper.ts
 * ============================================================================
 *
 * Enterprise Analytics Mapper.
 *
 * Responsibilities
 * ----------------
 * - Convert internal analytics contracts into response DTOs.
 * - Hide repository models from the presentation layer.
 * - Centralize DTO transformation logic.
 *
 * Architecture
 * ------------
 *
 * AnalyticsRepository
 *        │
 *        ▼
 * Internal Interfaces
 *        │
 *        ▼
 * AnalyticsMapper
 *        │
 *        ▼
 * Response DTOs
 *
 * Rules
 * -----
 * - No business logic.
 * - No database access.
 * - No calculations.
 * - No Dashboard dependencies.
 * - No entity exposure.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';

import { AnalyticsOverviewDto } from '../dto/analytics-overview.dto';
import { ProductivityStatsDto } from '../dto/productivity-stats.dto';
import { ProductivityTrendDto } from '../dto/productivity-trend.dto';
import { TaskPriorityDto } from '../dto/task-priority.dto';
import { TaskStatusStatsDto } from '../dto/task-status-stats.dto';
import { TaskSummaryDto } from '../dto/task-summary.dto';

import { AnalyticsOverview } from '../interfaces/analytics-overview.interface';
import { ProductivityStats } from '../interfaces/productivity-stats.interface';
import { ProductivityTrend } from '../interfaces/productivity-trend.interface';
import { TaskPriorityStats } from '../interfaces/task-priority-stats.interface';
import { TaskStatusStats } from '../interfaces/task-status-stats.interface';
import { TaskSummary } from '../interfaces/task-summary.interface';

/**
 * ============================================================================
 * Analytics Mapper
 * ============================================================================
 */
@Injectable()
export class AnalyticsMapper {
  /**
   * ==========================================================================
   * Analytics Overview
   * ==========================================================================
   */
  toOverviewDto(overview: AnalyticsOverview): AnalyticsOverviewDto {
    return {
      totalTasks: overview.totalTasks,
      completedTasks: overview.completedTasks,
      pendingTasks: overview.pendingTasks,
      completionRate: overview.completionRate,
      totalCategories: overview.totalCategories,
      totalTags: overview.totalTags,
      totalNotifications: overview.totalNotifications,
    };
  }

  /**
   * ==========================================================================
   * Task Summary
   * ==========================================================================
   */
  toTaskSummaryDto(summary: TaskSummary): TaskSummaryDto {
    return {
      totalTasks: summary.totalTasks,
      completedTasks: summary.completedTasks,
      pendingTasks: summary.pendingTasks,
      inProgressTasks: summary.inProgressTasks,
      overdueTasks: summary.overdueTasks,
      cancelledTasks: summary.cancelledTasks,
      completionRate: summary.completionRate,
    };
  }

  /**
   * ==========================================================================
   * Productivity Statistics
   * ==========================================================================
   */
  toProductivityDto(productivity: ProductivityStats): ProductivityStatsDto {
    return {
      totalTasks: productivity.totalTasks,
      completedTasks: productivity.completedTasks,
      pendingTasks: productivity.pendingTasks,
      inProgressTasks: productivity.inProgressTasks,
      overdueTasks: productivity.overdueTasks,
      completionRate: productivity.completionRate,
    };
  }

  /**
   * ==========================================================================
   * Task Status Statistics
   * ==========================================================================
   */
  toTaskStatusStatsDto(stats: TaskStatusStats[]): TaskStatusStatsDto[] {
    return stats.map((item) => ({
      status: item.status,
      count: item.count,
    }));
  }

  /**
   * ==========================================================================
   * Task Priority Statistics
   * ==========================================================================
   */
  toTaskPriorityStatsDto(stats: TaskPriorityStats[]): TaskPriorityDto[] {
    return stats.map((item) => ({
      priority: item.priority,
      count: item.count,
    }));
  }

  /**
   * ==========================================================================
   * Productivity Trend
   * ==========================================================================
   */
  toProductivityTrendDto(trend: ProductivityTrend[]): ProductivityTrendDto[] {
    return trend.map((item) => ({
      period: item.period,
      tasksCreated: item.tasksCreated,
      tasksCompleted: item.tasksCompleted,
      overdueTasks: item.overdueTasks,
      productivityRate: item.productivityRate,
    }));
  }
}
