/**
 * ============================================================================
 * File: tags.repository.ts
 * ============================================================================
 *
 * Enterprise Tags Repository.
 *
 * Responsibilities
 * ----------------
 * - Encapsulate all database operations for tags.
 * - Hide TypeORM implementation details from the service layer.
 * - Provide reusable QueryBuilder-based methods.
 * - Centralize persistence logic.
 * - Support filtering, pagination, searching, sorting,
 *   and analytics-friendly queries.
 *
 * Notes
 * -----
 * - Business logic MUST NOT exist here.
 * - This repository is responsible only for persistence.
 * - Controllers and services must never access TypeORM directly.
 *
 * Architecture
 * ------------
 * Controller
 *      │
 *      ▼
 * Service
 *      │
 *      ▼
 * TagsRepository
 *      │
 *      ▼
 * TypeORM QueryBuilder
 *      │
 *      ▼
 * PostgreSQL
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM 0.3+
 * - PostgreSQL
 * - Node.js 22+
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';

import { TagEntity } from '../entities/tag.entity';

import { TagFilter } from '../interfaces/tag-filter.interface';

import { TagSummary } from '../interfaces/tag-summary.interface';

import { PaginationResult } from '../interfaces/pagination-result.interface';

import { NotFoundException } from '../../common/exceptions';

/**
 * ============================================================================
 * Enterprise Tags Repository
 * ============================================================================
 *
 * Centralizes all persistence operations related to tags.
 *
 * Responsibilities
 * ----------------
 * - CRUD operations
 * - QueryBuilder creation
 * - Filtering
 * - Searching
 * - Sorting
 * - Pagination
 * - Analytics queries
 * - Soft delete support
 *
 * The repository intentionally contains NO business logic.
 * ============================================================================
 */
@Injectable()
export class TagsRepository {
  /**
   * Default QueryBuilder table alias.
   */
  private static readonly TABLE_ALIAS = 'tag';

  /**
   * Allowed sortable database columns.
   *
   * Prevents SQL injection by restricting ORDER BY
   * to predefined columns only.
   */
  private static readonly SORTABLE_COLUMNS = [
    'name',
    'color',
    'createdAt',
    'updatedAt',
  ] as const;

  /**
   * Default sorting column.
   */
  private static readonly DEFAULT_SORT_COLUMN = 'createdAt';

  /**
   * Default sorting direction.
   */
  private static readonly DEFAULT_SORT_DIRECTION: 'ASC' | 'DESC' = 'DESC';

  /**
   * Searchable columns.
   */
  private static readonly SEARCHABLE_COLUMNS = ['name'] as const;

  constructor(
    @InjectRepository(TagEntity)
    private readonly repository: Repository<TagEntity>,
  ) {}

  /**
   * Creates a new TagEntity instance.
   *
   * The entity is NOT persisted until save() is called.
   *
   * @param payload Partial tag payload.
   *
   * @returns TagEntity instance.
   */
  create(payload: Partial<TagEntity>): TagEntity {
    return this.repository.create(payload);
  }

  /**
   * Persists a tag entity.
   *
   * Inserts or updates depending on entity state.
   *
   * @param tag Tag entity.
   *
   * @returns Persisted TagEntity.
   */
  async save(tag: TagEntity): Promise<TagEntity> {
    return this.repository.save(tag);
  }

  /**
   * Soft deletes a tag.
   *
   * Uses TypeORM soft delete support through
   * DeleteDateColumn.
   *
   * @param tag Tag entity.
   *
   * @returns Soft deleted TagEntity.
   */
  async softRemove(tag: TagEntity): Promise<TagEntity> {
    return this.repository.softRemove(tag);
  }

  /**
   * Restores a previously soft deleted tag.
   *
   * @param tag Soft deleted TagEntity.
   *
   * @returns Restored TagEntity.
   */
  async recover(tag: TagEntity): Promise<TagEntity> {
    return this.repository.recover(tag);
  }

