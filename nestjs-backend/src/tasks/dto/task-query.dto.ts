/**
 * ============================================================================
 * File: task-query.dto.ts
 * ============================================================================
 *
 * Data Transfer Object for querying tasks.
 *
 * Responsibilities
 * ----------------
 * - Validate pagination parameters.
 * - Validate filtering options.
 * - Validate sorting options.
 * - Support searching tasks.
 * - Define the public API contract for listing tasks.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - class-validator
 * - class-transformer
 * - @nestjs/swagger
 * ============================================================================
 */

import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { TaskPriority } from '../../common/enums/task-priority.enum';
import { TaskStatus } from '../../common/enums/task-status.enum';

/**
 * Sorting direction.
 *
 * Consider moving this into:
 * common/enums/sort-order.enum.ts
 */
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class TaskQueryDto {
  @ApiPropertyOptional({
    description: 'Page number.',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'Page must be an integer.',
  })
  @Min(1, {
    message: 'Page must be greater than or equal to 1.',
  })
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of records per page.',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'Limit must be an integer.',
  })
  @Min(1, {
    message: 'Limit must be at least 1.',
  })
  @Max(100, {
    message: 'Limit cannot exceed 100.',
  })
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Filter tasks by status.',
    enum: TaskStatus,
  })
  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'Invalid task status.',
  })
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Filter tasks by priority.',
    enum: TaskPriority,
  })
  @IsOptional()
  @IsEnum(TaskPriority, {
    message: 'Invalid task priority.',
  })
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Search tasks by title.',
    example: 'nestjs',
    maxLength: 255,
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({
    message: 'Search term must be a string.',
  })
  @MaxLength(255, {
    message: 'Search term cannot exceed 255 characters.',
  })
  search?: string;

  @ApiPropertyOptional({
    description: 'Column used for sorting.',
    example: 'createdAt',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString({
    message: 'Sort field must be a string.',
  })
  sortBy: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sorting direction.',
    enum: SortOrder,
    default: SortOrder.DESC,
    example: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder, {
    message: 'Sort order must be ASC or DESC.',
  })
  sortOrder: SortOrder = SortOrder.DESC;
}
