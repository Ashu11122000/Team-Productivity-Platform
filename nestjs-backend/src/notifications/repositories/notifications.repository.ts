/*
 * ============================================================================
 * File: notifications.repository.ts
 * ============================================================================
 *
 * Enterprise Notifications Repository
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Encapsulates all notification persistence operations.
 * - Executes optimized TypeORM QueryBuilder queries.
 * - Applies filtering, sorting, and pagination.
 * - Aggregates notification statistics.
 * - Returns internal business models instead of DTOs.
 *
 * Architecture
 * ----------------------------------------------------------------------------
 *
 * NotificationController
 *          │
 *          ▼
 * NotificationService
 *          │
 *          ▼
 * NotificationsRepository
 *          │
 *          ▼
 * TypeORM QueryBuilder
 *          │
 *          ▼
 * PostgreSQL
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Repository Pattern
 * - Single Responsibility Principle (SRP)
 * - Clean Architecture
 * - Strong Typing
 * - Separation of Concerns
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - This repository NEVER returns DTOs.
 * - This repository NEVER contains business logic.
 * - Mapping is delegated to NotificationMapper.
 * - Authentication is handled by FastAPI.
 * - userId always originates from the validated JWT.
 *
 * Compatible With
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - TypeORM 0.3+
 * - PostgreSQL
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, SelectQueryBuilder } from 'typeorm';

import { NotificationEntity } from '../entities/notification.entity';

import { NotificationFilter } from '../interfaces/notification-filter.interface';
import { NotificationSummary } from '../interfaces/notification-summary.interface';
import { NotificationStats } from '../interfaces/notification-stats.interface';
import { PaginationResult } from '../interfaces/pagination-result.interface';

import { NotificationStatus } from '../../common/enums/notification-status.enum';
import { NotificationType } from '../../common/enums/notification-type.enum';

@Injectable()
export class NotificationsRepository {
  /**
   * Default QueryBuilder alias.
   */
  private static readonly TABLE_ALIAS = 'notification';

  /**
   * Default sorting column.
   */
  private static readonly DEFAULT_SORT_BY = 'createdAt';

  /**
   * Default sorting direction.
   */
  private static readonly DEFAULT_SORT_ORDER: 'ASC' | 'DESC' = 'DESC';

  /**
   * Default page.
   */
  private static readonly DEFAULT_PAGE = 1;

  /**
   * Default page size.
   */
  private static readonly DEFAULT_LIMIT = 10;

  /**
   * Maximum allowed page size.
   */
  private static readonly MAX_LIMIT = 100;

  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  /**
   * ==========================================================================
   * Create Base Query
   * ==========================================================================
   *
   * Creates the base notification QueryBuilder.
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Restrict queries to the authenticated user.
   * - Exclude soft-deleted notifications.
   * - Provide a reusable QueryBuilder instance.
   *
   * @param userId Authenticated user identifier.
   *
   * @returns Notification QueryBuilder.
   * ==========================================================================
   */
  private createBaseQuery(
    userId: string,
  ): SelectQueryBuilder<NotificationEntity> {
    return this.notificationRepository
      .createQueryBuilder(NotificationsRepository.TABLE_ALIAS)
      .where(`${NotificationsRepository.TABLE_ALIAS}.userId = :userId`, {
        userId,
      });
  }

  /**
   * ==========================================================================
   * Normalize Page Size
   * ==========================================================================
   *
   * Ensures the requested page size stays within supported limits.
   *
   * @param limit Requested page size.
   *
   * @returns Safe page size.
   * ==========================================================================
   */
  private normalizeLimit(limit?: number): number {
    if (!limit) {
      return NotificationsRepository.DEFAULT_LIMIT;
    }

    return Math.min(Math.max(limit, 1), NotificationsRepository.MAX_LIMIT);
  }

  /**
   * ==========================================================================
   * Normalize Page Number
   * ==========================================================================
   *
   * Prevents invalid page values.
   *
   * @param page Requested page.
   *
   * @returns Safe page number.
   * ==========================================================================
   */
  private normalizePage(page?: number): number {
    return Math.max(page ?? NotificationsRepository.DEFAULT_PAGE, 1);
  }

  /**
   * ==========================================================================
   * Apply Notification Filters
   * ==========================================================================
   *
   * Applies reusable notification filters to the QueryBuilder.
   *
   * Supported Filters
   * --------------------------------------------------------------------------
   * - Status
   * - Type
   * - Start Date
   * - End Date
   *
   * @param queryBuilder Notification QueryBuilder.
   * @param filter Notification filter.
   *
   * @returns Updated QueryBuilder.
   * ==========================================================================
   */
  private applyFilters(
    queryBuilder: SelectQueryBuilder<NotificationEntity>,
    filter: NotificationFilter,
  ): SelectQueryBuilder<NotificationEntity> {
    if (filter.status) {
      queryBuilder.andWhere(
        `${NotificationsRepository.TABLE_ALIAS}.status = :status`,
        {
          status: filter.status,
        },
      );
    }

    if (filter.type) {
      queryBuilder.andWhere(
        `${NotificationsRepository.TABLE_ALIAS}.type = :type`,
        {
          type: filter.type,
        },
      );
    }

    if (filter.startDate) {
      queryBuilder.andWhere(
        `${NotificationsRepository.TABLE_ALIAS}.createdAt >= :startDate`,
        {
          startDate: filter.startDate,
        },
      );
    }

    if (filter.endDate) {
      queryBuilder.andWhere(
        `${NotificationsRepository.TABLE_ALIAS}.createdAt <= :endDate`,
        {
          endDate: filter.endDate,
        },
      );
    }

    return queryBuilder;
  }

  /**
   * ==========================================================================
   * Apply Sorting
   * ==========================================================================
   *
   * Applies sorting to the QueryBuilder.
   *
   * @param queryBuilder Notification QueryBuilder.
   * @param filter Notification filter.
   *
   * @returns Updated QueryBuilder.
   * ==========================================================================
   */
  private applySorting(
    queryBuilder: SelectQueryBuilder<NotificationEntity>,
    filter: NotificationFilter,
  ): SelectQueryBuilder<NotificationEntity> {
    const sortBy = filter.sortBy ?? NotificationsRepository.DEFAULT_SORT_BY;

    const sortOrder =
      filter.sortOrder ?? NotificationsRepository.DEFAULT_SORT_ORDER;

    queryBuilder.orderBy(
      `${NotificationsRepository.TABLE_ALIAS}.${sortBy}`,
      sortOrder,
    );

    return queryBuilder;
  }

  /**
   * ==========================================================================
   * Normalize Database Numeric Values
   * ==========================================================================
   *
   * PostgreSQL aggregate functions frequently return numeric values as strings.
   * This helper safely converts them into JavaScript numbers.
   *
   * @param value Database value.
   *
   * @returns Normalized number.
   * ==========================================================================
   */
  private normalizeNumber(value: unknown): number {
    return Number(value ?? 0);
  }

  /**
   * ==========================================================================
   * Find Notifications
   * ==========================================================================
   *
   * Retrieves paginated notifications for the authenticated user.
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Apply filtering.
   * - Apply sorting.
   * - Apply pagination.
   * - Return entities with pagination metadata.
   *
   * @param filter Notification filter.
   *
   * @returns Paginated notifications.
   * ==========================================================================
   */
  public async findAll(
    filter: NotificationFilter,
  ): Promise<PaginationResult<NotificationEntity>> {
    const page = this.normalizePage(filter.page);

    const limit = this.normalizeLimit(filter.limit);

    const queryBuilder = this.createBaseQuery(filter.userId);

    this.applyFilters(queryBuilder, filter);

    this.applySorting(queryBuilder, filter);

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,

      totalPages: Math.ceil(total / limit),

      hasNextPage: page * limit < total,

      hasPreviousPage: page > 1,
    };
  }

  /**
   * ==========================================================================
   * Find Notification By Id
   * ==========================================================================
   *
   * Finds a notification belonging to the authenticated user.
   *
   * @param id Notification identifier.
   * @param userId Authenticated user identifier.
   *
   * @returns Notification entity or null.
   * ==========================================================================
   */
  public async findById(
    id: string,
    userId: string,
  ): Promise<NotificationEntity | null> {
    return this.createBaseQuery(userId)
      .andWhere(`${NotificationsRepository.TABLE_ALIAS}.id = :id`, {
        id,
      })
      .getOne();
  }

  /**
   * ==========================================================================
   * Save Notification
   * ==========================================================================
   *
   * Creates or updates a notification.
   *
   * TypeORM automatically performs INSERT or UPDATE
   * depending on the entity state.
   *
   * @param entity Notification entity.
   *
   * @returns Persisted notification.
   * ==========================================================================
   */
  public async save(entity: NotificationEntity): Promise<NotificationEntity> {
    return this.notificationRepository.save(entity);
  }

  /**
   * ==========================================================================
   * Soft Delete Notification
   * ==========================================================================
   *
   * Soft deletes a notification belonging to the authenticated user.
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Verify notification ownership.
   * - Soft delete the notification.
   * - Never throw business exceptions.
   *
   * @param id Notification identifier.
   * @param userId Authenticated user identifier.
   *
   * @returns True if a notification was deleted.
   * ==========================================================================
   */
  public async softDelete(id: string, userId: string): Promise<boolean> {
    const result = await this.notificationRepository
      .createQueryBuilder()
      .softDelete()
      .from(NotificationEntity)
      .where('id = :id', { id })
      .andWhere('userId = :userId', { userId })
      .execute();

    return (result.affected ?? 0) > 0;
  }

  /**
   * ==========================================================================
   * Restore Notification
   * ==========================================================================
   *
   * Restores a previously soft-deleted notification.
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Verify notification ownership.
   * - Restore soft-deleted notification.
   *
   * @param id Notification identifier.
   * @param userId Authenticated user identifier.
   *
   * @returns True if a notification was restored.
   * ==========================================================================
   */
  public async restore(id: string, userId: string): Promise<boolean> {
    const result = await this.notificationRepository
      .createQueryBuilder()
      .restore()
      .from(NotificationEntity)
      .where('id = :id', { id })
      .andWhere('userId = :userId', { userId })
      .execute();

    return (result.affected ?? 0) > 0;
  }

  /**
   * ==========================================================================
   * Get Notification Summary
   * ==========================================================================
   *
   * Retrieves the notification summary for the authenticated user.
   *
   * @param userId Authenticated user identifier.
   *
   * @returns Notification summary.
   * ==========================================================================
   */
  public async getSummary(userId: string): Promise<NotificationSummary> {
    const queryBuilder = this.createBaseQuery(userId);

    const [total, unread, read] = await Promise.all([
      queryBuilder.clone().getCount(),

      queryBuilder
        .clone()
        .andWhere(`${NotificationsRepository.TABLE_ALIAS}.status = :status`, {
          status: NotificationStatus.UNREAD,
        })
        .getCount(),

      queryBuilder
        .clone()
        .andWhere(`${NotificationsRepository.TABLE_ALIAS}.status = :status`, {
          status: NotificationStatus.READ,
        })
        .getCount(),
    ]);

    return {
      total,
      unread,
      read,
    };
  }

  /**
   * ==========================================================================
   * Get Notification Statistics
   * ==========================================================================
   *
   * Retrieves aggregated notification statistics.
   *
   * @param userId Authenticated user identifier.
   *
   * @returns Notification statistics.
   * ==========================================================================
   */
  public async getStats(userId: string): Promise<NotificationStats> {
    const summary = await this.getSummary(userId);

    const deleted = await this.notificationRepository
      .createQueryBuilder(NotificationsRepository.TABLE_ALIAS)
      .withDeleted()
      .where(`${NotificationsRepository.TABLE_ALIAS}.userId = :userId`, {
        userId,
      })
      .andWhere(`${NotificationsRepository.TABLE_ALIAS}.deletedAt IS NOT NULL`)
      .getCount();

    const rawTypes = await this.createBaseQuery(userId)
      .select(`${NotificationsRepository.TABLE_ALIAS}.type`, 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy(`${NotificationsRepository.TABLE_ALIAS}.type`)
      .getRawMany<{
        type: NotificationType;
        count: string;
      }>();

    return {
      total: summary.total,

      unread: summary.unread,

      read: summary.read,

      deleted,

      byType: rawTypes.map((row) => ({
        type: row.type,
        count: this.normalizeNumber(row.count),
      })),
    };
  }
}
