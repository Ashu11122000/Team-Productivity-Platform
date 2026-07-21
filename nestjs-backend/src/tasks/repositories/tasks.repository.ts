/**
 * ============================================================================
 * File: tasks.repository.ts
 * ============================================================================
 *
 * Enterprise Tasks Repository.
 *
 * Responsibilities
 * ----------------
 * - Encapsulate all database operations for tasks.
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
 * TasksRepository
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

import { TaskEntity } from '../entities/task.entity';

import { TaskFilter } from '../interfaces/task-filter.interface';
import { TaskSummary } from '../interfaces/task-summary.interface';

import { PaginationResult } from '../interfaces/pagination-result.interface';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { TaskPriority } from '../../common/enums/task-priority.enum';
import { NotFoundException } from '../../common/exceptions';

/**
 * Enterprise repository responsible for all
 * task persistence operations.
 */
@Injectable()
export class TasksRepository {
  /**
   * Default table alias used throughout the repository.
   *
   * Keeping the alias centralized makes QueryBuilder
   * methods easier to maintain and prevents hard-coded
   * string duplication.
   */
  private static readonly TABLE_ALIAS = 'task';

  /**
   * Columns that are allowed to be used for sorting.
   *
   * Prevents SQL injection by restricting ORDER BY
   * to a predefined whitelist.
   */
  private static readonly SORTABLE_COLUMNS = [
    'title',
    'status',
    'priority',
    'dueDate',
    'completedAt',
    'estimatedMinutes',
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
   *
   * Used by the reusable search helper.
   */
  private static readonly SEARCHABLE_COLUMNS = [
    'title',
    'description',
  ] as const;

  constructor(
    @InjectRepository(TaskEntity)
    private readonly repository: Repository<TaskEntity>,
  ) {}

  /**
   * Creates a new Task entity instance.
   *
   * The entity is NOT persisted until save() is called.
   *
   * @param payload Partial task payload.
   * @returns TaskEntity instance.
   */
  create(payload: Partial<TaskEntity>): TaskEntity {
    return this.repository.create(payload);
  }

  /**
   * Persists a task.
   *
   * Inserts or updates depending on entity state.
   *
   * @param task Task entity.
   * @returns Persisted entity.
   */
  async save(task: TaskEntity): Promise<TaskEntity> {
    return this.repository.save(task);
  }

  /**
   * Soft deletes a task.
   *
   * Uses TypeORM soft delete support via DeleteDateColumn.
   *
   * @param task Task entity.
   */
  async softRemove(task: TaskEntity): Promise<TaskEntity> {
    return this.repository.softRemove(task);
  }

  /**
   * Restores a previously soft deleted task.
   *
   * @param task Task entity.
   */
  async recover(task: TaskEntity): Promise<TaskEntity> {
    return this.repository.recover(task);
  }

  /**
   * Creates the base QueryBuilder used by all repository queries.
   *
   * Responsibilities
   * ----------------
   * - Scope queries to the authenticated user.
   * - Exclude soft-deleted records by default.
   * - Join frequently used relations.
   * - Return a reusable QueryBuilder instance.
   *
   * All repository methods should start from this method to
   * guarantee consistent query behaviour.
   *
   * @param filter Repository filtering contract.
   * @returns Configured QueryBuilder.
   */
  private createBaseQuery(
    filter: Pick<TaskFilter, 'userId' | 'includeDeleted'>,
  ): SelectQueryBuilder<TaskEntity> {
    const queryBuilder = this.repository
      .createQueryBuilder(TasksRepository.TABLE_ALIAS)
      .leftJoinAndSelect(`${TasksRepository.TABLE_ALIAS}.category`, 'category')
      .leftJoinAndSelect(`${TasksRepository.TABLE_ALIAS}.tags`, 'tag')
      .where(`${TasksRepository.TABLE_ALIAS}.userId = :userId`, {
        userId: filter.userId,
      });

    /**
     * Include soft-deleted records only when explicitly requested.
     */
    if (filter.includeDeleted) {
      queryBuilder.withDeleted();
    }

    return queryBuilder;
  }

  /**
   * Applies repository filters to the QueryBuilder.
   *
   * Responsibilities
   * ----------------
   * - Apply optional filtering criteria.
   * - Keep filtering logic centralized.
   * - Avoid duplicated QueryBuilder code.
   *
   * Supported Filters
   * -----------------
   * - Status
   * - Priority
   * - Category
   * - Tags
   * - Search
   * - Due date range
   * - Completed
   * - Overdue
   *
   * @param queryBuilder Base QueryBuilder.
   * @param filter Repository filter contract.
   * @returns Updated QueryBuilder.
   */
  private applyFilters(
    queryBuilder: SelectQueryBuilder<TaskEntity>,
    filter: TaskFilter,
  ): SelectQueryBuilder<TaskEntity> {
    /**
     * Status filter.
     */
    if (filter.status) {
      queryBuilder.andWhere(`${TasksRepository.TABLE_ALIAS}.status = :status`, {
        status: filter.status,
      });
    }

    /**
     * Priority filter.
     */
    if (filter.priority) {
      queryBuilder.andWhere(
        `${TasksRepository.TABLE_ALIAS}.priority = :priority`,
        {
          priority: filter.priority,
        },
      );
    }

    /**
     * Category filter.
     */
    if (filter.categoryId) {
      queryBuilder.andWhere(
        `${TasksRepository.TABLE_ALIAS}.categoryId = :categoryId`,
        {
          categoryId: filter.categoryId,
        },
      );
    }

    /**
     * Tag filter.
     *
     * Returns tasks that contain one or more
     * of the supplied tags.
     */
    if (filter.tagIds?.length) {
      queryBuilder.andWhere('tag.id IN (:...tagIds)', {
        tagIds: filter.tagIds,
      });
    }

    /**
     * Search filter.
     *
     * Searches title and description.
     */
    if (filter.search?.trim()) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(`${TasksRepository.TABLE_ALIAS}.title ILIKE :search`, {
            search: `%${filter.search}%`,
          }).orWhere(
            `${TasksRepository.TABLE_ALIAS}.description ILIKE :search`,
          );
        }),
      );
    }

    /**
     * Due date range.
     */
    if (filter.dueDateFrom) {
      queryBuilder.andWhere(
        `${TasksRepository.TABLE_ALIAS}.dueDate >= :dueDateFrom`,
        {
          dueDateFrom: filter.dueDateFrom,
        },
      );
    }

    if (filter.dueDateTo) {
      queryBuilder.andWhere(
        `${TasksRepository.TABLE_ALIAS}.dueDate <= :dueDateTo`,
        {
          dueDateTo: filter.dueDateTo,
        },
      );
    }

    /**
     * Completed tasks only.
     */
    if (filter.completed === true) {
      queryBuilder.andWhere(
        `${TasksRepository.TABLE_ALIAS}.completedAt IS NOT NULL`,
      );
    }

    /**
     * Pending tasks only.
     */
    if (filter.completed === false) {
      queryBuilder.andWhere(
        `${TasksRepository.TABLE_ALIAS}.completedAt IS NULL`,
      );
    }

    /**
     * Overdue tasks.
     *
     * A task is overdue when:
     * - dueDate exists
     * - dueDate is before now
     * - task has not been completed
     */
    if (filter.overdue) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(`${TasksRepository.TABLE_ALIAS}.dueDate IS NOT NULL`)
            .andWhere(
              `${TasksRepository.TABLE_ALIAS}.dueDate < CURRENT_TIMESTAMP`,
            )
            .andWhere(`${TasksRepository.TABLE_ALIAS}.completedAt IS NULL`);
        }),
      );
    }

    return queryBuilder;
  }

  /**
   * Applies sorting to the QueryBuilder.
   *
   * Responsibilities
   * ----------------
   * - Validate requested sort column.
   * - Prevent SQL injection.
   * - Apply default sorting when necessary.
   * - Keep ordering logic centralized.
   *
   * @param queryBuilder Configured QueryBuilder.
   * @param filter Repository filter contract.
   * @returns Updated QueryBuilder.
   */
  private applySorting(
    queryBuilder: SelectQueryBuilder<TaskEntity>,
    filter: TaskFilter,
  ): SelectQueryBuilder<TaskEntity> {
    /**
     * Determine which column should be used.
     */
    const sortColumn = TasksRepository.SORTABLE_COLUMNS.includes(
      filter.sortBy as (typeof TasksRepository.SORTABLE_COLUMNS)[number],
    )
      ? filter.sortBy
      : TasksRepository.DEFAULT_SORT_COLUMN;

    /**
     * Determine sorting direction.
     */
    const sortDirection =
      filter.sortOrder ?? TasksRepository.DEFAULT_SORT_DIRECTION;

    /**
     * Apply ordering.
     */
    queryBuilder.orderBy(
      `${TasksRepository.TABLE_ALIAS}.${sortColumn}`,
      sortDirection,
    );

    /**
     * Stable secondary ordering.
     *
     * Ensures deterministic pagination when
     * multiple records have identical values
     * for the primary sort column.
     */
    if (sortColumn !== 'createdAt') {
      queryBuilder.addOrderBy(
        `${TasksRepository.TABLE_ALIAS}.createdAt`,
        'DESC',
      );
    }

    return queryBuilder;
  }

  /**
   * Applies pagination to the QueryBuilder.
   *
   * Responsibilities
   * ----------------
   * - Apply page offset.
   * - Apply page size.
   * - Prevent negative offsets.
   * - Enforce repository pagination rules.
   *
   * Notes
   * -----
   * Pagination is intentionally centralized so every query
   * behaves consistently across the repository.
   *
   * @param queryBuilder Configured QueryBuilder.
   * @param filter Repository filter contract.
   * @returns Updated QueryBuilder.
   */
  private applyPagination(
    queryBuilder: SelectQueryBuilder<TaskEntity>,
    filter: TaskFilter,
  ): SelectQueryBuilder<TaskEntity> {
    /**
     * Ensure page and limit are always valid.
     */
    const page = Math.max(filter.page, 1);
    const limit = Math.max(filter.limit, 1);

    /**
     * Calculate offset.
     *
     * Prefer the precomputed skip value supplied by
     * the service layer. Fall back to calculation if
     * it is unavailable.
     */
    const skip = filter.skip >= 0 ? filter.skip : (page - 1) * limit;

    queryBuilder.skip(skip);
    queryBuilder.take(limit);

    return queryBuilder;
  }

  /**
   * Builds a standardized pagination result.
   *
   * Used by repository methods after executing
   * QueryBuilder#getManyAndCount().
   *
   * @param data Current page records.
   * @param total Total matching records.
   * @param filter Repository filter contract.
   * @returns PaginationResult<T>
   */
  private buildPaginationResult<T>(
    data: T[],
    total: number,
    filter: Pick<TaskFilter, 'page' | 'limit'>,
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
   * Finds tasks using filtering, searching,
   * sorting, and pagination.
   *
   * Responsibilities
   * ----------------
   * - Scope results to the authenticated user.
   * - Apply all supported repository filters.
   * - Apply sorting.
   * - Apply pagination.
   * - Execute a single optimized query.
   *
   * Notes
   * -----
   * - Relations (category, tags) are loaded through
   *   createBaseQuery().
   * - This method performs no business logic.
   *
   * @param filter Repository filter contract.
   * @returns Paginated task entities.
   */
  async findAll(filter: TaskFilter): Promise<PaginationResult<TaskEntity>> {
    /**
     * Create the reusable base query.
     */
    const queryBuilder = this.createBaseQuery(filter);

    /**
     * Apply repository filters.
     */
    this.applyFilters(queryBuilder, filter);

    /**
     * Apply repository sorting.
     */
    this.applySorting(queryBuilder, filter);

    /**
     * Apply pagination.
     */
    this.applyPagination(queryBuilder, filter);

    /**
     * Execute the query.
     *
     * TypeORM automatically performs two optimized queries:
     * 1. Fetch paginated records
     * 2. Fetch total matching records
     */
    const [tasks, total] = await queryBuilder.getManyAndCount();

    /**
     * Build the standardized pagination response.
     */
    return this.buildPaginationResult<TaskEntity>(tasks, total, filter);
  }

  /**
   * Finds a task by its identifier.
   *
   * Responsibilities
   * ----------------
   * - Scope the query to the authenticated user.
   * - Return null when the task does not exist.
   * - Load required relations.
   * - Respect soft delete configuration.
   *
   * Notes
   * -----
   * This method does NOT throw exceptions.
   * Services are responsible for deciding whether
   * a missing entity should result in an exception.
   *
   * @param id Task identifier.
   * @param userId Authenticated user identifier.
   * @param includeDeleted Whether to include soft deleted tasks.
   * @returns TaskEntity or null.
   */
  async findById(
    id: string,
    userId: string,
    includeDeleted = false,
  ): Promise<TaskEntity | null> {
    const queryBuilder = this.createBaseQuery({
      userId,
      includeDeleted,
    });

    queryBuilder.andWhere(`${TasksRepository.TABLE_ALIAS}.id = :id`, {
      id,
    });

    return queryBuilder.getOne();
  }

  /**
   * Finds a task by its identifier or throws an exception.
   *
   * Responsibilities
   * ----------------
   * - Retrieve a task scoped to the authenticated user.
   * - Throw when the task cannot be found.
   * - Provide a reusable lookup method for update,
   *   delete, restore, and other write operations.
   *
   * Notes
   * -----
   * This method intentionally delegates the lookup to
   * findById() to avoid duplicating QueryBuilder logic.
   *
   * @param id Task identifier.
   * @param userId Authenticated user identifier.
   * @param includeDeleted Whether soft deleted tasks
   * should be included.
   *
   * @throws NotFoundException
   */
  async findByIdOrFail(
    id: string,
    userId: string,
    includeDeleted = false,
  ): Promise<TaskEntity> {
    const entity = await this.findById(id, userId, includeDeleted);

    if (!entity) {
      throw new NotFoundException(`Task with ID "${id}" was not found.`);
    }

    return entity;
  }

  /**
   * Creates and persists a new task.
   *
   * Responsibilities
   * ----------------
   * - Create a new TaskEntity instance.
   * - Persist the entity.
   * - Return the persisted entity.
   *
   * Notes
   * -----
   * - Business validation must be performed by the service layer.
   * - This method is responsible only for persistence.
   *
   * @param payload Partial task payload.
   * @returns Persisted TaskEntity.
   */
  async createTask(payload: Partial<TaskEntity>): Promise<TaskEntity> {
    const entity = this.repository.create(payload);

    return this.repository.save(entity);
  }

  /**
   * Updates an existing task.
   *
   * Responsibilities
   * ----------------
   * - Merge the updated properties into the existing entity.
   * - Persist the updated entity.
   * - Return the updated entity.
   *
   * Notes
   * -----
   * - Business validation is handled by the service layer.
   * - The entity is assumed to already exist.
   * - This method performs persistence only.
   *
   * @param entity Existing task entity.
   * @param payload Updated task properties.
   * @returns Updated TaskEntity.
   */
  async updateTask(
    entity: TaskEntity,
    payload: Partial<TaskEntity>,
  ): Promise<TaskEntity> {
    this.repository.merge(entity, payload);

    return this.repository.save(entity);
  }

  /**
   * Soft deletes a task.
   *
   * The entity is not permanently removed from the database.
   * Instead, the DeleteDateColumn is populated.
   *
   * @param entity Task entity.
   * @returns Soft deleted task.
   */
  async softDelete(entity: TaskEntity): Promise<TaskEntity> {
    return this.repository.softRemove(entity);
  }

  /**
   * Restores a previously soft deleted task.
   *
   * @param entity Soft deleted task entity.
   * @returns Restored task.
   */
  async restore(entity: TaskEntity): Promise<TaskEntity> {
    return this.repository.recover(entity);
  }

  /**
   * Determines whether a task exists for the
   * authenticated user.
   *
   * @param id Task identifier.
   * @param userId Authenticated user identifier.
   * @returns True when the task exists.
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
   * Returns an aggregated summary of the authenticated
   * user's tasks.
   *
   * Responsibilities
   * ----------------
   * - Calculate task statistics.
   * - Return an internal TaskSummary contract.
   * - Avoid exposing database implementation details.
   *
   * Notes
   * -----
   * This method is intended for internal use by the
   * Service and Analytics modules.
   *
   * @param userId Authenticated user identifier.
   * @returns Aggregated task summary.
   */
  async getSummary(userId: string): Promise<TaskSummary> {
    const qb = this.createBaseQuery({
      userId,
      includeDeleted: false,
    });

    const [
      total,
      completed,
      pending,
      inProgress,
      overdue,
      cancelled,
      highPriority,
      mediumPriority,
      lowPriority,
    ] = await Promise.all([
      qb.clone().getCount(),

      qb
        .clone()
        .andWhere(`${TasksRepository.TABLE_ALIAS}.status = :completedStatus`, {
          completedStatus: TaskStatus.COMPLETED,
        })
        .getCount(),

      qb
        .clone()
        .andWhere(`${TasksRepository.TABLE_ALIAS}.status = :pendingStatus`, {
          pendingStatus: TaskStatus.TODO,
        })
        .getCount(),

      qb
        .clone()
        .andWhere(`${TasksRepository.TABLE_ALIAS}.status = :inProgressStatus`, {
          inProgressStatus: TaskStatus.IN_PROGRESS,
        })
        .getCount(),

      qb
        .clone()
        .andWhere(`${TasksRepository.TABLE_ALIAS}.dueDate IS NOT NULL`)
        .andWhere(`${TasksRepository.TABLE_ALIAS}.dueDate < CURRENT_TIMESTAMP`)
        .andWhere(`${TasksRepository.TABLE_ALIAS}.completedAt IS NULL`)
        .getCount(),

      qb
        .clone()
        .andWhere(`${TasksRepository.TABLE_ALIAS}.status = :cancelledStatus`, {
          cancelledStatus: TaskStatus.CANCELLED,
        })
        .getCount(),

      qb
        .clone()
        .andWhere(`${TasksRepository.TABLE_ALIAS}.priority = :highPriority`, {
          highPriority: TaskPriority.HIGH,
        })
        .getCount(),

      qb
        .clone()
        .andWhere(`${TasksRepository.TABLE_ALIAS}.priority = :mediumPriority`, {
          mediumPriority: TaskPriority.MEDIUM,
        })
        .getCount(),

      qb
        .clone()
        .andWhere(`${TasksRepository.TABLE_ALIAS}.priority = :lowPriority`, {
          lowPriority: TaskPriority.LOW,
        })
        .getCount(),
    ]);

    return {
      total,
      completed,
      pending,
      inProgress,
      overdue,
      cancelled,
      highPriority,
      mediumPriority,
      lowPriority,
      completionRate:
        total === 0 ? 0 : Number(((completed / total) * 100).toFixed(2)),
    };
  }

  /**
   * Counts completed tasks for the authenticated user.
   *
   * Responsibilities
   * ----------------
   * - Return the total number of completed tasks.
   * - Exclude soft deleted records.
   *
   * @param userId Authenticated user identifier.
   * @returns Number of completed tasks.
   */
  async countCompletedTasks(userId: string): Promise<number> {
    return this.createBaseQuery({
      userId,
      includeDeleted: false,
    })
      .andWhere(`${TasksRepository.TABLE_ALIAS}.status = :status`, {
        status: TaskStatus.COMPLETED,
      })
      .getCount();
  }

  /**
   * Counts overdue tasks for the authenticated user.
   *
   * Responsibilities
   * ----------------
   * - Return the number of overdue tasks.
   * - Ignore completed tasks.
   * - Exclude soft deleted records.
   *
   * A task is considered overdue when:
   * - dueDate is not null
   * - dueDate is earlier than the current timestamp
   * - completedAt is null
   *
   * @param userId Authenticated user identifier.
   * @returns Number of overdue tasks.
   */
  async countOverdueTasks(userId: string): Promise<number> {
    return this.createBaseQuery({
      userId,
      includeDeleted: false,
    })
      .andWhere(`${TasksRepository.TABLE_ALIAS}.dueDate IS NOT NULL`)
      .andWhere(`${TasksRepository.TABLE_ALIAS}.dueDate < CURRENT_TIMESTAMP`)
      .andWhere(`${TasksRepository.TABLE_ALIAS}.completedAt IS NULL`)
      .getCount();
  }

  /**
   * Counts pending tasks for the authenticated user.
   *
   * Pending tasks are tasks that have not yet been completed.
   *
   * @param userId Authenticated user identifier.
   * @returns Number of pending tasks.
   */
  async countPendingTasks(userId: string): Promise<number> {
    return this.createBaseQuery({
      userId,
      includeDeleted: false,
    })
      .andWhere(`${TasksRepository.TABLE_ALIAS}.status = :status`, {
        status: TaskStatus.TODO,
      })
      .getCount();
  }

  /**
   * Counts tasks currently in progress.
   *
   * @param userId Authenticated user identifier.
   * @returns Number of tasks in progress.
   */
  async countInProgressTasks(userId: string): Promise<number> {
    return this.createBaseQuery({
      userId,
      includeDeleted: false,
    })
      .andWhere(`${TasksRepository.TABLE_ALIAS}.status = :status`, {
        status: TaskStatus.IN_PROGRESS,
      })
      .getCount();
  }

  /**
   * Checks whether a task already exists with the same
   * title for the authenticated user.
   *
   * Responsibilities
   * ----------------
   * - Prevent duplicate task creation.
   * - Scope the lookup to the authenticated user.
   *
   * @param title Task title.
   * @param userId Authenticated user identifier.
   * @returns True if a matching task exists.
   */
  async existsByTitle(title: string, userId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: {
        title,
        userId,
      },
    });

    return count > 0;
  }

  /**
   * Finds a task created from a specific FastAPI note.
   *
   * Responsibilities
   * ----------------
   * - Support Note → Task conversion.
   * - Prevent duplicate task creation from the same note.
   *
   * @param sourceNoteId FastAPI note identifier.
   * @param userId Authenticated user identifier.
   * @returns Matching TaskEntity or null.
   */
  async findBySourceNoteId(
    sourceNoteId: string,
    userId: string,
  ): Promise<TaskEntity | null> {
    return this.repository.findOne({
      where: {
        sourceNoteId,
        userId,
      },
      relations: {
        category: true,
        tags: true,
      },
    });
  }
}
