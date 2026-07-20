/**
 * ============================================================================
 * File: pagination-query.dto.ts
 * ============================================================================
 *
 * Enterprise Pagination Query DTO
 *
 * Responsibilities
 * ----------------
 * - Validate pagination query parameters.
 * - Provide default pagination values.
 * - Prevent invalid page and limit values.
 * - Generate Swagger documentation.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - class-validator
 * - class-transformer
 * - @nestjs/swagger
 * - TypeScript 5+
 * * Node.js 22+
 *
 * Example
 * -------
 * GET /tasks?page=1&limit=10
 *
 * Future Improvements
 * -------------------
 * - Add sort field validation.
 * - Add sort direction.
 * - Add search support.
 * - Add filtering support.
 * ============================================================================
 */

import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

import { PAGINATION_CONSTANTS } from '../constants';

/**
 * Standard pagination query DTO.
 */
export class PaginationQueryDto {
  /**
   * Current page number.
   */
  @ApiPropertyOptional({
    description: 'Current page number.',
    example: PAGINATION_CONSTANTS.DEFAULT_PAGE,
    minimum: PAGINATION_CONSTANTS.MIN_PAGE,
    default: PAGINATION_CONSTANTS.DEFAULT_PAGE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(PAGINATION_CONSTANTS.MIN_PAGE)
  page: number = PAGINATION_CONSTANTS.DEFAULT_PAGE;

  /**
   * Number of records per page.
   */
  @ApiPropertyOptional({
    description: 'Maximum number of records returned per page.',
    example: PAGINATION_CONSTANTS.DEFAULT_LIMIT,
    minimum: PAGINATION_CONSTANTS.MIN_LIMIT,
    maximum: PAGINATION_CONSTANTS.MAX_LIMIT,
    default: PAGINATION_CONSTANTS.DEFAULT_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(PAGINATION_CONSTANTS.MIN_LIMIT)
  @Max(PAGINATION_CONSTANTS.MAX_LIMIT)
  limit: number = PAGINATION_CONSTANTS.DEFAULT_LIMIT;
}
