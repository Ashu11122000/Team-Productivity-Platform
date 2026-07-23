/**
 * ============================================================================
 * File: analytics.repository.ts
 * ============================================================================
 *
 * Enterprise Analytics Repository.
 *
 * Responsibilities
 * ----------------
 * - Execute analytics-related database queries.
 * - Aggregate task productivity metrics.
 * - Provide dashboard statistics.
 * - Generate reporting data using TypeORM QueryBuilder.
 * - Encapsulate PostgreSQL-specific query logic.
 *
 * Architecture
 * ------------
 *
 * Controller
 *      |
 *      ▼
 * AnalyticsService
 *      |
 *      ▼
 * AnalyticsRepository
 *      |
 *      ▼
 * TypeORM QueryBuilder
 *      |
 *      ▼
 * PostgreSQL
 *
 *
 * Rules
 * -----
 * - Repository contains NO business logic.
 * - Repository contains NO DTO transformation.
 * - Repository does NOT return response DTOs.
 * - Mapper layer handles entity/data transformation.
 *
 *
 * Authentication
 * --------------
 * - FastAPI owns authentication.
 * - NestJS only validates JWT.
 * - userId comes from authenticated JWT payload.
 *
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM 0.3+
 * - PostgreSQL
 * - Node.js 22+
 *
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';

import { Repository, SelectQueryBuilder } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';

import { TaskEntity } from '../../tasks/entities/task.entity';
import { ProductivityStats } from '../interfaces/productivity-stats.interface';
import { AnalyticsFilter } from '../interfaces/analytics-filter.interface';
import { ProductivityTrend } from '../interfaces/productivity-trend.interface';
import { AnalyticsOverview } from '../interfaces/analytics-overview.interface';

import { TaskSummary } from '../interfaces/task-summary.interface';

//import { ChartData } from '../interfaces/chart-data.interface';

import { TaskStatus, TaskPriority } from '../../common/enums';

/**
 * ============================================================================
 * Analytics Repository
 * ============================================================================
 *
 * Handles all analytics database operations.
 *
 * This repository intentionally works with:
 *
 * - TaskEntity
 * - SQL aggregation
 * - QueryBuilder
 *
 * and never with:
 *
 * - HTTP requests
 * - DTOs
 * - Controllers
 *
 * ============================================================================
 */
@Injectable()
export class AnalyticsRepository {
  /**
   * Default QueryBuilder alias.
   */
  private static readonly TABLE_ALIAS = 'task';

  /**
   * Allowed date filtering columns.
   *
   * Prevents dynamic SQL injection.
   */
  private static readonly DATE_COLUMN = 'createdAt';

  /**
   * Default analytics date range.
   */
  private static readonly DEFAULT_DAYS = 30;

  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  /**
   * ==========================================================================
   * Create Base Analytics Query
   * ==========================================================================
   *
   * Creates the base query shared by analytics methods.
   *
   * Responsibilities
   * ----------------
   * - Scope tasks to authenticated user.
   * - Provide common QueryBuilder instance.
   *
   *
   * @param userId Authenticated user identifier.
   *
   * @returns Task QueryBuilder.
   * ==========================================================================
   */
  private createBaseQuery(userId: string): SelectQueryBuilder<TaskEntity> {
    return this.taskRepository
      .createQueryBuilder(AnalyticsRepository.TABLE_ALIAS)
      .where(`${AnalyticsRepository.TABLE_ALIAS}.userId = :userId`, {
        userId,
      });
  }

