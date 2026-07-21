/**
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

/**
 * Minimal DashboardSummaryDto to represent dashboard summary payload.
 * This file defines and exports DashboardSummaryDto to avoid circular imports.
 */
export class DashboardSummaryDto {
  @ApiProperty({
    description: 'Title of the dashboard',
    example: 'Team Overview',
  })
  title!: string;
  @ApiProperty({
    description: 'Short description or summary',
    example: 'Summary of team productivity metrics',
  })
  summary!: string;

  @ApiProperty({
    description: 'Timestamp of the summary',
    example: '2026-01-01T00:00:00Z',
  })
  generatedAt!: string;
}
