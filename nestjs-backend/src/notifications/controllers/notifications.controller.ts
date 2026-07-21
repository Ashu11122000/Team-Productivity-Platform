/*
 * ============================================================================
 * File: notifications.controller.ts
 * ============================================================================
 *
 * Enterprise Notifications Controller
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Exposes notification REST APIs.
 * - Validates incoming requests.
 * - Delegates business logic to NotificationsService.
 * - Returns Response DTOs only.
 *
 * Architecture
 * ----------------------------------------------------------------------------
 *
 * HTTP
 *   │
 *   ▼
 * NotificationsController
 *   │
 *   ▼
 * NotificationsService
 *   │
 *   ▼
 * NotificationsRepository
 *
 * Compatible With
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - Swagger
 * ============================================================================
 */

import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Delete, Param, Patch } from '@nestjs/common';

import { ApiParam } from '@nestjs/swagger';

import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { NotificationsService } from '../services/notifications.service';
import { NotificationSummaryDto } from '../dto/notification-summary.dto';
import { NotificationStatsDto } from '../dto/notification-stats.dto';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { NotificationPaginationResponseDto } from '../dto/notification-pagination-response.dto';
import { NotificationQueryDto } from '../dto/notification-query.dto';
import { NotificationResponseDto } from '../dto/notification-response.dto';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../../common/decorators/current-user.decorator';

import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@ApiTags('Notifications')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * ==========================================================================
   * Create Notification
   * ==========================================================================
   */
  @Post()
  @ApiOperation({
    summary: 'Create notification',
  })
  @ApiResponse({
    status: 201,
    type: NotificationResponseDto,
  })
  public async create(
    @Body()
    dto: CreateNotificationDto,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<NotificationResponseDto> {
    return this.notificationsService.create(dto, user.sub);
  }

  /**
   * ==========================================================================
   * Get Notifications
   * ==========================================================================
   */
  @Get()
  @ApiOperation({
    summary: 'Get notifications',
  })
  @ApiResponse({
    status: 200,
    type: NotificationPaginationResponseDto,
  })
  public async findAll(
    @Query()
    query: NotificationQueryDto,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<NotificationPaginationResponseDto> {
    return this.notificationsService.findAll(query, user.sub);
  }

  /**
   * ==========================================================================
   * Get Notification By Id
   * ==========================================================================
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get notification by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Notification identifier',
  })
  @ApiResponse({
    status: 200,
    type: NotificationResponseDto,
  })
  public async findOne(
    @Param('id')
    id: string,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<NotificationResponseDto> {
    return this.notificationsService.findOne(id, user.sub);
  }

  /**
   * ==========================================================================
   * Update Notification
   * ==========================================================================
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update notification',
  })
  @ApiParam({
    name: 'id',
    description: 'Notification identifier',
  })
  @ApiResponse({
    status: 200,
    type: NotificationResponseDto,
  })
  public async update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateNotificationDto,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<NotificationResponseDto> {
    return this.notificationsService.update(id, dto, user.sub);
  }

  /**
   * ==========================================================================
   * Delete Notification
   * ==========================================================================
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete notification',
  })
  @ApiParam({
    name: 'id',
    description: 'Notification identifier',
  })
  @ApiResponse({
    status: 204,
  })
  public async delete(
    @Param('id')
    id: string,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<void> {
    await this.notificationsService.delete(id, user.sub);
  }

  /**
   * ==========================================================================
   * Restore Notification
   * ==========================================================================
   */
  @Patch(':id/restore')
  @ApiOperation({
    summary: 'Restore notification',
  })
  @ApiParam({
    name: 'id',
    description: 'Notification identifier',
  })
  @ApiResponse({
    status: 200,
  })
  public async restore(
    @Param('id')
    id: string,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<void> {
    await this.notificationsService.restore(id, user.sub);
  }

  /**
   * ==========================================================================
   * Mark Notification As Read
   * ==========================================================================
   */
  @Patch(':id/read')
  @ApiOperation({
    summary: 'Mark notification as read',
  })
  @ApiParam({
    name: 'id',
    description: 'Notification identifier',
  })
  @ApiResponse({
    status: 200,
    type: NotificationResponseDto,
  })
  public async markAsRead(
    @Param('id')
    id: string,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<NotificationResponseDto> {
    return this.notificationsService.markAsRead(id, user.sub);
  }

  /**
   * ==========================================================================
   * Mark All Notifications As Read
   * ==========================================================================
   */
  @Patch('read-all')
  @ApiOperation({
    summary: 'Mark all notifications as read',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        updated: 12,
      },
    },
  })
  public async markAllAsRead(
    @CurrentUser()
    user: JwtPayload,
  ): Promise<{
    updated: number;
  }> {
    return this.notificationsService.markAllAsRead(user.sub);
  }

  /**
   * ==========================================================================
   * Get Notification Summary
   * ==========================================================================
   */
  @Get('summary')
  @ApiOperation({
    summary: 'Get notification summary',
  })
  @ApiResponse({
    status: 200,
    type: NotificationSummaryDto,
  })
  public async getSummary(
    @CurrentUser()
    user: JwtPayload,
  ): Promise<NotificationSummaryDto> {
    return this.notificationsService.getSummary(user.sub);
  }

  /**
   * ==========================================================================
   * Get Notification Statistics
   * ==========================================================================
   */
  @Get('stats')
  @ApiOperation({
    summary: 'Get notification statistics',
  })
  @ApiResponse({
    status: 200,
    type: NotificationStatsDto,
  })
  public async getStats(
    @CurrentUser()
    user: JwtPayload,
  ): Promise<NotificationStatsDto> {
    return this.notificationsService.getStats(user.sub);
  }
}
