/**
 * ============================================================================
 * File: tags.service.ts
 * ============================================================================
 *
 * Enterprise Tags Service.
 *
 * Responsibilities
 * ----------------
 * - Coordinate tag business operations.
 * - Validate business rules.
 * - Delegate persistence operations to TagsRepository.
 * - Convert entities into response DTOs using TagMapper.
 * - Generate activity logs for important operations.
 *
 * Notes
 * -----
 * - Business logic belongs here.
 * - Database operations belong to TagsRepository.
 * - Controllers must never receive entities directly.
 *
 * Architecture
 * ------------
 * Controller
 *      │
 *      ▼
 * TagsService
 *      │
 *      ├── TagsRepository
 *      │
 *      ├── TagMapper
 *      │
 *      └── ActivityLogsService
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM 0.3+
 * - PostgreSQL
 * - Node.js 22+
 * ============================================================================
 */

import { Injectable, Logger } from '@nestjs/common';

import { TagsRepository } from '../repositories/tags.repository';

import { TagMapper } from '../mappers/tag.mapper';

import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { TagQueryDto } from '../dto/tag-query.dto';
import { TagResponseDto } from '../dto/tag-response.dto';

import { TagEntity } from '../entities/tag.entity';

import { ActivityLogsService } from '../../activity-logs/services/activity-logs.service';

import { ActivityAction, ActivityEntityType } from '../../common/enums';

/**
 * ============================================================================
 * Tags Service
 * ============================================================================
 */
@Injectable()
export class TagsService {
  /**
   * Application logger.
   */
  private readonly logger = new Logger(TagsService.name);

  constructor(
    private readonly tagsRepository: TagsRepository,

    private readonly tagMapper: TagMapper,

    private readonly activityLogsService: ActivityLogsService,
  ) {}

  /**
   * ==========================================================================
   * Create Tag
   * ==========================================================================
   *
   * Creates a new tag for the authenticated user.
   *
   * Business Rules
   * --------------
   * - Tag names must be unique per user.
   * - Entity persistence is delegated to repository.
   * - Response must always be mapped DTO.
   *
   * Steps
   * -----
   * 1. Check duplicate tag name.
   * 2. Create entity.
   * 3. Persist entity.
   * 4. Create activity log.
   * 5. Return response DTO.
   *
   * @param createTagDto Tag creation payload.
   * @param userId Authenticated user identifier.
   *
   * @returns Created tag response.
   * ==========================================================================
   */
  async create(
    createTagDto: CreateTagDto,
    userId: string,
  ): Promise<TagResponseDto> {
    this.logger.debug(`Creating tag for user ${userId}`);

    const exists = await this.tagsRepository.existsByName(
      createTagDto.name,
      userId,
    );

    if (exists) {
      throw new Error(`Tag "${createTagDto.name}" already exists.`);
    }

    const tag = await this.tagsRepository.createTag({
      ...createTagDto,

      userId,
    });

    await this.activityLogsService.log({
      action: ActivityAction.TAG_CREATED,

      entityType: ActivityEntityType.TAG,

      entityId: tag.id,

      metadata: {
        name: tag.name,

        color: tag.color,
      },

      userId,
    });

    this.logger.log(`Tag created successfully (${tag.id})`);

    return this.tagMapper.toResponseDto(tag);
  }