  /**
   * ==========================================================================
   * Apply Date Filter
   * ==========================================================================
   *
   * Adds date range filtering.
   *
   * Example:
   *
   * createdAt >= startDate
   *
   * createdAt <= endDate
   *
   *
   * @param queryBuilder QueryBuilder instance.
   * @param filter Analytics filter.
   *
   * @returns Updated QueryBuilder.
   * ==========================================================================
   */
  private applyDateFilter(
    queryBuilder: SelectQueryBuilder<TaskEntity>,
    filter: AnalyticsFilter,
  ): SelectQueryBuilder<TaskEntity> {
    if (filter.startDate) {
      queryBuilder.andWhere(
        `${AnalyticsRepository.TABLE_ALIAS}.${AnalyticsRepository.DATE_COLUMN} >= :startDate`,
        {
          startDate: filter.startDate,
        },
      );
    }

    if (filter.endDate) {
      queryBuilder.andWhere(
        `${AnalyticsRepository.TABLE_ALIAS}.${AnalyticsRepository.DATE_COLUMN} <= :endDate`,
        {
          endDate: filter.endDate,
        },
      );
    }

    return queryBuilder;
  }

  /**
   * ==========================================================================
   * Apply Common Filters
   * ==========================================================================
   *
   * Applies reusable analytics filters.
   *
   * Supported:
   *
   * - search
   * - date range
   * - status
   * - priority
   *
   *
   * @param queryBuilder QueryBuilder.
   * @param filter Analytics filter.
   *
   * @returns Updated QueryBuilder.
   * ==========================================================================
   */
  private applyFilters(
    queryBuilder: SelectQueryBuilder<TaskEntity>,

    filter: AnalyticsFilter,
  ): SelectQueryBuilder<TaskEntity> {
    this.applyDateFilter(queryBuilder, filter);

    if (filter.status) {
      queryBuilder.andWhere(
        `${AnalyticsRepository.TABLE_ALIAS}.status = :status`,
        {
          status: filter.status,
        },
      );
    }

    if (filter.priority) {
      queryBuilder.andWhere(
        `${AnalyticsRepository.TABLE_ALIAS}.priority = :priority`,
        {
          priority: filter.priority,
        },
      );
    }

    return queryBuilder;
  }

  /**
   * ==========================================================================
   * Calculate Completion Percentage
   * ==========================================================================
   *
   * Calculates:
   *
   * completed / total * 100
   *
   *
   * @param completed Completed task count.
   * @param total Total task count.
   *
   * @returns Percentage.
   * ==========================================================================
   */
  private calculateCompletionRate(completed: number, total: number): number {
    if (total === 0) {
      return 0;
    }

    return Number(((completed / total) * 100).toFixed(2));
  }

  /**
   * ==========================================================================
   * Build Date Range
   * ==========================================================================
   *
   * Generates default analytics range.
   *
   * Default:
   *
   * Last 30 days
   *
   *
   * @returns Date range object.
   * ==========================================================================
   */
  private buildDateRange(days = AnalyticsRepository.DEFAULT_DAYS): {
    startDate: Date;
    endDate: Date;
  } {
    const endDate = new Date();

    const startDate = new Date();

    startDate.setDate(startDate.getDate() - days);

    return {
      startDate,
      endDate,
    };
  }

  /**
   * ==========================================================================
   * Get Dashboard Analytics
   * ==========================================================================
   *
   * Returns complete dashboard analytics data.
   *
   * This method acts as a repository aggregation
   * entry point.
   *
   * It combines:
   *
   * - Overview metrics
   * - Task summary
   *
   * Additional analytics blocks are handled
   * by dedicated repository methods.
   *
   *
   * @param userId Authenticated user identifier.
   * @param filter Analytics filter.
   *
   * @returns Dashboard analytics data.
   * ==========================================================================
   */
  async getDashboard(
    userId: string,
    filter: AnalyticsFilter,
  ): Promise<{
    overview: AnalyticsOverview;
    taskSummary: TaskSummary;
  }> {
    const [overview, taskSummary] = await Promise.all([
      this.getOverview(userId, filter),

      this.getTaskSummary(userId, filter),
    ]);

    return {
      overview,
      taskSummary,
    };
  }

