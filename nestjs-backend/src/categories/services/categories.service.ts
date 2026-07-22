/**
 * ============================================================================
 * File: categories.service.ts
 * ============================================================================
 *
 * Enterprise Categories Service.
 *
 * Responsibilities
 * ----------------
 * - Coordinate category business operations.
 * - Delegate persistence to CategoriesRepository.
 * - Validate business rules.
 * - Record activity logs.
 * - Create user notifications.
 * - Map entities to API response DTOs.
 *
 * Notes
 * -----
 * This service intentionally contains business orchestration only.
 * Database operations are delegated to CategoriesRepository.
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

import { ConflictException, NotFoundException } from '../../common/exceptions';

import { PaginationResponseDto } from '../../common/dto';

import {
  ActivityAction,
  ActivityEntityType,
  NotificationType,
} from '../../common/enums';

import { ActivityLogsService } from '../../activity-logs/services/activity-logs.service';
import { NotificationsService } from '../../notifications/services/notifications.service';

import { CategoryMapper } from '../mappers/category.mapper';

import { CategoriesRepository } from '../repositories/categories.repository';

import { Category } from '../entities/category.entity';

import { CategoryResponseDto } from '../dto/category-response.dto';
import { CategoryQueryDto } from '../dto/category-query.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

/**
 * Allowed sortable database columns.
 *
 * Prevents arbitrary SQL column names from being supplied
 * through query parameters.
 */
const ALLOWED_SORT_FIELDS: ReadonlyArray<keyof Category> = [
  'name',
  'createdAt',
  'updatedAt',
];

/**
 * ============================================================================
 * Categories Service
 * ============================================================================
 */
