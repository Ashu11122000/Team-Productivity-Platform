/**
 * ============================================================================
 * File: category-query.dto.ts
 * ============================================================================
 *
 * Category Query DTO.
 *
 * Responsibilities
 * ----------------
 * - Validate category listing query parameters.
 * - Support pagination.
 * - Support searching.
 * - Support sorting.
 * - Provide Swagger documentation.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - class-validator
 * - class-transformer
 * - Swagger
 * - Node.js 22+
 * ============================================================================
 */

import { Type } from 'class-transformer';

import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Supported sort directions.
 */
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

/**
 * Category listing query parameters.
 */
export class CategoryQueryDto {
  /**
   * Page number.
   */
  @ApiPropertyOptional({
    description: 'Page number.',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  /**
   * Number of records per page.
   *
   * Maximum value prevents excessive
   * database queries.
   */
  @ApiPropertyOptional({
    description: 'Items per page.',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  /**
   * Search term.
   */
  @ApiPropertyOptional({
    description: 'Search categories by name.',
    example: 'Work',
  })
  @IsOptional()
  @IsString()
  search?: string;

  /**
   * Database column used for sorting.
   */
  @ApiPropertyOptional({
    description: 'Field used for sorting.',
    example: 'createdAt',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';

  /**
   * Sort direction.
   */
  @ApiPropertyOptional({
    description: 'Sorting direction.',
    enum: SortOrder,
    default: SortOrder.DESC,
    example: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.DESC;
}