  /**
   * ==========================================================================
   * Get Analytics Overview
   * ==========================================================================
   *
   * Provides high-level productivity metrics.
   *
   * Metrics:
   *
   * - Total tasks
   * - Completed tasks
   * - Pending tasks
   * - In progress tasks
   * - Completion rate
   *
   *
   * Uses PostgreSQL conditional aggregation.
   *
   *
   * @param userId Authenticated user identifier.
   * @param filter Analytics filter.
   *
   * @returns Analytics summary.
   * ==========================================================================
   */
  async getOverview(
    userId: string,
    filter: AnalyticsFilter,
  ): Promise<AnalyticsOverview> {
    const queryBuilder = this.createBaseQuery(userId);

    this.applyFilters(queryBuilder, filter);

    const result = await queryBuilder
      .select('COUNT(task.id)', 'total')

      .addSelect(
        `
      COUNT(
        CASE
          WHEN task.status = :completed
          THEN 1
        END
      )
      `,
        'completed',
      )

      .addSelect(
        `
      COUNT(
        CASE
          WHEN task.status = :pending
          THEN 1
        END
      )
      `,
        'pending',
      )

      .addSelect(
        `
      COUNT(
        CASE
          WHEN task.status = :inProgress
          THEN 1
        END
      )
      `,
        'inProgress',
      )

      .addSelect(
        `
      COUNT(
        CASE
          WHEN task.dueDate < NOW()
          AND task.status != :completed
          THEN 1
        END
      )
      `,
        'overdue',
      )

      .setParameters({
        completed: TaskStatus.COMPLETED,
        pending: TaskStatus.TODO,
        inProgress: TaskStatus.IN_PROGRESS,
      })

      .getRawOne();

    const total = Number(result.total ?? 0);
    const completed = Number(result.completed ?? 0);

    return {
      totalTasks: total,

      completedTasks: completed,

      pendingTasks: Number(result.pending ?? 0),

      completionRate: this.calculateCompletionRate(completed, total),

      totalCategories: 0,

      totalTags: 0,

      totalNotifications: 0,
    };
  }

  /**
   * ==========================================================================
   * Get Task Summary
   * ==========================================================================
   *
   * Returns task lifecycle summary.
   *
   * This method focuses on task state distribution.
   *
   *
   * @param userId Authenticated user identifier.
   * @param filter Analytics filter.
   *
   * @returns Task summary.
   * ==========================================================================
   */
  async getTaskSummary(
    userId: string,
    filter: AnalyticsFilter,
  ): Promise<TaskSummary> {
    const queryBuilder = this.createBaseQuery(userId);

    this.applyFilters(queryBuilder, filter);

    const result = await queryBuilder
      .select('COUNT(task.id)', 'total')

      .addSelect(
        `
      COUNT(
        CASE
          WHEN task.status = :completed
          THEN 1
        END
      )
      `,
        'completed',
      )

      .addSelect(
        `
      COUNT(
        CASE
          WHEN task.status = :pending
          THEN 1
        END
      )
      `,
        'pending',
      )

      .addSelect(
        `
      COUNT(
        CASE
          WHEN task.status = :inProgress
          THEN 1
        END
      )
      `,
        'inProgress',
      )

      .addSelect(
        `
      COUNT(
        CASE
          WHEN task.priority = :high
          THEN 1
        END
      )
      `,
        'highPriority',
      )

      .setParameters({
        completed: TaskStatus.COMPLETED,
        pending: TaskStatus.TODO,
        inProgress: TaskStatus.IN_PROGRESS,
        high: TaskPriority.HIGH,
      })

      .getRawOne();

    const total = Number(result.total ?? 0);
    const completed = Number(result.completed ?? 0);

    return {
      totalTasks: total,

      completedTasks: completed,

      pendingTasks: Number(result.pending ?? 0),

      inProgressTasks: Number(result.inProgress ?? 0),

      overdueTasks: 0,

      cancelledTasks: 0,

      completionRate: this.calculateCompletionRate(completed, total),
    };
  }