  /**
   * ==========================================================================
   * Find All Tags
   * ==========================================================================
   *
   * Returns paginated tags belonging to the authenticated user.
   *
   * Business Rules
   * --------------
   * - Query normalization happens here.
   * - Repository handles filtering, sorting, and pagination.
   * - Entities are converted into response DTOs.
   *
   * Steps
   * -----
   * 1. Build repository filter.
   * 2. Fetch paginated entities.
   * 3. Map entities to DTOs.
   *
   * @param query Tag query parameters.
   * @param userId Authenticated user identifier.
   *
   * @returns Paginated tag response.
   * ==========================================================================
   */
  async findAll(
    query: TagQueryDto,
    userId: string,
  ): Promise<{
    data: TagResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    const page = query.page ?? 1;

    const limit = query.limit ?? 10;

    const filter = {
      userId,

      page,

      limit,

      skip: (page - 1) * limit,

      search: query.search,

      sortBy: query.sortBy ?? 'createdAt',

      sortOrder: query.sortOrder ?? 'DESC',

      includeDeleted: false,
    };

    const result = await this.tagsRepository.findAll(filter);

    return {
      data: this.tagMapper.toResponseDtoList(result.data),

      total: result.total,

      page: result.page,

      limit: result.limit,

      totalPages: result.totalPages,

      hasNextPage: result.hasNextPage,

      hasPreviousPage: result.hasPreviousPage,
    };
  }

  /**
   * ==========================================================================
   * Find One Tag
   * ==========================================================================
   *
   * Retrieves a single tag by identifier.
   *
   * Steps
   * -----
   * 1. Retrieve entity from repository.
   * 2. Map entity into response DTO.
   *
   * @param id Tag identifier.
   * @param userId Authenticated user identifier.
   *
   * @returns Tag response DTO.
   * ==========================================================================
   */
  async findOne(id: string, userId: string): Promise<TagResponseDto> {
    const tag = await this.tagsRepository.findByIdOrFail(id, userId);

    return this.tagMapper.toResponseDto(tag);
  }

  /**
   * ==========================================================================
   * Update Tag
   * ==========================================================================
   *
   * Updates an existing tag.
   *
   * Business Rules
   * --------------
   * - Validate tag ownership.
   * - Prevent duplicate names.
   * - Persist changes through repository.
   * - Generate activity log.
   *
   * @param id Tag identifier.
   * @param updateTagDto Update payload.
   * @param userId Authenticated user identifier.
   *
   * @returns Updated tag response DTO.
   * ==========================================================================
   */
  async update(
    id: string,
    updateTagDto: UpdateTagDto,
    userId: string,
  ): Promise<TagResponseDto> {
    const tag = await this.tagsRepository.findByIdOrFail(id, userId);

    const previousName = tag.name;

    const previousColor = tag.color;

    if (updateTagDto.name && updateTagDto.name !== tag.name) {
      const exists = await this.tagsRepository.existsByName(
        updateTagDto.name,
        userId,
      );

      if (exists) {
        throw new Error(`Tag "${updateTagDto.name}" already exists.`);
      }
    }

    const updatedTag = await this.tagsRepository.updateTag(tag, updateTagDto);

    await this.activityLogsService.log({
      action: ActivityAction.TAG_UPDATED,

      entityType: ActivityEntityType.TAG,

      entityId: updatedTag.id,

      metadata: {
        oldName: previousName,

        newName: updatedTag.name,

        oldColor: previousColor,

        newColor: updatedTag.color,
      },

      userId,
    });

    return this.tagMapper.toResponseDto(updatedTag);
  }

  /**
   * ==========================================================================
   * Delete Tag
   * ==========================================================================
   *
   * Soft deletes a tag.
   *
   * Business Rules
   * --------------
   * - Validate tag ownership.
   * - Create activity log.
   * - Preserve record using soft delete.
   *
   * @param id Tag identifier.
   * @param userId Authenticated user identifier.
   *
   * @returns Promise<void>
   * ==========================================================================
   */
  async remove(id: string, userId: string): Promise<void> {
    const tag = await this.tagsRepository.findByIdOrFail(id, userId);

    await this.activityLogsService.log({
      action: ActivityAction.TAG_DELETED,

      entityType: ActivityEntityType.TAG,

      entityId: tag.id,

      metadata: {
        name: tag.name,

        color: tag.color,
      },

      userId,
    });

    await this.tagsRepository.softDelete(tag);

    this.logger.log(`Tag soft deleted successfully (${tag.id})`);
  }

