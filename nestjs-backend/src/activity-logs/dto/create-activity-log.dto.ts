/**
 * ============================================================================
 * File: create-activity-log.dto.ts
 * ============================================================================
 *
 * Create Activity Log DTO.
 *
 * Responsibilities
 * ----------------
 * - Validate activity log creation requests.
 * - Define the internal payload used to create activity logs.
 * - Provide Swagger documentation.
 *
 * Notes
 * -----
 * This DTO is primarily used internally by ActivityLogsService.
 * Activity logs are created automatically by business modules
 * (Tasks, Categories, Tags, Notifications, etc.) rather than
 * directly by API consumers.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - class-validator
 * - Swagger
 * - TypeScript 5+
 * ============================================================================
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
  IsString,
  MaxLength,
} from 'class-validator';

import { ActivityAction, ActivityEntityType } from '../../common/enums';

// Use a structural type for metadata to avoid importing a problematic/ambiguous
// type that can become an 'error' and widen unions to 'any'.
type ActivityLogMetadataShape = Record<string, unknown>;

/**
 * DTO used to create an activity log.
 */
export class CreateActivityLogDto {
  /**
   * Activity action.
   */
  @ApiProperty({
    description: 'Action performed by the user.',
    enum: ActivityAction,
    example: ActivityAction.TASK_CREATED,
  })
  @IsEnum(ActivityAction)
  action!: ActivityAction;

  /**
   * Entity type.
   */
  @ApiProperty({
    description: 'Entity affected by the action.',
    enum: ActivityEntityType,
    example: ActivityEntityType.TASK,
  })
  @IsEnum(ActivityEntityType)
  entityType!: ActivityEntityType;

  /**
   * Entity identifier.
   */
  @ApiProperty({
    description: 'Identifier of the affected entity.',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  entityId!: string;

  /**
   * Additional activity metadata.
   */
  @ApiPropertyOptional({
    description: 'Additional contextual information.',
    example: {
      title: 'Complete NestJS Phase 8',
      priority: 'HIGH',
    },
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  // Use a structural type instead of a possibly-ambiguous imported type.
  metadata?: ActivityLogMetadataShape | null;

  /**
   * User identifier.
   *
   * This is the owner/user extracted from the validated JWT.
   */
  @ApiProperty({
    description: 'Authenticated user identifier.',
    example: 'c76b12ab-7d98-45b2-aaf2-18c32a3151d4',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  userId!: string;
}