  /**
   * ==========================================================================
   * Get Productivity Statistics
   * ==========================================================================
   *
   * Calculates productivity-related metrics.
   *
   * Metrics:
   *
   * - Total tasks
   * - Completed tasks
   * - Completion percentage
   * - Average completion progress
   *
   *
   * This method is optimized using SQL aggregation
   * instead of loading task entities into memory.
   *
   *
   * @param userId Authenticated user identifier.
   * @param filter Analytics filter.
   *
   * @returns Productivity statistics.
   * ==========================================================================
   */
  /**
   * ==========================================================================
   * Get Productivity Statistics
   * ==========================================================================
   */
  async getProductivityStats(
    userId: string,
    filter: AnalyticsFilter,
  ): Promise<ProductivityStats> {
    const queryBuilder = this.createBaseQuery(userId);

    this.applyFilters(queryBuilder, filter);

    const result = await queryBuilder
      .select('COUNT(task.id)', 'total')

      .addSelect(
        `
      COUNT(
        CASE
          WHEN task.status = :completed
          THEN 1
        END
      )
      `,
        'completed',
      )

      .addSelect(
        `
      COUNT(
        CASE
          WHEN task.status = :pending
          THEN 1
        END
      )
      `,
        'pending',
      )

      .addSelect(
        `
      COUNT(
        CASE
          WHEN task.status = :inProgress
          THEN 1
        END
      )
      `,
        'inProgress',
      )

      .addSelect(
        `
      COUNT(
        CASE
          WHEN task.dueDate < NOW()
          AND task.status != :completed
          THEN 1
        END
      )
      `,
        'overdue',
      )

      .setParameters({
        completed: TaskStatus.COMPLETED,
        pending: TaskStatus.TODO,
        inProgress: TaskStatus.IN_PROGRESS,
      })

      .getRawOne();

    const totalTasks = Number(result.total ?? 0);
    const completedTasks = Number(result.completed ?? 0);

    return {
      totalTasks,
      completedTasks,
      pendingTasks: Number(result.pending ?? 0),
      inProgressTasks: Number(result.inProgress ?? 0),
      overdueTasks: Number(result.overdue ?? 0),
      completionRate: this.calculateCompletionRate(completedTasks, totalTasks),
    };
  }
  /**
   * ==========================================================================
   * Get Task Status Statistics
   * ==========================================================================
   *
   * Returns task distribution by status.
   *
   * Example:
   *
   * [
   *   {
   *     status: "COMPLETED",
   *     count: 50
   *   },
   *   {
   *     status: "PENDING",
   *     count: 20
   *   }
   * ]
   *
   *
   * Used by:
   *
   * - Dashboard charts
   * - Analytics widgets
   * - Productivity reports
   *
   *
   * @param userId Authenticated user identifier.
   * @param filter Analytics filter.
   *
   * @returns Status distribution.
   * ==========================================================================
   */
  async getTaskStatusStats(
    userId: string,
    filter: AnalyticsFilter,
  ): Promise<
    Array<{
      status: TaskStatus;
      count: number;
    }>
  > {
    const queryBuilder = this.createBaseQuery(userId);

    this.applyFilters(queryBuilder, filter);

    const rows = await queryBuilder

      .select('task.status', 'status')

      .addSelect('COUNT(task.id)', 'count')

      .groupBy('task.status')

      .orderBy('count', 'DESC')

      .getRawMany();

    return rows.map((row) => ({
      status: row.status as TaskStatus,

      count: Number(row.count),
    }));
  }

  /**
   * ==========================================================================
   * Get Task Priority Statistics
   * ==========================================================================
   *
   * Returns task distribution grouped by priority.
   *
   * Example:
   *
   * [
   *   {
   *     priority: "HIGH",
   *     count: 25
   *   }
   * ]
   *
   *
   * Used for:
   *
   * - Priority charts
   * - Dashboard widgets
   * - Productivity analysis
   *
   *
   * @param userId Authenticated user identifier.
   * @param filter Analytics filter.
   *
   * @returns Priority statistics.
   * ==========================================================================
   */
  async getTaskPriorityStats(
    userId: string,
    filter: AnalyticsFilter,
  ): Promise<
    Array<{
      priority: TaskPriority;
      count: number;
    }>
  > {
    const queryBuilder = this.createBaseQuery(userId);

    this.applyFilters(queryBuilder, filter);

    const rows = await queryBuilder

      .select('task.priority', 'priority')

      .addSelect('COUNT(task.id)', 'count')

      .groupBy('task.priority')

      .orderBy('count', 'DESC')

      .getRawMany();

    return rows.map((row) => ({
      priority: row.priority as TaskPriority,

      count: Number(row.count),
    }));
  }

