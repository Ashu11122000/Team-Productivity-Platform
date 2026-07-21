/***
 * ============================================================================
 * File: tag-query.dto.ts
 * ============================================================================
 *
 * Tag Query DTO.
 *
 * Responsibilities
 * ----------------
 * - Validate query parameters for tag listing.
 * - Support pagination, searching and sorting.
 * - Define the public API contract.
 *
 * Notes
 * -----
 * - Used by GET /tags.
 * - Controllers should never perform validation manually.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - class-validator
 * - class-transformer
 * - Swagger
 * ============================================================================
 */

import { Transform, Type } from 'class-transformer';

import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class TagQueryDto {
  @ApiPropertyOptional({
    description: 'Requested page number.',
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'Page must be an integer.',
  })
  @Min(1, {
    message: 'Page must be greater than or equal to 1.',
  })
  page = 1;

  @ApiPropertyOptional({
    description: 'Number of tags per page.',
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'Limit must be an integer.',
  })
  @Min(1, {
    message: 'Limit must be greater than or equal to 1.',
  })
  @Max(100, {
    message: 'Limit cannot exceed 100.',
  })
  limit = 10;

  @ApiPropertyOptional({
    description: 'Search by tag name.',
    example: 'backend',
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({
    message: 'Search must be a valid string.',
  })
  search?: string;

  @ApiPropertyOptional({
    description: 'Sort field.',
    enum: ['name', 'color', 'createdAt', 'updatedAt'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsIn(['name', 'color', 'createdAt', 'updatedAt'], {
    message: 'Invalid sort field.',
  })
  sortBy = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort direction.',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'], {
    message: 'Sort order must be ASC or DESC.',
  })
  sortOrder: 'ASC' | 'DESC' = 'DESC';
}
