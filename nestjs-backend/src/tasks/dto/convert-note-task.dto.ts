/**
 * ============================================================================
 * File: create-task.dto.ts
 * ============================================================================
 *
 * Data Transfer Object for creating a new task.
 *
 * Responsibilities
 * ----------------
 * - Validate incoming task creation requests.
 * - Define the API contract for task creation.
 * - Provide Swagger documentation.
 * - Prevent invalid or malformed input before reaching the service layer.
 *
 * Notes
 * -----
 * - Authentication is handled by FastAPI.
 * - User information is injected from the validated JWT.
 * - This DTO only validates task-specific data.
 * - Supports manual task creation and Note → Task conversion.
 *
 * Compatible With
 * ---------------
 * - NestJS 11
 * - class-validator
 * - class-transformer
 * - @nestjs/swagger
 * ============================================================================
 */

import { Transform } from 'class-transformer';

import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { TaskPriority } from '../../common/enums/task-priority.enum';
import { TaskStatus } from '../../common/enums/task-status.enum';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Title of the task.',
    example: 'Complete NestJS Phase 5',
    maxLength: 255,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({
    message: 'Task title must be a valid string.',
  })
  @IsNotEmpty({
    message: 'Task title is required.',
  })
  @MinLength(3, {
    message: 'Task title must contain at least 3 characters.',
  })
  @MaxLength(255, {
    message: 'Task title cannot exceed 255 characters.',
  })
  title!: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the task.',
    example: 'Implement the Tasks module using Repository and Mapper patterns.',
    maxLength: 2000,
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({
    message: 'Task description must be a valid string.',
  })
  @MaxLength(2000, {
    message: 'Task description cannot exceed 2000 characters.',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Current status of the task.',
    enum: TaskStatus,
    default: TaskStatus.TODO,
    example: TaskStatus.TODO,
  })
  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'Invalid task status.',
  })
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Priority level of the task.',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
    example: TaskPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TaskPriority, {
    message: 'Invalid task priority.',
  })
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Due date of the task (ISO 8601 format).',
    example: '2026-12-31T18:30:00.000Z',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Due date must be a valid ISO 8601 date.',
    },
  )
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'Category identifier.',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4', {
    message: 'Category ID must be a valid UUID.',
  })
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Associated tag identifiers.',
    type: [String],
    example: [
      '550e8400-e29b-41d4-a716-446655440001',
      '550e8400-e29b-41d4-a716-446655440002',
    ],
  })
  @IsOptional()
  @IsArray({
    message: 'Tag IDs must be an array.',
  })
  @ArrayUnique({
    message: 'Duplicate tag IDs are not allowed.',
  })
  @IsUUID('4', {
    each: true,
    message: 'Each tag ID must be a valid UUID.',
  })
  tagIds?: string[];

  @ApiPropertyOptional({
    description: 'Whether this task was created by converting a FastAPI note.',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({
    message: 'isConvertedFromNote must be a boolean.',
  })
  isConvertedFromNote?: boolean;

  @ApiPropertyOptional({
    description: 'Identifier of the original FastAPI note.',
    example: '550e8400-e29b-41d4-a716-446655440099',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4', {
    message: 'Source note ID must be a valid UUID.',
  })
  sourceNoteId?: string;
}
