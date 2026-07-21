import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';

import { TaskPriority } from '../../common/enums/task-priority.enum';
import { TaskStatus } from '../../common/enums/task-status.enum';

/**
 * ============================================================================
 * File: analytics-query.dto.ts
 * ============================================================================
 *
 * Analytics Query DTO.
 *
 * Used for filtering dashboard statistics.
 *
 * Compatible With
 * ---------------
 * - NestJS 11
 * ============================================================================
 */
export class AnalyticsQueryDto {
  @ApiPropertyOptional({
    description: 'Start date.',
    example: '2026-07-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date.',
    example: '2026-07-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    enum: TaskPriority,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Category identifier.',
  })
  @IsOptional()
  @IsUUID('4')
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Completed tasks only.',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiPropertyOptional({
    description: 'Overdue tasks only.',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  overdue?: boolean;
}
