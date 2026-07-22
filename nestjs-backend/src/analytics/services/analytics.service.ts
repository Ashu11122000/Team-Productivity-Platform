/**
 * ============================================================================
 * File: analytics.service.ts
 * ============================================================================
 *
 * Enterprise Analytics Service.
 *
 * Responsibilities
 * ----------------
 * - Coordinate analytics business operations.
 * - Delegate database aggregation to AnalyticsRepository.
 * - Convert internal analytics contracts into response DTOs.
 * - Keep controllers free from business logic.
 *
 * Architecture
 * ------------
 *
 * Controller
 *      |
 *      ▼
 * AnalyticsService
 *      |
 *      ├── AnalyticsRepository
 *      |
 *      └── AnalyticsMapper
 *
 * Rules
 * -----
 * - No direct TypeORM access.
 * - No QueryBuilder logic.
 * - No entity leakage.
 * - No HTTP concerns.
 *
 * Authentication
 * --------------
 * - FastAPI owns authentication.
 * - NestJS validates JWT.
 * - userId comes from JWT payload.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM 0.3+
 * - TypeScript 5+
 * ============================================================================
 */

import { Injectable, Logger } from '@nestjs/common';

import { AnalyticsRepository } from '../repositories/analytics.repository';
import { AnalyticsMapper } from '../mappers/analytics.mapper';

import { AnalyticsOverviewDto } from '../dto/analytics-overview.dto';

import { AnalyticsFilter } from '../interfaces/analytics-filter.interface';
import { AnalyticsOverview } from '../interfaces/analytics-overview.interface';
import { TaskSummary } from '../interfaces/task-summary.interface';

/**
 * ============================================================================
 * Analytics Service
 * ============================================================================
 */
@Injectable()
export class AnalyticsService {
  /**
   * Application logger.
   */
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    private readonly analyticsRepository: AnalyticsRepository,
    private readonly analyticsMapper: AnalyticsMapper,
  ) {}

  /**
   * ==========================================================================
   * Get Analytics Overview
   * ==========================================================================
   *
   * Returns high-level analytics information.
   *
   * @param userId Authenticated user identifier.
   * @param filter Analytics filter.
   *
   * @returns Analytics overview DTO.
   * ==========================================================================
   */
  async getOverview(
    userId: string,
    filter: AnalyticsFilter,
  ): Promise<AnalyticsOverviewDto> {
    this.logger.debug(`Generating analytics overview for ${userId}`);

    const overview: AnalyticsOverview =
      await this.analyticsRepository.getOverview(userId, filter);

    return this.analyticsMapper.toOverviewDto(overview);
  }

  /**
   * ==========================================================================
   * Get Task Summary
   * ==========================================================================
   *
   * Returns task lifecycle statistics.
   *
   * @param userId Authenticated user identifier.
   * @param filter Analytics filter.
   *
   * @returns Task summary DTO.
   * ==========================================================================
   */
  async getTaskSummary(userId: string, filter: AnalyticsFilter) {
    this.logger.debug(`Generating task summary analytics for ${userId}`);

    const summary: TaskSummary = await this.analyticsRepository.getTaskSummary(
      userId,
      filter,
    );

    return this.analyticsMapper.toTaskSummaryDto(summary);
  }

  /**
   * ==========================================================================
   * Get Productivity Statistics
   * ==========================================================================
   *
   * Returns productivity metrics.
   *
   * @param userId Authenticated user identifier.
   * @param filter Analytics filter.
   *
   * @returns Productivity statistics DTO.
   * ==========================================================================
   */
  async getProductivity(userId: string, filter: AnalyticsFilter) {
    this.logger.debug(`Generating productivity analytics for ${userId}`);

    const productivity = await this.analyticsRepository.getProductivityStats(
      userId,
      filter,
    );

    return this.analyticsMapper.toProductivityDto(productivity);
  }

  /**
   * ==========================================================================
   * Get Task Status Statistics
   * ==========================================================================
   *
   * Returns task distribution grouped by status.
   *
   * @param userId Authenticated user identifier.
   * @param filter Analytics filter.
   *
   * @returns Task status statistics DTO.
   * ==========================================================================
   */
  async getTaskStatusStats(userId: string, filter: AnalyticsFilter) {
    this.logger.debug(`Generating task status analytics for ${userId}`);

    const statusStats = await this.analyticsRepository.getTaskStatusStats(
      userId,
      filter,
    );

    return this.analyticsMapper.toTaskStatusStatsDto(statusStats);
  }

  /**
   * ==========================================================================
   * Get Task Priority Statistics
   * ==========================================================================
   *
   * Returns task distribution grouped by priority.
   *
   * @param userId Authenticated user identifier.
   * @param filter Analytics filter.
   *
   * @returns Task priority statistics DTO.
   * ==========================================================================
   */
  async getTaskPriorityStats(userId: string, filter: AnalyticsFilter) {
    this.logger.debug(`Generating task priority analytics for ${userId}`);

    const priorityStats = await this.analyticsRepository.getTaskPriorityStats(
      userId,
      filter,
    );

    return this.analyticsMapper.toTaskPriorityStatsDto(priorityStats);
  }

  /**
   * ==========================================================================
   * Get Productivity Trend
   * ==========================================================================
   *
   * Returns productivity trend data.
   *
   * @param userId Authenticated user identifier.
   * @param filter Analytics filter.
   *
   * @returns Productivity trend DTO.
   * ==========================================================================
   */
  async getProductivityTrend(userId: string, filter: AnalyticsFilter) {
    this.logger.debug(`Generating productivity trend analytics for ${userId}`);

    const trend = await this.analyticsRepository.getProductivityTrend(
      userId,
      filter,
    );

    return this.analyticsMapper.toProductivityTrendDto(trend);
  }
}
