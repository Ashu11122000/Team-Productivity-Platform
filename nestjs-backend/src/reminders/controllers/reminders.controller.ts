/*
 * ============================================================================
 * File: reminders.controller.ts
 * ============================================================================
 *
 * Enterprise Reminders Controller
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Expose REST endpoints for reminder management.
 * - Validate incoming request DTOs.
 * - Delegate business logic to RemindersService.
 * - Return response DTOs only.
 * - Never access repositories directly.
 * - Never expose persistence entities.
 *
 * Architecture
 * ----------------------------------------------------------------------------
 *
 * Client
 *    │
 *    ▼
 * Controller
 *    │
 *    ▼
 * Service
 *    │
 *    ▼
 * Repository
 *    │
 *    ▼
 * PostgreSQL
 *
 * Authentication
 * ----------------------------------------------------------------------------
 * FastAPI owns authentication and JWT generation.
 * NestJS validates JWTs using JwtAuthGuard.
 *
 * ============================================================================
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { CreateReminderDto } from '../dto/create-reminder.dto';
import { ReminderPaginationResponseDto } from '../dto/reminder-pagination-response.dto';
import { ReminderQueryDto } from '../dto/reminder-query.dto';
import { ReminderResponseDto } from '../dto/reminder-response.dto';
import { ReminderStatsDto } from '../dto/reminder-stats.dto';
import { ReminderSummaryDto } from '../dto/reminder-summary.dto';
import { UpdateReminderDto } from '../dto/update-reminder.dto';

import { RemindersService } from '../services/reminders.service';

@ApiTags('Reminders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  /**
   * ==========================================================================
   * Creates a reminder.
   * ==========================================================================
   */
  @Post()
  @ApiOperation({
    summary: 'Create reminder',
    description: 'Creates a new reminder for the authenticated user.',
  })
  @ApiCreatedResponse({
    description: 'Reminder created successfully.',
    type: ReminderResponseDto,
  })
  public async create(
    @CurrentUser()
    user: JwtPayload,
    @Body()
    dto: CreateReminderDto,
  ): Promise<ReminderResponseDto> {
    return this.remindersService.create(Number(user.user_id), dto);
  }

  /**
   * ==========================================================================
   * Returns paginated reminders.
   * ==========================================================================
   */
  @Get()
  @ApiOperation({
    summary: 'Get reminders',
    description:
      'Returns a paginated collection of reminders belonging to the authenticated user.',
  })
  @ApiOkResponse({
    description: 'Paginated reminders.',
    type: ReminderPaginationResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @ApiQuery({
    name: 'search',
    required: false,
  })
  @ApiQuery({
    name: 'status',
    required: false,
  })
  @ApiQuery({
    name: 'type',
    required: false,
  })
  @ApiQuery({
    name: 'repeat',
    required: false,
  })
  public async findAll(
    @CurrentUser()
    user: JwtPayload,
    @Query()
    query: ReminderQueryDto,
  ): Promise<ReminderPaginationResponseDto> {
    return this.remindersService.findAll(Number(user.user_id), query);
  }

  /**
   * ==========================================================================
   * Returns a reminder by its identifier.
   * ==========================================================================
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get reminder',
    description: 'Returns a reminder belonging to the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    description: 'Reminder identifier.',
    type: String,
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'Reminder retrieved successfully.',
    type: ReminderResponseDto,
  })
  public async findOne(
    @CurrentUser()
    user: JwtPayload,
    @Param('id')
    id: string,
  ): Promise<ReminderResponseDto> {
    return this.remindersService.findOne(Number(user.user_id), id);
  }

  /**
   * ==========================================================================
   * Updates an existing reminder.
   * ==========================================================================
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update reminder',
    description:
      'Updates an existing reminder owned by the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    description: 'Reminder identifier.',
    type: String,
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'Reminder updated successfully.',
    type: ReminderResponseDto,
  })
  public async update(
    @CurrentUser()
    user: JwtPayload,
    @Param('id')
    id: string,
    @Body()
    dto: UpdateReminderDto,
  ): Promise<ReminderResponseDto> {
    return this.remindersService.update(Number(user.user_id), id, dto);
  }

  /**
   * ==========================================================================
   * Soft deletes a reminder.
   * ==========================================================================
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete reminder',
    description: 'Soft deletes a reminder owned by the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    description: 'Reminder identifier.',
    type: String,
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'Reminder deleted successfully.',
  })
  public async delete(
    @CurrentUser()
    user: JwtPayload,
    @Param('id')
    id: string,
  ): Promise<void> {
    await this.remindersService.delete(Number(user.user_id), id);
  }

  /**
   * ==========================================================================
   * Restores a soft-deleted reminder.
   * ==========================================================================
   */
  @Patch(':id/restore')
  @ApiOperation({
    summary: 'Restore reminder',
    description:
      'Restores a previously soft-deleted reminder belonging to the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    description: 'Reminder identifier.',
    type: String,
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'Reminder restored successfully.',
  })
  public async restore(
    @CurrentUser()
    user: JwtPayload,
    @Param('id')
    id: string,
  ): Promise<void> {
    await this.remindersService.restore(Number(user.user_id), id);
  }

  /**
   * ==========================================================================
   * Returns reminder summary.
   * ==========================================================================
   */
  @Get('summary')
  @ApiOperation({
    summary: 'Reminder summary',
    description:
      'Returns aggregated reminder summary information for the authenticated user.',
  })
  @ApiOkResponse({
    description: 'Reminder summary retrieved successfully.',
    type: ReminderSummaryDto,
  })
  public async getSummary(
    @CurrentUser()
    user: JwtPayload,
  ): Promise<ReminderSummaryDto> {
    return this.remindersService.getSummary(Number(user.user_id));
  }

  /**
   * ==========================================================================
   * Returns reminder statistics.
   * ==========================================================================
   */
  @Get('stats')
  @ApiOperation({
    summary: 'Reminder statistics',
    description:
      'Returns reminder statistics and productivity metrics for the authenticated user.',
  })
  @ApiOkResponse({
    description: 'Reminder statistics retrieved successfully.',
    type: ReminderStatsDto,
  })
  public async getStats(
    @CurrentUser()
    user: JwtPayload,
  ): Promise<ReminderStatsDto> {
    return this.remindersService.getStats(Number(user.user_id));
  }
}
