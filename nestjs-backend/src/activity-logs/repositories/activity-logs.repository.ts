/**
 * ============================================================================
 * File: activity-logs.repository.ts
 * ============================================================================
 *
 * Enterprise Activity Logs Repository.
 *
 * Responsibilities
 * ----------------
 * - Encapsulate all database operations for activity logs.
 * - Hide TypeORM implementation details from the service layer.
 * - Provide reusable query methods.
 * - Centralize persistence logic.
 *
 * Notes
 * -----
 * This repository contains persistence logic only.
 * Business rules belong in ActivityLogsService.
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

import { FindOptionsWhere, Repository } from 'typeorm';

import { ActivityLog } from '../entities/activity-log.entity';

import { ActivityAction } from '../../common/enums/activity-action.enum';
import { ActivityEntityType } from '../../common/enums/activity-entity-type.enum';

/**
 * ============================================================================
 * Activity Logs Repository
 * ============================================================================
 */
@Injectable()
export class ActivityLogsRepository {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly repository: Repository<ActivityLog>,
  ) {}

  /**
   * Creates a new ActivityLog entity instance.
   */
  create(payload: Partial<ActivityLog>): ActivityLog {
    return this.repository.create(payload);
  }

  /**
   * Persists an activity log.
   */
  async save(activityLog: ActivityLog): Promise<ActivityLog> {
    return this.repository.save(activityLog);
  }

  /**
   * Finds an activity log by identifier.
   */
  async findById(id: string): Promise<ActivityLog | null> {
    return this.repository.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * Returns paginated activity logs.
   */
  async findAndCount(options: {
    userId: string;
    page: number;
    limit: number;
    action?: ActivityAction;
    entityType?: ActivityEntityType;
    sortBy: keyof ActivityLog;
    sortOrder: 'ASC' | 'DESC';
  }): Promise<[ActivityLog[], number]> {
    const { userId, page, limit, action, entityType, sortBy, sortOrder } =
      options;

    const where: FindOptionsWhere<ActivityLog> = {
      userId,
    };

    if (action) {
      where.action = action;
    }

    if (entityType) {
      where.entityType = entityType;
    }

    return this.repository.findAndCount({
      where,

      order: {
        [sortBy]: sortOrder,
      },

      skip: (page - 1) * limit,

      take: limit,
    });
  }

  /**
   * Returns all activity logs
   * belonging to a specific entity.
   */
  async findByEntity(
    entityType: ActivityEntityType,
    entityId: string,
  ): Promise<ActivityLog[]> {
    return this.repository.find({
      where: {
        entityType,
        entityId,
      },

      order: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * Returns recent activity logs
   * for a specific user.
   */
  async findRecentByUser(userId: string, limit = 10): Promise<ActivityLog[]> {
    return this.repository.find({
      where: {
        userId,
      },

      order: {
        createdAt: 'DESC',
      },

      take: limit,
    });
  }

  /**
   * Counts activity logs
   * for a user.
   */
  async countByUser(userId: string): Promise<number> {
    return this.repository.count({
      where: {
        userId,
      },
    });
  }

  /**
   * Deletes an activity log.
   *
   * Mainly intended for
   * testing or administrative
   * maintenance.
   */
  async remove(activityLog: ActivityLog): Promise<ActivityLog> {
    return this.repository.remove(activityLog);
  }
}