  /**
   * ==========================================================================
   * Get Productivity Trend
   * ==========================================================================
   *
   * Generates productivity trend data.
   *
   * Groups tasks by day.
   *
   * Example:
   *
   * [
   *   {
   *      date:"2026-07-01",
   *      created:10,
   *      completed:6
   *   }
   * ]
   *
   *
   * PostgreSQL DATE_TRUNC is used
   * for efficient time aggregation.
   *
   *
   * @param userId Authenticated user identifier.
   * @param filter Analytics filter.
   *
   * @returns Productivity chart data.
   * ==========================================================================
   */
  /**
   * ==========================================================================
   * Get Productivity Trend
   * ==========================================================================
   */
  async getProductivityTrend(
    userId: string,
    filter: AnalyticsFilter,
  ): Promise<ProductivityTrend[]> {
    const queryBuilder = this.createBaseQuery(userId);

    this.applyFilters(queryBuilder, filter);

    const rows = await queryBuilder
      .select(
        `
        DATE_TRUNC(
          'day',
          task.createdAt
        )
      `,
        'date',
      )
      .addSelect(
        `
        COUNT(task.id)
      `,
        'created',
      )
      .addSelect(
        `
        COUNT(
          CASE
            WHEN task.status = :completed
            THEN 1
          END
        )
      `,
        'completed',
      )
      .addSelect(
        `
        COUNT(
          CASE
            WHEN task.dueDate < NOW()
            AND task.status != :completed
            THEN 1
          END
        )
      `,
        'overdue',
      )
      .setParameter('completed', TaskStatus.COMPLETED)
      .groupBy(
        `
        DATE_TRUNC(
          'day',
          task.createdAt
        )
      `,
      )
      .orderBy('date', 'ASC')
      .getRawMany();

    return rows.map((row) => {
      const tasksCreated = Number(row.created);
      const tasksCompleted = Number(row.completed);

      return {
        period: new Date(row.date).toISOString().split('T')[0],
        tasksCreated,
        tasksCompleted,
        overdueTasks: Number(row.overdue ?? 0),
        productivityRate: this.calculateCompletionRate(
          tasksCompleted,
          tasksCreated,
        ),
      };
    });
  }

  /**
   * ==========================================================================
   * Calculate Average Completion Time
   * ==========================================================================
   *
   * Calculates average duration between:
   *
   * task creation
   *        |
   *        |
   * completion
   *
   *
   * Uses PostgreSQL EXTRACT.
   *
   *
   * @param userId Authenticated user identifier.
   *
   * @returns Average completion duration in hours.
   * ==========================================================================
   */
  private async calculateAverageCompletionTime(
    userId: string,
  ): Promise<number> {
    const result = await this.taskRepository

      .createQueryBuilder(AnalyticsRepository.TABLE_ALIAS)

      .select(
        `
          AVG(
            EXTRACT(
              EPOCH FROM
              (
                task.updatedAt -
                task.createdAt
              )
            ) / 3600
          )
          `,
        'average',
      )

      .where(
        `${AnalyticsRepository.TABLE_ALIAS}.userId = :userId`,

        {
          userId,
        },
      )

      .andWhere(
        `${AnalyticsRepository.TABLE_ALIAS}.status = :status`,

        {
          status: TaskStatus.COMPLETED,
        },
      )

      .getRawOne();

    return Number(Number(result.average ?? 0).toFixed(2));
  }

  /**
   * ==========================================================================
   * Normalize Numeric Database Values
   * ==========================================================================
   *
   * PostgreSQL COUNT returns strings through
   * raw queries.
   *
   * This helper keeps conversion consistent.
   *
   *
   * @param value Database numeric value.
   *
   * @returns Number.
   * ==========================================================================
   */
  private normalizeNumber(value: unknown): number {
    return Number(value ?? 0);
  }
}
