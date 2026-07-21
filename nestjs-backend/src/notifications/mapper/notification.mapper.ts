/*
 * ============================================================================
 * File: notification.mapper.ts
 * ============================================================================
 *
 * Enterprise Notification Mapper
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Converts NotificationEntity into Response DTOs.
 * - Converts internal interfaces into Response DTOs.
 * - Prevents persistence models from leaking outside the application.
 * - Keeps mapping logic centralized.
 *
 * Architecture
 * ----------------------------------------------------------------------------
 *
 * Controller
 *      │
 *      ▼
 * NotificationService
 *      │
 *      ▼
 * NotificationMapper
 *      │
 *      ▼
 * Response DTOs
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Mapper Pattern
 * - Single Responsibility Principle (SRP)
 * - Stateless
 * - Strong Typing
 * - Clean Architecture
 *
 * Compatible With
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - TypeScript 5+
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';

import { NotificationEntity } from '../entities/notification.entity';

import { NotificationResponseDto } from '../dto/notification-response.dto';
import { NotificationSummaryDto } from '../dto/notification-summary.dto';
import { NotificationSummary } from '../interfaces/notification-summary.interface';
import { NotificationPaginationResponseDto } from '../dto/notification-pagination-response.dto';
import { NotificationStatsDto } from '../dto/notification-stats.dto';

import { NotificationStats } from '../interfaces/notification-stats.interface';
import { PaginationResult } from '../interfaces/pagination-result.interface';

@Injectable()
export class NotificationMapper {
  /**
   * ==========================================================================
   * Maps NotificationEntity to NotificationResponseDto.
   *
   * @param entity Notification entity.
   *
   * @returns Notification response DTO.
   * ==========================================================================
   */
  public toResponseDto(entity: NotificationEntity): NotificationResponseDto {
    const dto = new NotificationResponseDto();

    dto.id = entity.id;

    dto.title = entity.title;

    dto.message = entity.message;

    dto.type = entity.type;

    dto.status = entity.status;

    dto.userId = entity.userId;

    dto.createdAt = entity.createdAt;

    dto.updatedAt = entity.updatedAt;

    return dto;
  }

  /**
   * ==========================================================================
   * Maps NotificationEntity collection to NotificationResponseDto collection.
   *
   * @param entities Notification entities.
   *
   * @returns Notification response DTO collection.
   * ==========================================================================
   */
  public toResponseDtoList(
    entities: NotificationEntity[],
  ): NotificationResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }

  /**
   * ==========================================================================
   * Maps NotificationSummary interface to NotificationSummaryDto.
   *
   * @param summary Notification summary.
   *
   * @returns Notification summary DTO.
   * ==========================================================================
   */
  public toSummaryDto(summary: NotificationSummary): NotificationSummaryDto {
    const dto = new NotificationSummaryDto();

    dto.total = summary.total;

    dto.unread = summary.unread;

    dto.read = summary.read;

    return dto;
  }

  /**
   * ==========================================================================
   * Maps paginated NotificationEntity results to
   * NotificationPaginationResponseDto.
   *
   * @param pagination Paginated notification result.
   *
   * @returns Paginated notification response DTO.
   * ==========================================================================
   */
  public toPaginationResponseDto(
    pagination: PaginationResult<NotificationEntity>,
  ): NotificationPaginationResponseDto {
    const dto = new NotificationPaginationResponseDto();

    dto.items = this.toResponseDtoList(pagination.items);

    dto.total = pagination.total;

    dto.page = pagination.page;

    dto.limit = pagination.limit;

    dto.totalPages = pagination.totalPages;

    dto.hasNextPage = pagination.hasNextPage;

    dto.hasPreviousPage = pagination.hasPreviousPage;

    return dto;
  }

  /**
   * ==========================================================================
   * Maps NotificationStats to NotificationStatsDto.
   *
   * @param stats Notification statistics.
   *
   * @returns Notification statistics DTO.
   * ==========================================================================
   */
  public toStatsDto(stats: NotificationStats): NotificationStatsDto {
    const dto = new NotificationStatsDto();

    dto.total = stats.total;

    dto.unread = stats.unread;

    dto.read = stats.read;

    dto.deleted = stats.deleted;

    dto.byType = stats.byType.map((item) => ({
      type: item.type,
      count: item.count,
    }));

    return dto;
  }
}
