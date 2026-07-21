/**
 * ============================================================================
 * File: activity-log.mapper.ts
 * ============================================================================
 *
 * Enterprise Activity Log Mapper.
 *
 * Responsibilities
 * ----------------
 * - Convert ActivityLog entities into API response DTOs.
 * - Prevent exposing persistence models.
 * - Centralize mapping logic.
 * - Keep controllers and services independent of TypeORM entities.
 *
 * Notes
 * -----
 * All ActivityLog entities should be converted into
 * ActivityLogResponseDto before being returned by services.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * - Node.js 22+
 * ============================================================================
 */

import { ActivityLogResponseDto } from '../dto/activity-log-response.dto';

import { ActivityLog } from '../entities/activity-log.entity';

/**
 * ============================================================================
 * Activity Log Mapper
 * ============================================================================
 *
 * Maps persistence entities into API response DTOs.
 * ============================================================================
 */
export class ActivityLogMapper {
  /**
   * --------------------------------------------------------------------------
   * Map Entity
   * --------------------------------------------------------------------------
   *
   * Converts an ActivityLog entity into an ActivityLogResponseDto.
   *
   * @param activityLog ActivityLog entity.
   *
   * @returns ActivityLogResponseDto.
   * --------------------------------------------------------------------------
   */
  static toResponse(
    this: void,
    activityLog: ActivityLog,
  ): ActivityLogResponseDto {
    return {
      id: activityLog.id,

      action: activityLog.action,

      entityType: activityLog.entityType,

      entityId: activityLog.entityId,

      metadata: activityLog.metadata,

      userId: activityLog.userId,

      createdAt: activityLog.createdAt,
    };
  }

  /**
   * --------------------------------------------------------------------------
   * Map Entity Collection
   * --------------------------------------------------------------------------
   *
   * Converts multiple ActivityLog entities into response DTOs.
   *
   * @param activityLogs Collection of ActivityLog entities.
   *
   * @returns Collection of ActivityLogResponseDto.
   * --------------------------------------------------------------------------
   */
  static toResponseList(activityLogs: ActivityLog[]): ActivityLogResponseDto[] {
    return activityLogs.map((activityLog) =>
      ActivityLogMapper.toResponse(activityLog),
    );
  }
}
