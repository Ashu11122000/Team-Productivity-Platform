import { Injectable } from '@nestjs/common';

import { DashboardResponseDto } from '../dto/dashboard-response.dto';

import { AnalyticsSummary } from '../interfaces/analytics-summary.interface';

/**
 * ============================================================================
 * File: analytics.mapper.ts
 * ============================================================================
 *
 * Enterprise Analytics Mapper.
 *
 * Responsibilities
 * ----------------
 * - Convert internal analytics models into response DTOs.
 * - Hide internal repository contracts from the API layer.
 * - Centralize response transformation logic.
 *
 * Notes
 * -----
 * - Contains NO business logic.
 * - Contains NO database queries.
 * - Contains NO calculations.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * ============================================================================
 */

@Injectable()
export class AnalyticsMapper {
  /**
   * ==========================================================================
   * Dashboard Response
   * ==========================================================================
   *
   * Converts an internal AnalyticsSummary into the dashboard response DTO.
   *
   * @param summary Internal analytics summary.
   * @returns Dashboard response DTO.
   */
  toDashboardResponse(summary: AnalyticsSummary): DashboardResponseDto {
    return {
      overview: summary.overview,

      productivity: summary.productivity,

      summary: summary.summary,

      taskStatusStats: summary.taskStatusStats,

      taskPriorityStats: summary.taskPriorityStats,

      productivityTrend: summary.productivityTrend,

      generatedAt: summary.generatedAt,
    };
  }
}
