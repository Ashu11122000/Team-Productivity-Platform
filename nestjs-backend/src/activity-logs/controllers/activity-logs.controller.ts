/**
 * ============================================================================
 * File: activity-logs.controller.ts
 * ============================================================================
 *
 * Enterprise Activity Logs Controller.
 *
 * Responsibilities
 * ----------------
 * - Expose REST endpoints for activity logs.
 * - Validate incoming requests.
 * - Authenticate users.
 * - Delegate business logic to ActivityLogsService.
 * - Return standardized response DTOs.
 *
 * Business logic intentionally belongs in the service layer.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Swagger
 * - Node.js 22+
 * ============================================================================
 */

import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../../common/decorators/current-user.decorator';

import { ParseUuidPipe } from '../../common/pipes';

import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

import { ActivityLogQueryDto } from '../dto/activity-log-query.dto';
import { ActivityLogResponseDto } from '../dto/activity-log-response.dto';

import { ActivityLogsService } from '../services/activity-logs.service';

/**
 * ============================================================================
 * Activity Logs Controller
 * ============================================================================
 */
@ApiTags('Activity Logs')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  /**
   * ==========================================================================
   * Get Activity Logs
   * ==========================================================================
   *
   * Returns paginated activity logs belonging
   * to the authenticated user.
   * ==========================================================================
   */
  @Get()
  @ApiOperation({
    summary: 'Get user activity logs',
    description: 'Returns paginated activity logs for the authenticated user.',
  })
  @ApiOkResponse({
    description: 'Activity logs retrieved successfully.',
  })
  async findAll(
    @Query()
    query: ActivityLogQueryDto,

    @CurrentUser()
    user: JwtPayload,
  ) {
    return this.activityLogsService.findAll(query, user.sub);
  }

  /**
   * ==========================================================================
   * Get Activity Log
   * ==========================================================================
   *
   * Returns a single activity log.
   * ==========================================================================
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get activity log by ID',
    description:
      'Returns a single activity log belonging to the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    description: 'Activity log UUID.',
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'Activity log retrieved successfully.',
    type: ActivityLogResponseDto,
  })
  async findOne(
    @Param('id', ParseUuidPipe)
    id: string,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<ActivityLogResponseDto> {
    return this.activityLogsService.findOne(id, user.sub);
  }
}
