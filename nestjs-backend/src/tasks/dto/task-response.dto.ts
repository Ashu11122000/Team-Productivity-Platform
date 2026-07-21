/**
 * ============================================================================
 * File: task-response.dto.ts
 * ============================================================================
 *
 * Response DTO returned by the Tasks API.
 *
 * Responsibilities
 * ----------------
 * - Define the public API response contract.
 * - Hide internal database entities.
 * - Be populated exclusively by TaskMapper.
 * - Remain independent from TypeORM entities.
 *
 * Notes
 * -----
 * Never expose entities directly from controllers.
 * Controllers should always return mapped DTOs.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Swagger
 * ============================================================================
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { TaskPriority } from '../../common/enums/task-priority.enum';
import { TaskStatus } from '../../common/enums/task-status.enum';

/**
 * Temporary lightweight tag representation.
 *
 * Replace with TagResponseDto once the Tags module
 * is fully refactored.
 */
export class TaskTagDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  id!: string;

  @ApiProperty({
    example: 'Backend',
  })
  name!: string;
}

/**
 * Temporary lightweight category representation.
 *
 * Replace with CategoryResponseDto after the
 * Categories module response DTO is shared.
 */
export class TaskCategoryDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    example: 'Development',
  })
  name!: string;
}

export class TaskResponseDto {
  @ApiProperty({
    description: 'Unique task identifier.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'Task title.',
    example: 'Complete NestJS Phase 5',
  })
  title!: string;

  @ApiPropertyOptional({
    description: 'Task description.',
    nullable: true,
    example: 'Implement repository pattern for Tasks module.',
  })
  description?: string | null;

  @ApiProperty({
    enum: TaskStatus,
    description: 'Current task status.',
  })
  status!: TaskStatus;

  @ApiProperty({
    enum: TaskPriority,
    description: 'Current task priority.',
  })
  priority!: TaskPriority;

  @ApiPropertyOptional({
    description: 'Task due date.',
    nullable: true,
    type: String,
    format: 'date-time',
  })
  dueDate?: Date | null;

  @ApiProperty({
    description: 'Owner of the task.',
    example: '550e8400-e29b-41d4-a716-446655440099',
  })
  userId!: string;

  @ApiProperty({
    description: 'Whether this task originated from a note.',
    example: false,
  })
  isConvertedFromNote!: boolean;

  @ApiPropertyOptional({
    description: 'Source note identifier.',
    nullable: true,
    example: '550e8400-e29b-41d4-a716-446655440123',
  })
  sourceNoteId?: string | null;

  @ApiPropertyOptional({
    description: 'Associated category.',
    type: () => TaskCategoryDto,
    nullable: true,
  })
  category?: TaskCategoryDto | null;

  @ApiPropertyOptional({
    description: 'Associated tags.',
    type: () => [TaskTagDto],
  })
  tags?: TaskTagDto[];

  @ApiProperty({
    description: 'Task creation timestamp.',
    type: String,
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last update timestamp.',
    type: String,
    format: 'date-time',
  })
  updatedAt!: Date;
}