  /**
   * Creates the base QueryBuilder used by all tag queries.
   *
   * Responsibilities
   * ----------------
   * - Scope queries to authenticated user.
   * - Exclude soft deleted records by default.
   * - Provide reusable QueryBuilder configuration.
   *
   * @param filter Repository filter contract.
   *
   * @returns Configured QueryBuilder.
   */
  private createBaseQuery(
    filter: Pick<TagFilter, 'userId' | 'includeDeleted'>,
  ): SelectQueryBuilder<TagEntity> {
    const queryBuilder = this.repository
      .createQueryBuilder(TagsRepository.TABLE_ALIAS)
      .where(`${TagsRepository.TABLE_ALIAS}.userId = :userId`, {
        userId: filter.userId,
      });

    /**
     * Include soft deleted tags only when explicitly requested.
     */
    if (filter.includeDeleted) {
      queryBuilder.withDeleted();
    }

    return queryBuilder;
  }

  /**
   * Applies filters to tag queries.
   *
   * Supported filters:
   * - Search by tag name
   *
   * @param queryBuilder Configured QueryBuilder.
   * @param filter Repository filter contract.
   *
   * @returns Updated QueryBuilder.
   */
  private applyFilters(
    queryBuilder: SelectQueryBuilder<TagEntity>,
    filter: TagFilter,
  ): SelectQueryBuilder<TagEntity> {
    /**
     * Search filter.
     *
     * Uses PostgreSQL ILIKE for case-insensitive
     * searching.
     */
    if (filter.search?.trim()) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(`${TagsRepository.TABLE_ALIAS}.name ILIKE :search`, {
            search: `%${filter.search}%`,
          });
        }),
      );
    }

    return queryBuilder;
  }

  /**
   * Applies sorting to tag queries.
   *
   * Responsibilities
   * ----------------
   * - Validate requested sort column.
   * - Prevent SQL injection.
   * - Apply default sorting.
   *
   * @param queryBuilder Configured QueryBuilder.
   * @param filter Repository filter contract.
   *
   * @returns Updated QueryBuilder.
   */
  private applySorting(
    queryBuilder: SelectQueryBuilder<TagEntity>,
    filter: TagFilter,
  ): SelectQueryBuilder<TagEntity> {
    const sortColumn = TagsRepository.SORTABLE_COLUMNS.includes(
      filter.sortBy as (typeof TagsRepository.SORTABLE_COLUMNS)[number],
    )
      ? filter.sortBy
      : TagsRepository.DEFAULT_SORT_COLUMN;

    const sortDirection =
      filter.sortOrder ?? TagsRepository.DEFAULT_SORT_DIRECTION;

    queryBuilder.orderBy(
      `${TagsRepository.TABLE_ALIAS}.${sortColumn}`,
      sortDirection,
    );

    /**
     * Stable secondary sorting.
     */
    if (sortColumn !== 'createdAt') {
      queryBuilder.addOrderBy(
        `${TagsRepository.TABLE_ALIAS}.createdAt`,
        'DESC',
      );
    }

    return queryBuilder;
  }

  /**
   * Applies pagination to tag queries.
   *
   * @param queryBuilder Configured QueryBuilder.
   * @param filter Repository filter contract.
   *
   * @returns Updated QueryBuilder.
   */
  private applyPagination(
    queryBuilder: SelectQueryBuilder<TagEntity>,
    filter: TagFilter,
  ): SelectQueryBuilder<TagEntity> {
    const page = Math.max(filter.page, 1);

    const limit = Math.max(filter.limit, 1);

    const skip = filter.skip >= 0 ? filter.skip : (page - 1) * limit;

    queryBuilder.skip(skip);

    queryBuilder.take(limit);

    return queryBuilder;
  }

  /**
   * Builds a standardized pagination response.
   *
   * Responsibilities
   * ----------------
   * - Calculate pagination metadata.
   * - Provide consistent pagination structure.
   * - Keep pagination formatting centralized.
   *
   * @param data Current page records.
   * @param total Total matching records.
   * @param filter Pagination information.
   *
   * @returns PaginationResult.
   */
  private buildPaginationResult<T>(
    data: T[],
    total: number,
    filter: Pick<TagFilter, 'page' | 'limit'>,
  ): PaginationResult<T> {
    const totalPages = total === 0 ? 0 : Math.ceil(total / filter.limit);

    return {
      data,

      total,

      page: filter.page,

      limit: filter.limit,

      totalPages,

      hasNextPage: filter.page < totalPages,

      hasPreviousPage: filter.page > 1,
    };
  }

  /**
   * Finds tags using filtering, searching,
   * sorting, and pagination.
   *
   * Responsibilities
   * ----------------
   * - Scope results to authenticated user.
   * - Apply filters.
   * - Apply sorting.
   * - Apply pagination.
   * - Execute database query.
   *
   * @param filter Repository filter contract.
   *
   * @returns Paginated tag entities.
   */
  async findAll(filter: TagFilter): Promise<PaginationResult<TagEntity>> {
    const queryBuilder = this.createBaseQuery(filter);

    this.applyFilters(queryBuilder, filter);

    this.applySorting(queryBuilder, filter);

    this.applyPagination(queryBuilder, filter);

    const [tags, total] = await queryBuilder.getManyAndCount();

    return this.buildPaginationResult<TagEntity>(tags, total, filter);
  }

  /**
   * Finds a tag by identifier.
   *
   * Responsibilities
   * ----------------
   * - Scope query to authenticated user.
   * - Load a single tag entity.
   * - Respect soft delete configuration.
   *
   * @param id Tag identifier.
   * @param userId Authenticated user identifier.
   * @param includeDeleted Include soft deleted tags.
   *
   * @returns TagEntity or null.
   */
  async findById(
    id: string,
    userId: string,
    includeDeleted = false,
  ): Promise<TagEntity | null> {
    const queryBuilder = this.createBaseQuery({
      userId,
      includeDeleted,
    });

    queryBuilder.andWhere(`${TagsRepository.TABLE_ALIAS}.id = :id`, {
      id,
    });

    return queryBuilder.getOne();
  }

  /**
   * Finds a tag by identifier or throws exception.
   *
   * @param id Tag identifier.
   * @param userId Authenticated user identifier.
   * @param includeDeleted Include soft deleted tags.
   *
   * @throws NotFoundException
   *
   * @returns TagEntity.
   */
  async findByIdOrFail(
    id: string,
    userId: string,
    includeDeleted = false,
  ): Promise<TagEntity> {
    const tag = await this.findById(id, userId, includeDeleted);

    if (!tag) {
      throw new NotFoundException(`Tag with ID "${id}" was not found.`);
    }

    return tag;
  }

  /**
   * Creates and persists a new tag.
   *
   * Responsibilities
   * ----------------
   * - Create TagEntity instance.
   * - Save entity.
   * - Return persisted entity.
   *
   * @param payload Partial tag payload.
   *
   * @returns Persisted TagEntity.
   */
  async createTag(payload: Partial<TagEntity>): Promise<TagEntity> {
    const entity = this.repository.create(payload);

    return this.repository.save(entity);
  }

  /**
   * Updates an existing tag.
   *
   * @param entity Existing tag entity.
   * @param payload Updated tag properties.
   *
   * @returns Updated TagEntity.
   */
  async updateTag(
    entity: TagEntity,
    payload: Partial<TagEntity>,
  ): Promise<TagEntity> {
    this.repository.merge(entity, payload);

    return this.repository.save(entity);
  }

  /**
   * Soft deletes a tag.
   *
   * The record is not permanently removed.
   * Instead, deletedAt is populated.
   *
   * @param entity Tag entity.
   *
   * @returns Soft deleted TagEntity.
   */
  async softDelete(entity: TagEntity): Promise<TagEntity> {
    return this.repository.softRemove(entity);
  }

  /**
   * Restores a previously deleted tag.
   *
   * @param entity Soft deleted TagEntity.
   *
   * @returns Restored TagEntity.
   */
  async restore(entity: TagEntity): Promise<TagEntity> {
    return this.repository.recover(entity);
  }

  /**
   * Checks whether a tag exists.
   *
   * Responsibilities
   * ----------------
   * - Scope lookup to authenticated user.
   * - Avoid unnecessary entity loading.
   *
   * @param id Tag identifier.
   * @param userId Authenticated user identifier.
   *
   * @returns True when tag exists.
   */
  async exists(id: string, userId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: {
        id,
        userId,
      },
    });

    return count > 0;
  }

  /**
   * Checks whether a tag already exists by name.
   *
   * Responsibilities
   * ----------------
   * - Prevent duplicate tag names.
   * - Scope lookup to authenticated user.
   *
   * Notes
   * -----
   * Database also protects this through:
   *
   * UNIQUE(userId, name)
   *
   * @param name Tag name.
   * @param userId Authenticated user identifier.
   *
   * @returns True when duplicate exists.
   */
  async existsByName(name: string, userId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: {
        name,
        userId,
      },
    });

    return count > 0;
  }

  /**
   * Returns aggregated tag statistics.
   *
   * Responsibilities
   * ----------------
   * - Calculate tag metrics.
   * - Return internal TagSummary contract.
   * - Support analytics integration.
   *
   * @param userId Authenticated user identifier.
   *
   * @returns Tag summary.
   */
  async getSummary(userId: string): Promise<TagSummary> {
    const [total, active, deleted, used, unused] = await Promise.all([
      this.countTotalTags(userId),

      this.countActiveTags(userId),

      this.countDeletedTags(userId),

      this.countUsedTags(userId),

      this.countUnusedTags(userId),
    ]);

    return {
      total,

      active,

      deleted,

      used,

      unused,
    };
  }

  /**
   * Counts total tags including soft deleted records.
   *
   * @param userId Authenticated user identifier.
   *
   * @returns Total tags.
   */
  private async countTotalTags(userId: string): Promise<number> {
    return this.repository.count({
      where: {
        userId,
      },

      withDeleted: true,
    });
  }

  /**
   * Counts active tags.
   *
   * @param userId Authenticated user identifier.
   *
   * @returns Active tags count.
   */
  async countActiveTags(userId: string): Promise<number> {
    return this.repository.count({
      where: {
        userId,
      },
    });
  }

  /**
   * Counts deleted tags.
   *
   * @param userId Authenticated user identifier.
   *
   * @returns Deleted tags count.
   */
  async countDeletedTags(userId: string): Promise<number> {
    return this.repository
      .createQueryBuilder(TagsRepository.TABLE_ALIAS)
      .withDeleted()
      .where(`${TagsRepository.TABLE_ALIAS}.userId = :userId`, {
        userId,
      })
      .andWhere(`${TagsRepository.TABLE_ALIAS}.deletedAt IS NOT NULL`)
      .getCount();
  }

  /**
   * Counts tags assigned to tasks.
   *
   * @param userId Authenticated user identifier.
   *
   * @returns Used tag count.
   */
  async countUsedTags(userId: string): Promise<number> {
    return this.repository
      .createQueryBuilder(TagsRepository.TABLE_ALIAS)
      .leftJoin(`${TagsRepository.TABLE_ALIAS}.tasks`, 'task')
      .where(`${TagsRepository.TABLE_ALIAS}.userId = :userId`, {
        userId,
      })
      .andWhere('task.id IS NOT NULL')
      .getCount();
  }

  /**
   * Counts unused tags.
   *
   * @param userId Authenticated user identifier.
   *
   * @returns Unused tag count.
   */
  async countUnusedTags(userId: string): Promise<number> {
    return this.repository
      .createQueryBuilder(TagsRepository.TABLE_ALIAS)
      .leftJoin(`${TagsRepository.TABLE_ALIAS}.tasks`, 'task')
      .where(`${TagsRepository.TABLE_ALIAS}.userId = :userId`, {
        userId,
      })
      .andWhere('task.id IS NULL')
      .getCount();
  }
}
