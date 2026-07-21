/***
 * ============================================================================
 * File: dashboard-query.dto.ts
 * ============================================================================
 *
 * Enterprise Dashboard Query DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Validate dashboard query parameters.
 * - Transform incoming query values into appropriate types.
 * - Provide a single contract between the controller and service layer.
 * - Support dashboard filtering without exposing persistence concerns.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - DTO Pattern
 * - Single Responsibility Principle
 * - Strong Validation
 * - Swagger Compatible
 * - Framework Agnostic Business Logic
 *
 * Compatible With
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - class-validator
 * - class-transformer
 * - @nestjs/swagger
 *
 * Future Enhancements
 * ----------------------------------------------------------------------------
 * TODO:
 * - Add timezone support.
 * - Support custom dashboard widgets.
 * - Add grouping options (daily, weekly, monthly, yearly).
 * ============================================================================
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class DashboardQueryDto {
  @ApiPropertyOptional({
    description: 'Dashboard start date (ISO 8601).',
    example: '2026-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Dashboard end date (ISO 8601).',
    example: '2026-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Category identifier.',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Include only completed tasks.',
    example: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    return value === true || value === 'true';
  })
  @IsBoolean()
  completed?: boolean;

  @ApiPropertyOptional({
    description: 'Include overdue tasks.',
    example: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    return value === true || value === 'true';
  })
  @IsBoolean()
  overdue?: boolean;

  @ApiPropertyOptional({
    description: 'Group productivity trend.',
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: 'monthly',
  })
  @IsOptional()
  @IsIn(['daily', 'weekly', 'monthly', 'yearly'])
  groupBy?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}
