/**
 * ============================================================================
 * File: activity-log-query.dto.ts
 * ============================================================================
 *
 * Activity Log Query DTO.
 *
 * Responsibilities
 * ----------------
 * - Validate activity log query parameters.
 * - Support pagination.
 * - Support filtering.
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

import { ActivityAction, ActivityEntityType } from '../../common/enums';

/**
 * Supported sorting directions.
 */
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

/**
 * Query parameters for retrieving activity logs.
 */
export class ActivityLogQueryDto {
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
   */
  @ApiPropertyOptional({
    description: 'Number of records returned per page.',
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
   * Filter by activity action.
   */
  @ApiPropertyOptional({
    description: 'Filter by activity action.',
    enum: ActivityAction,
    example: ActivityAction.TASK_CREATED,
  })
  @IsOptional()
  @IsEnum(ActivityAction)
  action?: ActivityAction;

  /**
   * Filter by entity type.
   */
  @ApiPropertyOptional({
    description: 'Filter by entity type.',
    enum: ActivityEntityType,
    example: ActivityEntityType.TASK,
  })
  @IsOptional()
  @IsEnum(ActivityEntityType)
  entityType?: ActivityEntityType;

  /**
   * Field used for sorting.
   *
   * Validation of allowed fields should be handled
   * by the service layer.
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
   * Sorting direction.
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
