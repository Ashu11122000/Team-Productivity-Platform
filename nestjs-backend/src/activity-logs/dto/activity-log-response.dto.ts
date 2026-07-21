/**
 * ============================================================================
 * File: activity-log-response.dto.ts
 * ============================================================================
 *
 * Activity Log Response DTO.
 *
 * Responsibilities
 * ----------------
 * - Define the standardized API response for activity logs.
 * - Provide Swagger documentation.
 * - Decouple API responses from the persistence entity.
 *
 * Notes
 * -----
 * This DTO should be returned by controllers instead of exposing
 * TypeORM entities directly.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Swagger
 * - TypeScript 5+
 * ============================================================================
 */

import { ApiProperty } from '@nestjs/swagger';

import { ActivityAction, ActivityEntityType } from '../../common/enums';

/**
 * Activity Log response model.
 */
export class ActivityLogResponseDto {
  /**
   * Activity log identifier.
   */
  @ApiProperty({
    description: 'Unique activity log identifier.',
    example: '550e8400-e29b-41d4-a716-446655440010',
  })
  readonly id!: string;

  /**
   * Performed action.
   */
  @ApiProperty({
    description: 'Action performed by the user.',
    enum: ActivityAction,
    example: ActivityAction.TASK_CREATED,
  })
  readonly action!: ActivityAction;

  /**
   * Target entity type.
   */
  @ApiProperty({
    description: 'Entity type affected by the action.',
    enum: ActivityEntityType,
    example: ActivityEntityType.TASK,
  })
  readonly entityType!: ActivityEntityType;

  /**
   * Target entity identifier.
   */
  @ApiProperty({
    description: 'Identifier of the affected entity.',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  readonly entityId!: string;

  /**
   * Additional contextual information.
   */
  @ApiProperty({
    description: 'Additional metadata associated with the activity.',
    nullable: true,
    required: false,
    example: {
      title: 'Complete NestJS Phase 8',
      priority: 'HIGH',
    },
  })
  readonly metadata?: Record<string, unknown> | null;

  /**
   * User identifier.
   */
  @ApiProperty({
    description: 'Identifier of the user who performed the action.',
    example: 'c76b12ab-7d98-45b2-aaf2-18c32a3151d4',
  })
  readonly userId!: string;

  /**
   * Activity creation timestamp.
   */
  @ApiProperty({
    description: 'Timestamp when the activity occurred.',
    example: '2026-07-21T10:15:30.000Z',
  })
  readonly createdAt!: Date;
}
