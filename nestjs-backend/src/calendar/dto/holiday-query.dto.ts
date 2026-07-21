/*
 * ============================================================================
 * File: holiday-query.dto.ts
 * ============================================================================
 *
 * Enterprise Holiday Query DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Defines query parameters for retrieving holidays.
 * - Validates incoming HTTP query parameters.
 * - Supports filtering by country, year, month, and date range.
 * - Provides a stable API contract for holiday providers.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - DTO only
 * - Validation-first
 * - Swagger documented
 * - No business logic
 * - Future extensible
 *
 * Notes
 * ----------------------------------------------------------------------------
 * This DTO is consumed by CalendarController and transformed into internal
 * provider filters by CalendarService.
 * ============================================================================
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class HolidayQueryDto {
  @ApiPropertyOptional({
    description: 'Country ISO 3166-1 alpha-2 code.',
    example: 'IN',
    default: 'IN',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toUpperCase())
  country: string = 'IN';

  @ApiPropertyOptional({
    description: 'Holiday year.',
    example: 2026,
    default: new Date().getFullYear(),
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number = new Date().getFullYear();

  @ApiPropertyOptional({
    description: 'Filter holidays by month.',
    example: 8,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @ApiPropertyOptional({
    description: 'Holiday type.',
    example: 'PUBLIC',
    enum: ['PUBLIC', 'OPTIONAL', 'BANK', 'SCHOOL', 'OBSERVANCE'],
  })
  @IsOptional()
  @IsIn(['PUBLIC', 'OPTIONAL', 'BANK', 'SCHOOL', 'OBSERVANCE'])
  type?: string;

  @ApiPropertyOptional({
    description: 'Start date for filtering.',
    example: '2026-01-01',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fromDate?: Date;

  @ApiPropertyOptional({
    description: 'End date for filtering.',
    example: '2026-12-31',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  toDate?: Date;
}