@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,

    private readonly activityLogsService: ActivityLogsService,

    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * ==========================================================================
   * Create Category
   * ==========================================================================
   *
   * Creates a new category belonging to the authenticated user.
   *
   * Steps
   * -----
   * 1. Validate duplicate category.
   * 2. Create entity.
   * 3. Persist entity.
   * 4. Record activity.
   * 5. Return response DTO.
   *
   * @param createCategoryDto Category payload.
   * @param userId Authenticated user identifier.
   *
   * @returns Created category response.
   *
   * @throws ConflictException
   * When another category already exists with the same name.
   * ==========================================================================
   */
  async create(
    createCategoryDto: CreateCategoryDto,
    userId: string,
  ): Promise<CategoryResponseDto> {
    /**
     * Prevent duplicate category names
     * for the same user.
     */
    const alreadyExists = await this.categoriesRepository.existsByName(
      createCategoryDto.name,
      userId,
    );

    if (alreadyExists) {
      throw new ConflictException(
        `Category "${createCategoryDto.name}" already exists.`,
      );
    }

    /**
     * Create entity.
     */
    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      userId,
    });

    /**
     * Persist entity.
     */
    const savedCategory = await this.categoriesRepository.save(category);

    /**
     * Record activity log.
     */
    await this.activityLogsService.log({
      action: ActivityAction.CATEGORY_CREATED,

      entityType: ActivityEntityType.CATEGORY,

      entityId: savedCategory.id,

      metadata: {
        name: savedCategory.name,

        color: savedCategory.color,
      },

      userId,
    });

    /**
     * Optional notification.
     *
     * Can later be moved to an
     * asynchronous domain event.
     */
    await this.notificationsService.create(
      {
        title: 'Category Created',
        message: `Category "${savedCategory.name}" was created successfully.`,
        type: NotificationType.CATEGORY_UPDATED,
      },
      userId,
    );

    /**
     * Return DTO instead of entity.
     */
    return CategoryMapper.toResponse(savedCategory);
  }

  /**
   * ==========================================================================
   * Get Categories
   * ==========================================================================
   *
   * Returns paginated categories belonging to the authenticated user.
   *
   * Supports
   * --------
   * - Pagination
   * - Searching
   * - Sorting
   *
   * @param query Category query parameters.
   * @param userId Authenticated user identifier.
   *
   * @returns Paginated category response.
   * ==========================================================================
   */
  async findAll(
    query: CategoryQueryDto,
    userId: string,
  ): Promise<PaginationResponseDto<CategoryResponseDto>> {
    const page = query.page ?? 1;

    const limit = query.limit ?? 10;

    const search = query.search;

    /**
     * ------------------------------------------------------------------------
     * Prevent arbitrary database column sorting.
     * ------------------------------------------------------------------------
     */
    const sortBy = ALLOWED_SORT_FIELDS.includes(query.sortBy as keyof Category)
      ? (query.sortBy as keyof Category)
      : 'createdAt';

    const sortOrder = query.sortOrder ?? 'DESC';

    const [categories, total] = await this.categoriesRepository.findAndCount({
      userId,
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    });

    return {
      data: CategoryMapper.toResponseList(categories),

      total,

      page,

      limit,

      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * ==========================================================================
   * Get Category
   * ==========================================================================
   *
   * Retrieves a single category belonging to the authenticated user.
   *
   * @param id Category identifier.
   * @param userId Authenticated user identifier.
   *
   * @returns Category response.
   *
   * @throws NotFoundException
   * When the category does not exist.
   * ==========================================================================
   */
  async findOne(id: string, userId: string): Promise<CategoryResponseDto> {
    const category = await this.getCategoryOrFail(id, userId);

    return CategoryMapper.toResponse(category);
  }

  /**
   * ==========================================================================
   * Get Category Entity
   * ==========================================================================
   *
   * Internal helper used by update() and remove().
   *
   * Unlike findOne(), this method returns the entity instead of
   * the response DTO.
   *
   * @param id Category identifier.
   * @param userId Authenticated user identifier.
   *
   * @returns Category entity.
   *
   * @throws NotFoundException
   * When category cannot be found.
   * ==========================================================================
   */
  private async getCategoryOrFail(
    id: string,
    userId: string,
  ): Promise<Category> {
    const category = await this.categoriesRepository.findById(id, userId);

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    return category;
  }

  /**
   * ==========================================================================
   * Validate Sort Field
   * ==========================================================================
   *
   * Ensures only approved database columns
   * can be used for sorting.
   *
   * @param field Requested sort field.
   *
   * @returns Safe database column.
   * ==========================================================================
   */
  private getSortField(field?: string): keyof Category {
    if (field && ALLOWED_SORT_FIELDS.includes(field as keyof Category)) {
      return field as keyof Category;
    }

    return 'createdAt';
  }

  /**
   * ==========================================================================
   * Update Category
   * ==========================================================================
   *
   * Updates an existing category belonging to the authenticated user.
   *
   * @param id Category identifier.
   * @param updateCategoryDto Updated category payload.
   * @param userId Authenticated user identifier.
   *
   * @returns Updated category response.
   *
   * @throws NotFoundException
   * @throws ConflictException
   * ==========================================================================
   */
  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId: string,
  ): Promise<CategoryResponseDto> {
    const category = await this.getCategoryOrFail(id, userId);

    /**
     * Prevent duplicate category names.
     */
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const alreadyExists = await this.categoriesRepository.existsByName(
        updateCategoryDto.name,
        userId,
      );

      if (alreadyExists) {
        throw new ConflictException(
          `Category "${updateCategoryDto.name}" already exists.`,
        );
      }
    }

    /**
     * Preserve previous values for auditing.
     */
    const previousState = {
      name: category.name,
      description: category.description,
      color: category.color,
    };

    Object.assign(category, updateCategoryDto);

    const updatedCategory = await this.categoriesRepository.save(category);

    /**
     * Activity Log
     */
    await this.activityLogsService.log({
      action: ActivityAction.CATEGORY_UPDATED,

      entityType: ActivityEntityType.CATEGORY,

      entityId: updatedCategory.id,

      metadata: {
        before: previousState,

        after: {
          name: updatedCategory.name,
          description: updatedCategory.description,
          color: updatedCategory.color,
        },
      },

      userId,
    });

    /**
     * Notification
     */
    await this.notificationsService.create(
      {
        title: 'Category Updated',
        message: `Category "${updatedCategory.name}" was updated successfully.`,
        type: NotificationType.CATEGORY_UPDATED,
      },
      userId,
    );

    return CategoryMapper.toResponse(updatedCategory);
  }

  /**
   * ==========================================================================
   * Delete Category
   * ==========================================================================
   *
   * Deletes a category belonging to the authenticated user.
   *
   * @param id Category identifier.
   * @param userId Authenticated user identifier.
   *
   * @returns Void.
   *
   * @throws NotFoundException
   * ==========================================================================
   */
  async remove(id: string, userId: string): Promise<void> {
    const category = await this.getCategoryOrFail(id, userId);

    /**
     * Activity Log
     */
    await this.activityLogsService.log({
      action: ActivityAction.CATEGORY_DELETED,

      entityType: ActivityEntityType.CATEGORY,

      entityId: category.id,

      metadata: {
        name: category.name,

        description: category.description,

        color: category.color,
      },

      userId,
    });

    /**
     * Notification
     */
    await this.notificationsService.create(
      {
        title: 'Category Deleted',
        message: `Category "${category.name}" was deleted.`,
        type: NotificationType.CATEGORY_UPDATED,
      },
      userId,
    );

    await this.categoriesRepository.remove(category);
  }
}
