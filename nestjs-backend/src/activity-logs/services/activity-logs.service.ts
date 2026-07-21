/**
 * ============================================================================
 * File: activity-logs.service.ts
 * ============================================================================
 *
 * Enterprise Activity Logs Service.
 *
 * Responsibilities
 * ----------------
 * - Create activity logs.
 * - Retrieve activity logs.
 * - Validate business rules.
 * - Coordinate repository operations.
 * - Map entities into response DTOs.
 *
 * Notes
 * -----
 * This service intentionally contains business orchestration only.
 * Database operations are delegated to ActivityLogsRepository.
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

import { NotFoundException } from '../../common/exceptions';

import { PaginationResponseDto } from '../../common/dto';

import { ActivityLog } from '../entities/activity-log.entity';

import { ActivityLogQueryDto } from '../dto/activity-log-query.dto';
import { ActivityLogResponseDto } from '../dto/activity-log-response.dto';
import { CreateActivityLogDto } from '../dto/create-activity-log.dto';

import { ActivityLogMapper } from '../mappers/activity-log.mapper';

import { ActivityLogsRepository } from '../repositories/activity-logs.repository';

/**
 * Allowed sortable database columns.
 *
 * Prevents arbitrary database column names from
 * being supplied through query parameters.
 */
const ALLOWED_SORT_FIELDS: ReadonlyArray<keyof ActivityLog> = [
  'action',
  'entityType',
  'createdAt',
];

/**
 * ============================================================================
 * Activity Logs Service
 * ============================================================================
 */
@Injectable()
export class ActivityLogsService {
  /**
   * Application logger.
   */
  private readonly logger = new Logger(ActivityLogsService.name);

  constructor(
    private readonly activityLogsRepository: ActivityLogsRepository,
  ) {}

  /**
   * ==========================================================================
   * Create Activity Log
   * ==========================================================================
   *
   * Creates a new immutable activity log.
   *
   * Activity logs are generated internally by
   * application modules and should never be modified
   * after creation.
   *
   * Steps
   * -----
   * 1. Create entity.
   * 2. Persist entity.
   * 3. Return response DTO.
   *
   * @param createActivityLogDto Activity log payload.
   *
   * @returns Created activity log.
   * ==========================================================================
   */
  async log(
    createActivityLogDto: CreateActivityLogDto,
  ): Promise<ActivityLogResponseDto> {
    this.logger.debug(`Creating activity log: ${createActivityLogDto.action}`);

    const activityLog =
      this.activityLogsRepository.create(createActivityLogDto);

    const savedActivityLog =
      await this.activityLogsRepository.save(activityLog);

    this.logger.log(`Activity log created (${savedActivityLog.id})`);

    return ActivityLogMapper.toResponse(savedActivityLog);
  }

  /**
   * ==========================================================================
   * Get Activity Logs
   * ==========================================================================
   *
   * Returns paginated activity logs belonging to the authenticated user.
   *
   * Supports
   * --------
   * - Pagination
   * - Filtering by action
   * - Filtering by entity type
   * - Sorting
   *
   * @param query Activity log query parameters.
   * @param userId Authenticated user identifier.
   *
   * @returns Paginated activity logs.
   * ==========================================================================
   */
  async findAll(
    query: ActivityLogQueryDto,
    userId: string,
  ): Promise<PaginationResponseDto<ActivityLogResponseDto>> {
    const page = query.page ?? 1;

    const limit = query.limit ?? 10;

    const action = query.action;

    const entityType = query.entityType;

    const sortBy = this.getSortField(query.sortBy);

    const sortOrder = query.sortOrder ?? 'DESC';

    const [activityLogs, total] =
      await this.activityLogsRepository.findAndCount({
        userId,

        page,

        limit,

        action,

        entityType,

        sortBy,

        sortOrder,
      });

    return {
      data: ActivityLogMapper.toResponseList(activityLogs),

      total,

      page,

      limit,

      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * ==========================================================================
   * Get Activity Log
   * ==========================================================================
   *
   * Retrieves a single activity log.
   *
   * @param id Activity log identifier.
   * @param userId Authenticated user identifier.
   *
   * @returns Activity log response.
   *
   * @throws NotFoundException
   * ==========================================================================
   */
  async findOne(id: string, userId: string): Promise<ActivityLogResponseDto> {
    const activityLog = await this.getActivityLogOrFail(id, userId);

    return ActivityLogMapper.toResponse(activityLog);
  }

  /**
   * ==========================================================================
   * Get Activity Log Entity
   * ==========================================================================
   *
   * Internal helper used whenever the entity itself
   * is required instead of the response DTO.
   *
   * @param id Activity log identifier.
   * @param userId Authenticated user identifier.
   *
   * @returns ActivityLog entity.
   *
   * @throws NotFoundException
   * ==========================================================================
   */
  private async getActivityLogOrFail(
    id: string,
    userId: string,
  ): Promise<ActivityLog> {
    const activityLog = await this.activityLogsRepository.findById(id);

    if (!activityLog || activityLog.userId !== userId) {
      throw new NotFoundException('Activity log not found.');
    }

    return activityLog;
  }

  /**
   * ==========================================================================
   * Validate Sort Field
   * ==========================================================================
   *
   * Prevents arbitrary database column names from
   * being supplied through query parameters.
   *
   * @param field Requested sort field.
   *
   * @returns Safe database column.
   * ==========================================================================
   */
  private getSortField(field?: string): keyof ActivityLog {
    if (field && ALLOWED_SORT_FIELDS.includes(field as keyof ActivityLog)) {
      return field as keyof ActivityLog;
    }

    return 'createdAt';
  }
}