  /**
   * ==========================================================================
   * Restore Tag
   * ==========================================================================
   *
   * Restores a previously soft deleted tag.
   *
   * Business Rules
   * --------------
   * - Retrieve deleted entity.
   * - Restore through repository.
   * - Generate activity log.
   *
   * @param id Tag identifier.
   * @param userId Authenticated user identifier.
   *
   * @returns Restored tag response DTO.
   * ==========================================================================
   */
  async restore(id: string, userId: string): Promise<TagResponseDto> {
    const tag = await this.tagsRepository.findByIdOrFail(id, userId, true);

    const restoredTag = await this.tagsRepository.restore(tag);

    await this.activityLogsService.log({
      action: 'TAG_RESTORED' as ActivityAction,

      entityType: ActivityEntityType.TAG,

      entityId: restoredTag.id,

      metadata: {
        name: restoredTag.name,
      },

      userId,
    });

    return this.tagMapper.toResponseDto(restoredTag);
  }

  /**
   * ==========================================================================
   * Get Tag Summary
   * ==========================================================================
   *
   * Returns aggregated tag statistics.
   *
   * @param userId Authenticated user identifier.
   *
   * @returns Tag summary.
   * ==========================================================================
   */
  async getSummary(userId: string) {
    return this.tagsRepository.getSummary(userId);
  }

  /**
   * ==========================================================================
   * Check Tag Exists
   * ==========================================================================
   *
   * Checks whether a tag exists for a user.
   *
   * @param id Tag identifier.
   * @param userId Authenticated user identifier.
   *
   * @returns Boolean result.
   * ==========================================================================
   */
  async exists(id: string, userId: string): Promise<boolean> {
    return this.tagsRepository.exists(id, userId);
  }

  /**
   * ==========================================================================
   * Validate Tag Ownership
   * ==========================================================================
   *
   * Internal helper used to verify that a tag belongs
   * to the authenticated user.
   *
   * This method intentionally returns the entity because
   * update, delete, and restore operations require the
   * persistence object.
   *
   * @param id Tag identifier.
   * @param userId Authenticated user identifier.
   * @param includeDeleted Whether deleted tags should be included.
   *
   * @returns TagEntity.
   * ==========================================================================
   */
  private async getTagOrFail(
    id: string,
    userId: string,
    includeDeleted = false,
  ): Promise<TagEntity> {
    return this.tagsRepository.findByIdOrFail(id, userId, includeDeleted);
  }

  /**
   * ==========================================================================
   * Count Active Tags
   * ==========================================================================
   *
   * Returns number of active tags.
   *
   * @param userId Authenticated user identifier.
   *
   * @returns Active tag count.
   * ==========================================================================
   */
  async countActiveTags(userId: string): Promise<number> {
    return this.tagsRepository.countActiveTags(userId);
  }

  /**
   * ==========================================================================
   * Count Deleted Tags
   * ==========================================================================
   *
   * Returns number of soft deleted tags.
   *
   * @param userId Authenticated user identifier.
   *
   * @returns Deleted tag count.
   * ==========================================================================
   */
  async countDeletedTags(userId: string): Promise<number> {
    return this.tagsRepository.countDeletedTags(userId);
  }

  /**
   * ==========================================================================
   * Count Used Tags
   * ==========================================================================
   *
   * Returns number of tags assigned to tasks.
   *
   * @param userId Authenticated user identifier.
   *
   * @returns Used tag count.
   * ==========================================================================
   */
  async countUsedTags(userId: string): Promise<number> {
    return this.tagsRepository.countUsedTags(userId);
  }

  /**
   * ==========================================================================
   * Count Unused Tags
   * ==========================================================================
   *
   * Returns number of tags without task assignments.
   *
   * @param userId Authenticated user identifier.
   *
   * @returns Unused tag count.
   * ==========================================================================
   */
  async countUnusedTags(userId: string): Promise<number> {
    return this.tagsRepository.countUnusedTags(userId);
  }
}
