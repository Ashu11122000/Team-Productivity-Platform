/*
 * ============================================================================
 * File: dashboard-response.dto.ts
 * ============================================================================
 *
 * Enterprise Dashboard Response DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents the complete dashboard response returned by the API.
 * - Aggregates all dashboard sections into a single response object.
 * - Acts as the final response model exposed by DashboardController.
 * - Prevents internal business models from leaking outside the application.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - DTO Pattern
 * - Composition over Inheritance
 * - Single Responsibility Principle (SRP)
 * - Strong Typing
 * - Swagger Compatible
 *
 * Compatible With
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - @nestjs/swagger
 *
 * Future Enhancements
 * ----------------------------------------------------------------------------
 * TODO:
 * - Add dashboard version metadata.
 * - Add generated timestamp.
 * - Add feature flags.
 * - Add user preferences.
 * ============================================================================
 */

import { ApiProperty } from '@nestjs/swagger';

import { DashboardSummaryDto } from './dashboard-summary.dto';

export class DashboardResponseDto {
  @ApiProperty({
    description: 'Complete dashboard summary.',
    type: () => DashboardSummaryDto,
  })
  dashboard!: DashboardSummaryDto;
}
