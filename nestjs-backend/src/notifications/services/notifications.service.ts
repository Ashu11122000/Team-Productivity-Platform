/**
 * ============================================================================
 * File: notifications.service.ts
 * ============================================================================
 *
 * Enterprise Notifications Service
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Implements notification business logic.
 * - Coordinates repository and mapper layers.
 * - Never accesses TypeORM directly.
 * - Never returns entities.
 * - Returns Response DTOs only.
 *
 * Architecture
 * ----------------------------------------------------------------------------
 *
 * Controller
 *      │
 *      ▼
 * NotificationsService
 *      │
 *      ▼
 * NotificationsRepository
 *      │
 *      ▼
 * NotificationMapper
 *      │
 *      ▼
 * Response DTOs
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Clean Architecture
 * - SOLID
 * - Single Responsibility Principle
 * - Separation of Concerns
 *
 * Compatible With
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - TypeORM 0.3+
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';

import { NotificationEntity } from '../entities/notification.entity';
import { NotificationMapper } from '../mapper/notification.mapper';

import { NotificationsRepository } from '../repositories/notifications.repository';
import { NotificationStatsDto } from '../dto/notification-stats.dto';
// Local inline DTO type used to avoid import error when the DTO file is missing
type CreateNotificationDto = {
  title: string;
  message: string;
  type: string;
  entityId?: string | null;
  entityType?: string | null;
};
import { NotificationPaginationResponseDto } from '../dto/notification-pagination-response.dto';
import { NotificationQueryDto } from '../dto/notification-query.dto';
import { NotificationResponseDto } from '../dto/notification-response.dto';

import { NotificationFilter } from '../interfaces/notification-filter.interface';

import { NotificationStatus } from '../../common/enums/notification-status.enum';

import { NotFoundException } from '../../common/exceptions/not-found.exception';
import { NotificationSummaryDto } from '../dto/notification-summary.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,

    private readonly notificationMapper: NotificationMapper,
  ) {}

  /**
   * ==========================================================================
   * Create Notification
   * ==========================================================================
   */
  public async create(
    dto: CreateNotificationDto,
    userId: string,
  ): Promise<NotificationResponseDto> {
    const notification = new NotificationEntity();

    notification.title = dto.title;

    notification.message = dto.message;

    notification.type = dto.type as any;

    notification.userId = userId;

    notification.status = NotificationStatus.UNREAD;

    notification.readAt = null;

    notification.entityId = dto.entityId ?? null;

    notification.entityType = dto.entityType ?? null;

    const saved = await this.notificationsRepository.save(notification);

    return this.notificationMapper.toResponseDto(saved);
  }

  /**
   * ==========================================================================
   * Get Notifications
   * ==========================================================================
   */
  public async findAll(
    query: NotificationQueryDto,
    userId: string,
  ): Promise<NotificationPaginationResponseDto> {
    const filter: NotificationFilter = {
      userId,

      page: query.page,

      limit: query.limit,

      status: query.status,

      type: query.type,

      sortBy: query.sortBy,

      sortOrder: query.sortOrder,
    };

    const result = await this.notificationsRepository.findAll(filter);

    return this.notificationMapper.toPaginationResponseDto(result);
  }

  /**
   * ==========================================================================
   * Get Notification By Id
   * ==========================================================================
   *
   * Retrieves a single notification belonging to the authenticated user.
   *
   * @param id Notification identifier.
   * @param userId Authenticated user identifier.
   *
   * @returns Notification response DTO.
   * ==========================================================================
   */
  public async findOne(
    id: string,
    userId: string,
  ): Promise<NotificationResponseDto> {
    const notification = await this.findEntityOrThrow(id, userId);

    return this.notificationMapper.toResponseDto(notification);
  }

  /**
   * ==========================================================================
   * Update Notification
   * ==========================================================================
   *
   * Updates an existing notification.
   *
   * @param id Notification identifier.
   * @param dto Update DTO.
   * @param userId Authenticated user identifier.
   *
   * @returns Updated notification.
   * ==========================================================================
   */
  public async update(
    id: string,
    dto: UpdateNotificationDto,
    userId: string,
  ): Promise<NotificationResponseDto> {
    const notification = await this.findEntityOrThrow(id, userId);

    if (dto.title !== undefined) {
      notification.title = dto.title;
    }

    if (dto.message !== undefined) {
      notification.message = dto.message;
    }

    if (dto.type !== undefined) {
      notification.type = dto.type;
    }

    if (dto.entityId !== undefined) {
      notification.entityId = dto.entityId;
    }

    if (dto.entityType !== undefined) {
      notification.entityType = dto.entityType;
    }

    if (dto.isRead !== undefined) {
      notification.status = dto.isRead
        ? NotificationStatus.READ
        : NotificationStatus.UNREAD;

      notification.readAt = dto.isRead ? new Date() : null;
    }

    const updated = await this.notificationsRepository.save(notification);

    return this.notificationMapper.toResponseDto(updated);
  }

  /**
   * ==========================================================================
   * Delete Notification
   * ==========================================================================
   *
   * Soft deletes a notification.
   *
   * @param id Notification identifier.
   * @param userId Authenticated user identifier.
   * ==========================================================================
   */
  public async delete(id: string, userId: string): Promise<void> {
    const deleted = await this.notificationsRepository.softDelete(id, userId);

    if (!deleted) {
      throw new NotFoundException(undefined, 'Notification not found.');
    }
  }

  /**
   * ==========================================================================
   * Restore Notification
   * ==========================================================================
   *
   * Restores a soft deleted notification.
   *
   * @param id Notification identifier.
   * @param userId Authenticated user identifier.
   * ==========================================================================
   */
  public async restore(id: string, userId: string): Promise<void> {
    const restored = await this.notificationsRepository.restore(id, userId);

    if (!restored) {
      throw new NotFoundException(undefined, 'Notification not found.');
    }
  }

  /**
   * ==========================================================================
   * Mark Notification As Read
   * ==========================================================================
   *
   * Marks a notification as read.
   *
   * @param id Notification identifier.
   * @param userId Authenticated user identifier.
   *
   * @returns Updated notification.
   * ==========================================================================
   */
  public async markAsRead(
    id: string,
    userId: string,
  ): Promise<NotificationResponseDto> {
    const notification = await this.findEntityOrThrow(id, userId);

    if (notification.status === NotificationStatus.UNREAD) {
      notification.status = NotificationStatus.READ;

      notification.readAt = new Date();

      await this.notificationsRepository.save(notification);
    }

    return this.notificationMapper.toResponseDto(notification);
  }

  /**
   * ==========================================================================
   * Mark All Notifications As Read
   * ==========================================================================
   *
   * Marks all unread notifications for the authenticated user as read.
   *
   * @param userId Authenticated user identifier.
   *
   * @returns Number of updated notifications.
   * ==========================================================================
   */
  public async markAllAsRead(userId: string): Promise<{
    updated: number;
  }> {
    const result = await this.notificationsRepository.findAll({
      userId,
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
      status: NotificationStatus.UNREAD,
    });

    let updated = 0;

    for (const notification of result.items) {
      notification.status = NotificationStatus.READ;

      notification.readAt = new Date();

      await this.notificationsRepository.save(notification);

      updated++;
    }

    return {
      updated,
    };
  }

  /**
   * ==========================================================================
   * Get Notification Summary
   * ==========================================================================
   *
   * Returns notification summary for the authenticated user.
   *
   * @param userId Authenticated user identifier.
   *
   * @returns Notification summary DTO.
   * ==========================================================================
   */
  public async getSummary(userId: string): Promise<NotificationSummaryDto> {
    const summary = await this.notificationsRepository.getSummary(userId);

    return this.notificationMapper.toSummaryDto(summary);
  }

  /**
   * ==========================================================================
   * Get Notification Statistics
   * ==========================================================================
   *
   * Returns notification statistics.
   *
   * @param userId Authenticated user identifier.
   *
   * @returns Notification statistics DTO.
   * ==========================================================================
   */
  public async getStats(userId: string): Promise<NotificationStatsDto> {
    const stats = await this.notificationsRepository.getStats(userId);

    return this.notificationMapper.toStatsDto(stats);
  }

  /**
   * ==========================================================================
   * Creates an internal notification filter.
   * ==========================================================================
   *
   * Converts NotificationQueryDto into the internal NotificationFilter
   * consumed by the repository layer.
   *
   * @param query Notification query DTO.
   * @param userId Authenticated user identifier.
   *
   * @returns Notification filter.
   * ==========================================================================
   */
  private createFilter(
    query: NotificationQueryDto,
    userId: string,
  ): NotificationFilter {
    return {
      userId,

      page: query.page,

      limit: query.limit,

      status: query.status,

      type: query.type,

      sortBy: query.sortBy,

      sortOrder: query.sortOrder,

      startDate: (query as any).startDate
        ? new Date((query as any).startDate)
        : undefined,

      endDate: (query as any).endDate
        ? new Date((query as any).endDate)
        : undefined,
    };
  }

  /**
   * ==========================================================================
   * Finds a notification or throws NotFoundException.
   * ==========================================================================
   *
   * @param id Notification identifier.
   * @param userId Authenticated user identifier.
   *
   * @returns Notification entity.
   * ==========================================================================
   */
  private async findEntityOrThrow(
    id: string,
    userId: string,
  ): Promise<NotificationEntity> {
    const notification = await this.notificationsRepository.findById(
      id,
      userId,
    );

    if (!notification) {
      throw new NotFoundException(undefined, 'Notification not found.');
    }

    return notification;
  }
}
