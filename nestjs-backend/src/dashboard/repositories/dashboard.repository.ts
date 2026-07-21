/* eslint-disable prettier/prettier */

/**
 * ============================================================================
 * File: dashboard.repository.ts
 * ============================================================================
 *
 * Enterprise Dashboard Repository
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Provide dashboard-related database operations.
 * - Execute optimized PostgreSQL queries.
 * - Handle aggregations and statistics.
 * - Support filtering, sorting, and pagination.
 * - Keep all TypeORM QueryBuilder logic isolated.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Repository Pattern
 * - Clean Architecture
 * - SOLID
 * - DRY
 * - QueryBuilder based
 * - No DTO mapping
 * - No business logic
 * - No HTTP concerns
 *
 * Notes
 * ----------------------------------------------------------------------------
 * Dashboard is a read-heavy feature.
 *
 * Therefore this repository focuses on:
 *
 * - Aggregated task metrics
 * - Productivity calculations
 * - Summary widgets
 * - Calendar data preparation
 * - Notification statistics
 *
 * Entity transformation is handled by DashboardMapper.
 *
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { TaskEntity } from '../../tasks/entities/task.entity';
import { NotificationEntity } from '../../notifications/entities/notification.entity';

import { DashboardFilter } from '../interfaces/dashboard-filter.interface';

@Injectable()
export class DashboardRepository {
  /**
   * Default pagination values.
   */
  private readonly DEFAULT_PAGE = 1;

  private readonly DEFAULT_LIMIT = 10;

  /**
   * Allowed task sorting fields.
   *
   * Prevents SQL injection through dynamic ordering.
   */
  private readonly SORT_FIELDS = {
    createdAt: 'task.createdAt',
    updatedAt: 'task.updatedAt',
    dueDate: 'task.dueDate',
    priority: 'task.priority',
    status: 'task.status',
  };

  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,

    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  // ==========================================================================
  // Base Query Builders
  // ==========================================================================

  /**
   * Creates the base task query.
   *
   * All dashboard task queries should start here.
   */
  private createTaskBaseQuery(): SelectQueryBuilder<TaskEntity> {
    return this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.category', 'category')
      .leftJoinAndSelect('task.tags', 'tags');
  }

  /**
   * Creates notification base query.
   */
  private createNotificationBaseQuery() {
    return this.notificationRepository.createQueryBuilder('notification');
  }

  // ==========================================================================
  // Filtering
  // ==========================================================================

  /**
   * Applies common dashboard filters.
   *
   * Supported:
   *
   * - user ownership
   * - date range
   * - status
   * - priority
   */
  private applyTaskFilters(
    query: SelectQueryBuilder<TaskEntity>,
    filter: DashboardFilter,
  ): SelectQueryBuilder<TaskEntity> {
    if (filter.userId) {
      query.andWhere('task.userId = :userId', {
        userId: filter.userId,
      });
    }

    if (filter.startDate) {
      query.andWhere('task.createdAt >= :startDate', {
        startDate: filter.startDate,
      });
    }

    if (filter.endDate) {
      query.andWhere('task.createdAt <= :endDate', {
        endDate: filter.endDate,
      });
    }

    // map DashboardFilter fields to task entity columns
    if (filter.categoryId) {
      query.andWhere('task.categoryId = :categoryId', {
        categoryId: filter.categoryId,
      });
    }

    if (typeof filter.completed === 'boolean') {
      query.andWhere('task.completed = :completed', {
        completed: filter.completed,
      });
    }

    if (filter.overdue) {
      query.andWhere('task.dueDate < :now', { now: new Date() });
    }

    return query;
  }

  /**
   * Applies notification filters.
   */
  private applyNotificationFilters(
    query: SelectQueryBuilder<NotificationEntity>,
    filter: DashboardFilter,
  ) {
    if (filter.userId) {
      query.andWhere('notification.userId = :userId', {
        userId: filter.userId,
      });
    }

    if (filter.startDate) {
      query.andWhere('notification.createdAt >= :startDate', {
        startDate: filter.startDate,
      });
    }

    if (filter.endDate) {
      query.andWhere('notification.createdAt <= :endDate', {
        endDate: filter.endDate,
      });
    }

    return query;
  }

  // ==========================================================================
  // Sorting
  // ==========================================================================

  /**
   * Applies safe sorting.
   */
  private applySorting(
    query: SelectQueryBuilder<TaskEntity>,
    sortBy?: keyof typeof this.SORT_FIELDS,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    const field = sortBy
      ? this.SORT_FIELDS[sortBy]
      : this.SORT_FIELDS.createdAt;

    query.orderBy(field, sortOrder);

    return query;
  }

  // ==========================================================================
  // Pagination
  // ==========================================================================

  /**
   * Applies pagination.
   */
  private applyPagination(
    query: SelectQueryBuilder<any>,
    page?: number,
    limit?: number,
  ) {
    const currentPage = page && page > 0 ? page : this.DEFAULT_PAGE;

    const currentLimit = limit && limit > 0 ? limit : this.DEFAULT_LIMIT;

    query.skip((currentPage - 1) * currentLimit).take(currentLimit);

    return query;
  }

  // ==========================================================================
  // Aggregation Helpers
  // ==========================================================================

  /**
   * Calculates percentage safely.
   */
  private calculatePercentage(value: number, total: number): number {
    if (!total) {
      return 0;
    }

    return Number(((value / total) * 100).toFixed(2));
  }

  /**
   * Converts raw database count values.
   */
  private normalizeCount(value?: string | number): number {
    return Number(value ?? 0);
  }

  // ==========================================================================
  // Dashboard Overview
  // ==========================================================================

  /**
   * Retrieves dashboard overview metrics.
   *
   * Returns raw aggregated database data.
   *
   * Mapping into DTO happens inside DashboardMapper.
   */
  async getOverview(filter: DashboardFilter) {
    const query = this.createTaskBaseQuery();

    this.applyTaskFilters(query, filter);

    const result = await query
      .select([
        'COUNT(task.id) AS totalTasks',

        `
          COUNT(
            CASE
              WHEN task.status = 'COMPLETED'
              THEN 1
            END
          ) AS completedTasks
          `,

        `
          COUNT(
            CASE
              WHEN task.status = 'IN_PROGRESS'
              THEN 1
            END
          ) AS inProgressTasks
          `,

        `
          COUNT(
            CASE
              WHEN task.status = 'TODO'
              THEN 1
            END
          ) AS pendingTasks
          `,

        `
          COUNT(
            CASE
              WHEN task.dueDate < NOW()
              AND task.status != 'COMPLETED'
              THEN 1
            END
          ) AS overdueTasks
          `,
      ])
      .getRawOne();

    const total = this.normalizeCount(result.totalTasks);

    const completed = this.normalizeCount(result.completedTasks);

    return {
      totalTasks: total,

      completedTasks: completed,

      inProgressTasks: this.normalizeCount(result.inProgressTasks),

      pendingTasks: this.normalizeCount(result.pendingTasks),

      overdueTasks: this.normalizeCount(result.overdueTasks),

      completionRate: this.calculatePercentage(completed, total),
    };
  }

  // ==========================================================================
  // Task Summary
  // ==========================================================================

  /**
   * Returns task distribution summary.
   *
   * Used by dashboard widgets.
   */
  async getTaskSummary(filter: DashboardFilter) {
    const query = this.createTaskBaseQuery();

    this.applyTaskFilters(query, filter);

    const result = await query
      .select([
        `
          COUNT(task.id)
          AS total
          `,

        `
          COUNT(
            CASE
              WHEN task.status = 'COMPLETED'
              THEN 1
            END
          )
          AS completed
          `,

        `
          COUNT(
            CASE
              WHEN task.status = 'TODO'
              THEN 1
            END
          )
          AS todo
          `,

        `
          COUNT(
            CASE
              WHEN task.status = 'IN_PROGRESS'
              THEN 1
            END
          )
          AS inProgress
          `,

        `
          COUNT(
            CASE
              WHEN task.status = 'BLOCKED'
              THEN 1
            END
          )
          AS blocked
          `,
      ])
      .getRawOne();

    return {
      total: this.normalizeCount(result.total),

      completed: this.normalizeCount(result.completed),

      todo: this.normalizeCount(result.todo),

      inProgress: this.normalizeCount(result.inProgress),

      blocked: this.normalizeCount(result.blocked),
    };
  }

  // ==========================================================================
  // Priority Statistics
  // ==========================================================================

  /**
   * Returns task priority distribution.
   */
  async getPriorityStatistics(filter: DashboardFilter) {
    const query = this.createTaskBaseQuery();

    this.applyTaskFilters(query, filter);

    const rows = await query
      .select([
        'task.priority AS priority',

        `
          COUNT(task.id)
          AS count
          `,
      ])
      .groupBy('task.priority')
      .getRawMany();

    return rows.map((row) => ({
      priority: row.priority,

      count: this.normalizeCount(row.count),
    }));
  }

  // ==========================================================================
  // Status Statistics
  // ==========================================================================

  /**
   * Returns task status distribution.
   */
  async getStatusStatistics(filter: DashboardFilter) {
    const query = this.createTaskBaseQuery();

    this.applyTaskFilters(query, filter);

    const rows = await query
      .select([
        'task.status AS status',

        `
          COUNT(task.id)
          AS count
          `,
      ])
      .groupBy('task.status')
      .getRawMany();

    return rows.map((row) => ({
      status: row.status,

      count: this.normalizeCount(row.count),
    }));
  }

  // ==========================================================================
  // Notification Summary
  // ==========================================================================

  /**
   * Retrieves notification widget statistics.
   */
  async getNotificationSummary(filter: DashboardFilter) {
    const query = this.createNotificationBaseQuery();

    this.applyNotificationFilters(query, filter);

    const result = await query
      .select([
        `
          COUNT(notification.id)
          AS total
          `,

        `
          COUNT(
            CASE
              WHEN notification.readAt IS NULL
              THEN 1
            END
          )
          AS unread
          `,

        `
          COUNT(
            CASE
              WHEN notification.readAt IS NOT NULL
              THEN 1
            END
          )
          AS read
          `,
      ])
      .getRawOne();

    return {
      total: this.normalizeCount(result.total),

      unread: this.normalizeCount(result.unread),

      read: this.normalizeCount(result.read),
    };
  }

  // ==========================================================================
  // Recent Tasks
  // ==========================================================================

  /**
   * Retrieves recently created tasks.
   *
   * Used by dashboard recent activity widget.
   */
  async getRecentTasks(
    filter: DashboardFilter,
    page = this.DEFAULT_PAGE,
    limit = 5,
  ) {
    const query = this.createTaskBaseQuery();

    this.applyTaskFilters(query, filter);

    this.applySorting(query, 'createdAt', 'DESC');

    this.applyPagination(query, page, limit);

    return query.getMany();
  }

  // ==========================================================================
  // Upcoming Deadlines
  // ==========================================================================

  /**
   * Retrieves upcoming task deadlines.
   *
   * Only incomplete tasks are considered.
   */
  async getUpcomingDeadlines(filter: DashboardFilter, limit = 10) {
    const query = this.createTaskBaseQuery();

    this.applyTaskFilters(query, filter);

    query.andWhere(
      `
      task.status != 'COMPLETED'
      `,
    );

    query.andWhere(
      `
      task.dueDate IS NOT NULL
      `,
    );

    query.andWhere(
      `
      task.dueDate >= NOW()
      `,
    );

    query.orderBy('task.dueDate', 'ASC').take(limit);

    return query.getMany();
  }

  // ==========================================================================
  // Productivity Trend
  // ==========================================================================

  /**
   * Calculates productivity trend.
   *
   * PostgreSQL date aggregation.
   *
   * Example:
   *
   * [
   *   {
   *     date: '2026-07-01',
   *     created: 12,
   *     completed: 8
   *   }
   * ]
   */
  async getProductivityTrend(filter: DashboardFilter) {
    const query = this.createTaskBaseQuery();

    this.applyTaskFilters(query, filter);

    const rows = await query
      .select([
        `
          DATE(task.createdAt)
          AS date
          `,

        `
          COUNT(task.id)
          AS created
          `,

        `
          COUNT(
            CASE
              WHEN task.status = 'COMPLETED'
              THEN 1
            END
          )
          AS completed
          `,
      ])

      .groupBy(
        `
          DATE(task.createdAt)
          `,
      )

      .orderBy(
        `
          DATE(task.createdAt)
          `,
        'ASC',
      )

      .getRawMany();

    return rows.map((row) => ({
      date: row.date,

      created: this.normalizeCount(row.created),

      completed: this.normalizeCount(row.completed),
    }));
  }

  // ==========================================================================
  // Completion Trend
  // ==========================================================================

  /**
   * Returns completed task trend.
   *
   * Used for productivity charts.
   */
  async getCompletionTrend(filter: DashboardFilter) {
    const query = this.createTaskBaseQuery();

    this.applyTaskFilters(query, filter);

    const rows = await query
      .select([
        `
          DATE(task.updatedAt)
          AS date
          `,

        `
          COUNT(task.id)
          AS completed
          `,
      ])

      .where(
        `
          task.status = 'COMPLETED'
          `,
      )

      .groupBy(
        `
          DATE(task.updatedAt)
          `,
      )

      .orderBy(
        `
          DATE(task.updatedAt)
          `,
        'ASC',
      )

      .getRawMany();

    return rows.map((row) => ({
      date: row.date,

      completed: this.normalizeCount(row.completed),
    }));
  }

  // ==========================================================================
  // Dashboard Calendar Tasks
  // ==========================================================================

  /**
   * Retrieves tasks scheduled around a date range.
   *
   * Used by calendar dashboard widget.
   */
  async getCalendarTasks(filter: DashboardFilter) {
    const query = this.createTaskBaseQuery();

    this.applyTaskFilters(query, filter);

    query.andWhere(
      `
      task.dueDate IS NOT NULL
      `,
    );

    query.orderBy('task.dueDate', 'ASC');

    return query.getMany();
  }

  // ==========================================================================
  // Task Count With Pagination Metadata
  // ==========================================================================

  /**
   * Retrieves paginated task count.
   *
   * Useful for dashboard tables.
   */
  async getPaginatedTaskCount(
    filter: DashboardFilter,
    page = this.DEFAULT_PAGE,
    limit = this.DEFAULT_LIMIT,
  ) {
    const query = this.createTaskBaseQuery();

    this.applyTaskFilters(query, filter);

    const [items, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,

      total,

      page,

      limit,

      pages: Math.ceil(total / limit),
    };
  }

  // ==========================================================================
  // Productivity Score
  // ==========================================================================

  /**
   * Calculates productivity score.
   *
   * Formula:
   *
   * Completion Rate
   * +
   * Task Completion Volume
   * +
   * Deadline Efficiency
   *
   * Repository returns raw calculation data.
   */
  async getProductivityScore(filter: DashboardFilter) {
    const query = this.createTaskBaseQuery();

    this.applyTaskFilters(query, filter);

    const result = await query
      .select([
        `
          COUNT(task.id)
          AS totalTasks
          `,

        `
          COUNT(
            CASE
              WHEN task.status = 'COMPLETED'
              THEN 1
            END
          )
          AS completedTasks
          `,

        `
          COUNT(
            CASE
              WHEN task.status = 'COMPLETED'
              AND task.dueDate >= task.updatedAt
              THEN 1
            END
          )
          AS onTimeCompleted
          `,
      ])
      .getRawOne();

    const total = this.normalizeCount(result.totalTasks);

    const completed = this.normalizeCount(result.completedTasks);

    const onTime = this.normalizeCount(result.onTimeCompleted);

    const completionRate = this.calculatePercentage(completed, total);

    const deadlineEfficiency = this.calculatePercentage(onTime, completed);

    return {
      completionRate,

      deadlineEfficiency,

      completedTasks: completed,

      totalTasks: total,
    };
  }

  // ==========================================================================
  // Daily Productivity Summary
  // ==========================================================================

  /**
   * Returns daily productivity metrics.
   */
  async getDailyProductivity(filter: DashboardFilter) {
    const query = this.createTaskBaseQuery();

    this.applyTaskFilters(query, filter);

    const rows = await query
      .select([
        `
          DATE(task.createdAt)
          AS date
          `,

        `
          COUNT(task.id)
          AS created
          `,

        `
          COUNT(
            CASE
              WHEN task.status = 'COMPLETED'
              THEN 1
            END
          )
          AS completed
          `,

        `
          COUNT(
            CASE
              WHEN task.status != 'COMPLETED'
              THEN 1
            END
          )
          AS remaining
          `,
      ])

      .groupBy(
        `
          DATE(task.createdAt)
          `,
      )

      .orderBy(
        `
          DATE(task.createdAt)
          `,
        'DESC',
      )

      .getRawMany();

    return rows.map((row) => ({
      date: row.date,

      created: this.normalizeCount(row.created),

      completed: this.normalizeCount(row.completed),

      remaining: this.normalizeCount(row.remaining),
    }));
  }

  // ==========================================================================
  // Dashboard Widget Statistics
  // ==========================================================================

  /**
   * Returns lightweight widget counters.
   *
   * Optimized for dashboard cards.
   */
  async getWidgetStatistics(filter: DashboardFilter) {
    const query = this.createTaskBaseQuery();

    this.applyTaskFilters(query, filter);

    const result = await query
      .select([
        `
          COUNT(task.id)
          AS totalTasks
          `,

        `
          COUNT(
            CASE
              WHEN task.status = 'COMPLETED'
              THEN 1
            END
          )
          AS completed
          `,

        `
          COUNT(
            CASE
              WHEN task.dueDate < NOW()
              AND task.status != 'COMPLETED'
              THEN 1
            END
          )
          AS overdue
          `,

        `
          COUNT(
            CASE
              WHEN task.createdAt >= NOW() - INTERVAL '7 days'
              THEN 1
            END
          )
          AS weeklyCreated
          `,
      ])
      .getRawOne();

    return {
      totalTasks: this.normalizeCount(result.totalTasks),

      completed: this.normalizeCount(result.completed),

      overdue: this.normalizeCount(result.overdue),

      weeklyCreated: this.normalizeCount(result.weeklyCreated),
    };
  }

  // ==========================================================================
  // Recent Activity Count
  // ==========================================================================

  /**
   * Returns recent dashboard activity count.
   */
  async getRecentActivityCount(filter: DashboardFilter) {
    const query = this.createTaskBaseQuery();

    this.applyTaskFilters(query, filter);

    const result = await query
      .andWhere(
        `
          task.createdAt >= NOW() - INTERVAL '24 hours'
          `,
      )
      .select(
        `
          COUNT(task.id)
          AS count
          `,
      )
      .getRawOne();

    return this.normalizeCount(result.count);
  }

  // ==========================================================================
  // Repository Health Helpers
  // ==========================================================================

  /**
   * Checks dashboard data availability.
   *
   * Useful for health/debug endpoints.
   */
  async hasDashboardData(userId: string): Promise<boolean> {
    const count = await this.taskRepository
      .createQueryBuilder('task')
      .where('task.userId = :userId', {
        userId,
      })
      .getCount();

    return count > 0;
  }
}
