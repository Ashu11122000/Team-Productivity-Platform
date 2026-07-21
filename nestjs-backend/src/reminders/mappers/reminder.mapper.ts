/*
 * ============================================================================
 * File: reminder.mapper.ts
 * ============================================================================
 *
 * Enterprise Reminder Mapper
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Transform ReminderEntity objects into API response DTOs.
 * - Transform repository aggregation interfaces into response DTOs.
 * - Prevent persistence models from leaking outside the service layer.
 * - Keep transformation logic centralized and reusable.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Single Responsibility Principle
 * - Stateless
 * - No business logic
 * - No database access
 * - Pure transformation layer
 *
 * Mapping Flow
 * ----------------------------------------------------------------------------
 *
 * ReminderEntity
 *        │
 *        ▼
 * ReminderMapper
 *        │
 *        ▼
 * ReminderResponseDto
 *
 * ReminderSummary
 *        │
 *        ▼
 * ReminderSummaryDto
 *
 * ReminderStats
 *        │
 *        ▼
 * ReminderStatsDto
 *
 * PaginationResult<ReminderEntity>
 *        │
 *        ▼
 * ReminderPaginationResponseDto
 *
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';

import { ReminderPaginationResponseDto } from '../dto/reminder-pagination-response.dto';
import { ReminderResponseDto } from '../dto/reminder-response.dto';
import { ReminderStatsDto } from '../dto/reminder-stats.dto';
import { ReminderSummaryDto } from '../dto/reminder-summary.dto';

import { ReminderEntity } from '../entities/reminder.entity';

import { PaginationResult } from '../interfaces/pagination-result.interface';
import { ReminderStats } from '../interfaces/reminder-stats.interface';
import { ReminderSummary } from '../interfaces/reminder-summary.interface';

@Injectable()
export class ReminderMapper {
  /**
   * ==========================================================================
   * Converts a ReminderEntity into a ReminderResponseDto.
   * ==========================================================================
   *
   * @param entity Reminder entity from the repository.
   * @returns ReminderResponseDto
   */
  public toResponseDto(entity: ReminderEntity): ReminderResponseDto {
    return {
      id: entity.id,
      userId: entity.userId,

      title: entity.title,
      description: entity.description ?? null,

      type: entity.type,
      status: entity.status,
      repeat: entity.repeat,

      remindAt: entity.remindAt,
      triggeredAt: entity.triggeredAt ?? null,
      completedAt: entity.completedAt ?? null,

      reminderOffsetMinutes: entity.reminderOffsetMinutes,

      sendNotification: entity.sendNotification,
      sendEmail: entity.sendEmail,

      taskId: entity.taskId ?? null,
      notificationId: entity.notificationId ?? null,

      metadata: entity.metadata ?? null,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt ?? null,
    };
  }

  /**
   * ==========================================================================
   * Converts a collection of ReminderEntity objects into
   * ReminderResponseDto objects.
   * ==========================================================================
   *
   * @param entities Reminder entities.
   * @returns Reminder response DTO collection.
   */
  public toResponseDtoList(entities: ReminderEntity[]): ReminderResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }

  /**
   * ==========================================================================
   * Converts repository reminder summary data into a
   * ReminderSummaryDto.
   * ==========================================================================
   *
   * @param summary Repository summary.
   * @returns Reminder summary response DTO.
   */
  public toSummaryDto(summary: ReminderSummary): ReminderSummaryDto {
    return {
      total: summary.total,
      pending: summary.pending,
      completed: summary.completed,
      cancelled: summary.cancelled,
      overdue: summary.overdue,
      today: summary.today,
      upcoming: summary.upcoming,
      recurring: summary.recurring,
      deleted: summary.deleted,
    };
  }

  /**
   * ==========================================================================
   * Converts a paginated repository result into a
   * ReminderPaginationResponseDto.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Transform ReminderEntity objects into ReminderResponseDto objects.
   * - Preserve pagination metadata.
   * - Prevent persistence models from leaving the service layer.
   *
   * @param pagination Paginated repository result.
   * @returns Paginated reminder response DTO.
   */
  public toPaginationResponseDto(
    pagination: PaginationResult<ReminderEntity>,
  ): ReminderPaginationResponseDto {
    return {
      items: this.toResponseDtoList(pagination.items),

      total: pagination.total,

      page: pagination.page,

      limit: pagination.limit,

      totalPages: pagination.totalPages,

      hasNext: pagination.hasNext,

      hasPrevious: pagination.hasPrevious,
    };
  }

  /**
   * ==========================================================================
   * Converts repository reminder statistics into a ReminderStatsDto.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Transform aggregated repository statistics into an API response DTO.
   * - Prevent repository models from leaking outside the service layer.
   * - Keep mapping logic centralized and reusable.
   *
   * @param stats Repository reminder statistics.
   * @returns Reminder statistics response DTO.
   */
  public toStatsDto(stats: ReminderStats): ReminderStatsDto {
    return {
      total: stats.total,

      active: stats.active,

      pending: stats.pending,

      completed: stats.completed,

      cancelled: stats.cancelled,

      overdue: stats.overdue,

      today: stats.today,

      upcoming: stats.upcoming,

      recurring: stats.recurring,

      deleted: stats.deleted,

      completionRate: stats.completionRate,

      averagePerDay: stats.averagePerDay,
    };
  }
}
