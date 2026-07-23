/*
 * ============================================================================
 * File: reminders.repository.ts
 * ============================================================================
 *
 * Enterprise Reminders Repository
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Encapsulate all reminder persistence logic.
 * - Build optimized PostgreSQL queries using TypeORM QueryBuilder.
 * - Handle CRUD operations.
 * - Handle filtering, sorting, pagination, and aggregations.
 * - Support soft delete and restore.
 * - Return persistence models only (never DTOs).
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Repository Pattern
 * - Single Responsibility Principle
 * - QueryBuilder only
 * - No business logic
 * - No HTTP concerns
 * - No DTO mapping
 *
 * Notes
 * ----------------------------------------------------------------------------
 * Controllers and services must never access TypeORM repositories directly.
 * All persistence operations should flow through this repository.
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';

import { ReminderEntity } from '../entities/reminder.entity';

import { ReminderFilter } from '../interfaces/reminder-filter.interface';
import { ReminderSummary } from '../interfaces/reminder-summary.interface';
import { PaginationResult } from '../interfaces/pagination-result.interface';
import { ReminderStatus } from '../enums/reminder-status.enum';
import { ReminderRepeat } from '../enums/reminder-repeat.enum';
import { ReminderStats } from '../interfaces/reminder-stats.interface';

@Injectable()
export class RemindersRepository {
  /**
   * Maximum page size allowed.
   */
  private static readonly MAX_PAGE_SIZE = 100;

  /**
   * Default page size.
   */
  private static readonly DEFAULT_PAGE_SIZE = 20;

  /**
   * Default page number.
   */
  private static readonly DEFAULT_PAGE = 1;

  /**
   * Supported sortable columns.
   */
  private static readonly SORTABLE_COLUMNS = new Set([
    'title',
    'status',
    'type',
    'repeat',
    'remindAt',
    'createdAt',
    'updatedAt',
    'completedAt',
  ]);

  constructor(
    @InjectRepository(ReminderEntity)
    private readonly repository: Repository<ReminderEntity>,
  ) {}

  /**
   * ==========================================================================
   * Creates the base QueryBuilder.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Creates the root query.
   * - Applies the authenticated user constraint.
   * - Serves as the starting point for every repository query.
   */
  private createBaseQuery(userId: number): SelectQueryBuilder<ReminderEntity> {
    return this.repository
      .createQueryBuilder('reminder')
      .where('reminder.userId = :userId', {
        userId,
      });
  }

  /**
   * ==========================================================================
   * Applies repository filters.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Search
   * - Status
   * - Type
   * - Repeat
   * - Date range
   * - Task
   * - Notification
   * - Overdue
   * - Soft delete
   */
  private applyFilters(
    query: SelectQueryBuilder<ReminderEntity>,
    filter: ReminderFilter,
  ): SelectQueryBuilder<ReminderEntity> {
    if (filter.search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(reminder.title) LIKE LOWER(:search)', {
            search: `%${filter.search}%`,
          }).orWhere('LOWER(reminder.description) LIKE LOWER(:search)', {
            search: `%${filter.search}%`,
          });
        }),
      );
    }

    if (filter.status) {
      query.andWhere('reminder.status = :status', {
        status: filter.status,
      });
    }

    if (filter.type) {
      query.andWhere('reminder.type = :type', {
        type: filter.type,
      });
    }

    if (filter.repeat) {
      query.andWhere('reminder.repeat = :repeat', {
        repeat: filter.repeat,
      });
    }

    if (filter.fromDate) {
      query.andWhere('reminder.remindAt >= :fromDate', {
        fromDate: filter.fromDate,
      });
    }

    if (filter.toDate) {
      query.andWhere('reminder.remindAt <= :toDate', {
        toDate: filter.toDate,
      });
    }

    if (filter.taskId) {
      query.andWhere('reminder.taskId = :taskId', {
        taskId: filter.taskId,
      });
    }

    if (filter.notificationId) {
      query.andWhere('reminder.notificationId = :notificationId', {
        notificationId: filter.notificationId,
      });
    }

    if (filter.overdue) {
      query.andWhere('reminder.remindAt < CURRENT_TIMESTAMP');

      query.andWhere('reminder.status = :pendingStatus', {
        pendingStatus: 'PENDING',
      });
    }

    if (filter.includeDeleted) {
      query.withDeleted();
    }

    return query;
  }

  /**
   * ==========================================================================
   * Applies sorting to the query.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Validates sortable columns.
   * - Applies a safe ORDER BY clause.
   * - Falls back to remindAt when an invalid column is supplied.
   */
  private applySorting(
    query: SelectQueryBuilder<ReminderEntity>,
    filter: ReminderFilter,
  ): SelectQueryBuilder<ReminderEntity> {
    const sortBy = RemindersRepository.SORTABLE_COLUMNS.has(filter.sortBy)
      ? filter.sortBy
      : 'remindAt';

    const sortOrder = filter.sortOrder === 'DESC' ? 'DESC' : 'ASC';

    return query.orderBy(`reminder.${sortBy}`, sortOrder);
  }

  /**
   * ==========================================================================
   * Normalizes the requested page size.
   * ==========================================================================
   */
  private normalizeLimit(limit?: number): number {
    if (!limit || Number.isNaN(limit)) {
      return RemindersRepository.DEFAULT_PAGE_SIZE;
    }

    return Math.min(Math.max(limit, 1), RemindersRepository.MAX_PAGE_SIZE);
  }

  /**
   * ==========================================================================
   * Normalizes the requested page number.
   * ==========================================================================
   */
  private normalizePage(page?: number): number {
    if (!page || Number.isNaN(page)) {
      return RemindersRepository.DEFAULT_PAGE;
    }

    return Math.max(page, 1);
  }

  /**
   * ==========================================================================
   * Safely converts aggregated database values to numbers.
   * ==========================================================================
   */
  private normalizeNumber(value: unknown): number {
    if (value === null || value === undefined) {
      return 0;
    }

    const numberValue = Number(value);

    return Number.isNaN(numberValue) ? 0 : numberValue;
  }

  /**
   * ==========================================================================
   * Returns a paginated collection of reminders.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Apply filters.
   * - Apply sorting.
   * - Apply pagination.
   * - Return ReminderEntity objects only.
   * - Never perform DTO mapping.
   */
  public async findAll(
    filter: ReminderFilter,
  ): Promise<PaginationResult<ReminderEntity>> {
    const page = this.normalizePage(filter.page);

    const limit = this.normalizeLimit(filter.limit);

    const query = this.createBaseQuery(filter.userId);

    this.applyFilters(query, filter);

    this.applySorting(query, filter);

    query.skip((page - 1) * limit).take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,

      page,
      limit,

      totalPages: total === 0 ? 0 : Math.ceil(total / limit),

      hasNext: page * limit < total,

      hasPrevious: page > 1,
    };
  }

  /**
   * ==========================================================================
   * Finds a reminder by its identifier.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Search within the authenticated user's reminders.
   * - Optionally include soft-deleted reminders.
   * - Return the persistence entity only.
   *
   * @param id Reminder identifier.
   * @param userId Authenticated user identifier.
   * @param includeDeleted Whether to include soft-deleted reminders.
   * @returns Reminder entity or null.
   */
  public async findById(
    id: string,
    userId: number,
    includeDeleted = false,
  ): Promise<ReminderEntity | null> {
    const query = this.createBaseQuery(userId);

    query.andWhere('reminder.id = :id', { id });

    if (includeDeleted) {
      query.withDeleted();
    }

    return query.getOne();
  }

  /**
   * ==========================================================================
   * Creates or updates a reminder.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Persist reminder changes.
   * - Delegate SQL generation to TypeORM.
   * - Return the persisted entity.
   *
   * @param reminder Reminder entity.
   * @returns Persisted reminder entity.
   */
  public async save(reminder: ReminderEntity): Promise<ReminderEntity> {
    return this.repository.save(reminder);
  }

  /**
   * ==========================================================================
   * Soft deletes a reminder.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Marks the reminder as deleted.
   * - Preserves historical data.
   *
   * @param id Reminder identifier.
   * @param userId Authenticated user identifier.
   */
  public async softDelete(id: string, userId: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .softDelete()
      .from(ReminderEntity)
      .where('id = :id', {
        id,
      })
      .andWhere('userId = :userId', {
        userId,
      })
      .execute();
  }

  /**
   * ==========================================================================
   * Restores a soft-deleted reminder.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Restores a previously deleted reminder.
   * - Operates only on reminders owned by the authenticated user.
   *
   * @param id Reminder identifier.
   * @param userId Authenticated user identifier.
   */
  public async restore(id: string, userId: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .restore()
      .from(ReminderEntity)
      .where('id = :id', {
        id,
      })
      .andWhere('userId = :userId', {
        userId,
      })
      .execute();
  }

  /**
   * ==========================================================================
   * Returns reminder summary statistics.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Calculate dashboard summary metrics.
   * - Use PostgreSQL aggregate queries.
   * - Return repository models only.
   * - Never perform DTO mapping.
   *
   * Summary Includes
   * --------------------------------------------------------------------------
   * - Total reminders
   * - Pending reminders
   * - Completed reminders
   * - Cancelled reminders
   * - Overdue reminders
   * - Today's reminders
   * - Upcoming reminders (next 7 days)
   * - Recurring reminders
   * - Soft deleted reminders
   *
   * @param userId Authenticated user identifier.
   * @returns Reminder summary.
   */
  public async getSummary(userId: number): Promise<ReminderSummary> {
    const query = this.repository
      .createQueryBuilder('reminder')
      .withDeleted()
      .where('reminder.userId = :userId', {
        userId,
      })
      .select('COUNT(*)', 'total')
      .addSelect(
        `
        COUNT(*) FILTER (
          WHERE reminder.status = :pendingStatus
            AND reminder.deletedAt IS NULL
        )
        `,
        'pending',
      )
      .addSelect(
        `
        COUNT(*) FILTER (
          WHERE reminder.status = :completedStatus
            AND reminder.deletedAt IS NULL
        )
        `,
        'completed',
      )
      .addSelect(
        `
        COUNT(*) FILTER (
          WHERE reminder.status = :cancelledStatus
            AND reminder.deletedAt IS NULL
        )
        `,
        'cancelled',
      )
      .addSelect(
        `
        COUNT(*) FILTER (
          WHERE reminder.status = :overdueStatus
            AND reminder.deletedAt IS NULL
        )
        `,
        'overdue',
      )
      .addSelect(
        `
        COUNT(*) FILTER (
          WHERE DATE(reminder.remindAt) = CURRENT_DATE
            AND reminder.deletedAt IS NULL
        )
        `,
        'today',
      )
      .addSelect(
        `
        COUNT(*) FILTER (
          WHERE reminder.remindAt >= CURRENT_TIMESTAMP
            AND reminder.remindAt <
                CURRENT_TIMESTAMP + INTERVAL '7 days'
            AND reminder.deletedAt IS NULL
        )
        `,
        'upcoming',
      )
      .addSelect(
        `
        COUNT(*) FILTER (
          WHERE reminder.repeat <> :noRepeat
            AND reminder.deletedAt IS NULL
        )
        `,
        'recurring',
      )
      .addSelect(
        `
        COUNT(*) FILTER (
          WHERE reminder.deletedAt IS NOT NULL
        )
        `,
        'deleted',
      )
      .setParameters({
        pendingStatus: 'PENDING',
        completedStatus: 'COMPLETED',
        cancelledStatus: 'CANCELLED',
        overdueStatus: 'OVERDUE',
        noRepeat: 'NONE',
      });

    const result = await query.getRawOne<Record<string, unknown>>();

    return {
      total: this.normalizeNumber(result?.total),
      pending: this.normalizeNumber(result?.pending),
      completed: this.normalizeNumber(result?.completed),
      cancelled: this.normalizeNumber(result?.cancelled),
      overdue: this.normalizeNumber(result?.overdue),
      today: this.normalizeNumber(result?.today),
      upcoming: this.normalizeNumber(result?.upcoming),
      recurring: this.normalizeNumber(result?.recurring),
      deleted: this.normalizeNumber(result?.deleted),
    };
  }

  /**
   * ==========================================================================
   * Returns reminder statistics.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Calculate reminder statistics for dashboards and analytics.
   * - Execute optimized PostgreSQL aggregate queries.
   * - Return repository models only.
   * - Never perform DTO mapping.
   *
   * Statistics Include
   * --------------------------------------------------------------------------
   * - Total reminders
   * - Active reminders
   * - Pending reminders
   * - Completed reminders
   * - Cancelled reminders
   * - Overdue reminders
   * - Today's reminders
   * - Upcoming reminders
   * - Recurring reminders
   * - Soft deleted reminders
   * - Completion rate
   * - Average reminders created per day
   *
   * @param userId Authenticated user identifier.
   * @returns Reminder statistics.
   */
  public async getStats(userId: number): Promise<ReminderStats> {
    const query = this.repository
      .createQueryBuilder('reminder')
      .withDeleted()
      .where('reminder.userId = :userId', {
        userId,
      })
      .select('COUNT(*)', 'total')
      .addSelect(
        `
        COUNT(*) FILTER (
          WHERE reminder.deletedAt IS NULL
        )
        `,
        'active',
      )
      .addSelect(
        `
        COUNT(*) FILTER (
          WHERE reminder.status = :pendingStatus
            AND reminder.deletedAt IS NULL
        )
        `,
        'pending',
      )
      .addSelect(
        `
        COUNT(*) FILTER (
          WHERE reminder.status = :completedStatus
            AND reminder.deletedAt IS NULL
        )
        `,
        'completed',
      )
      .addSelect(
        `
        COUNT(*) FILTER (
          WHERE reminder.status = :cancelledStatus
            AND reminder.deletedAt IS NULL
        )
        `,
        'cancelled',
      )
      .addSelect(
        `
        COUNT(*) FILTER (
          WHERE reminder.status = :overdueStatus
            AND reminder.deletedAt IS NULL
        )
        `,
        'overdue',
      )
      .addSelect(
        `
        COUNT(*) FILTER (
          WHERE DATE(reminder.remindAt) = CURRENT_DATE
            AND reminder.deletedAt IS NULL
        )
        `,
        'today',
      )
      .addSelect(
        `
        COUNT(*) FILTER (
          WHERE reminder.remindAt >= CURRENT_TIMESTAMP
            AND reminder.remindAt <
                CURRENT_TIMESTAMP + INTERVAL '7 days'
            AND reminder.deletedAt IS NULL
        )
        `,
        'upcoming',
      )
      .addSelect(
        `
        COUNT(*) FILTER (
          WHERE reminder.repeat <> :noRepeat
            AND reminder.deletedAt IS NULL
        )
        `,
        'recurring',
      )
      .addSelect(
        `
        COUNT(*) FILTER (
          WHERE reminder.deletedAt IS NOT NULL
        )
        `,
        'deleted',
      )
      .addSelect(
        `
        CASE
          WHEN COUNT(*) FILTER (
            WHERE reminder.deletedAt IS NULL
          ) = 0
          THEN 0
          ELSE ROUND(
            (
              COUNT(*) FILTER (
                WHERE reminder.status = :completedStatus
                  AND reminder.deletedAt IS NULL
              )::numeric
              /
              COUNT(*) FILTER (
                WHERE reminder.deletedAt IS NULL
              )::numeric
            ) * 100,
            2
          )
        END
        `,
        'completionRate',
      )
      .addSelect(
        `
        CASE
          WHEN COUNT(DISTINCT DATE(reminder.createdAt)) = 0
          THEN 0
          ELSE ROUND(
            COUNT(*)::numeric /
            COUNT(DISTINCT DATE(reminder.createdAt))::numeric,
            2
          )
        END
        `,
        'averagePerDay',
      )
      .setParameters({
        pendingStatus: ReminderStatus.PENDING,
        completedStatus: ReminderStatus.COMPLETED,
        cancelledStatus: ReminderStatus.CANCELLED,
        overdueStatus: ReminderStatus.OVERDUE,
        noRepeat: ReminderRepeat.NONE,
      });

    const result = await query.getRawOne<Record<string, unknown>>();

    return {
      total: this.normalizeNumber(result?.total),
      active: this.normalizeNumber(result?.active),
      pending: this.normalizeNumber(result?.pending),
      completed: this.normalizeNumber(result?.completed),
      cancelled: this.normalizeNumber(result?.cancelled),
      overdue: this.normalizeNumber(result?.overdue),
      today: this.normalizeNumber(result?.today),
      upcoming: this.normalizeNumber(result?.upcoming),
      recurring: this.normalizeNumber(result?.recurring),
      deleted: this.normalizeNumber(result?.deleted),
      completionRate: this.normalizeNumber(result?.completionRate),
      averagePerDay: this.normalizeNumber(result?.averagePerDay),
    };
  }
}
