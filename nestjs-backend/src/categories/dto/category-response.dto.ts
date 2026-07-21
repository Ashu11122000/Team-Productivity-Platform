/**
 * ============================================================================
 * File: category-response.dto.ts
 * ============================================================================
 *
 * Category Response DTO.
 *
 * Responsibilities
 * ----------------
 * - Define the standardized API response for category resources.
 * - Provide Swagger documentation.
 * - Decouple API responses from the persistence entity.
 *
 * Notes
 * -----
 * This DTO should be returned by controllers instead of exposing
 * TypeORM entities directly. This allows the API contract to remain
 * stable even if the underlying entity changes.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Swagger
 * - TypeScript 5+
 * ============================================================================
 */

import { ApiProperty } from '@nestjs/swagger';

/**
 * Category response model.
 */
export class CategoryResponseDto {
  /**
   * Category identifier.
   */
  @ApiProperty({
    description: 'Unique category identifier.',
    example: 'f4d3d5b7-2b42-4b4d-9cb4-45a1c62e0b1a',
  })
  readonly id!: string;

  /**
   * Category name.
   */
  @ApiProperty({
    description: 'Category name.',
    example: 'Work',
  })
  readonly name!: string;

  /**
   * Category description.
   */
  @ApiProperty({
    description: 'Optional category description.',
    example: 'Tasks related to work.',
    nullable: true,
    required: false,
  })
  readonly description?: string | null;

  /**
   * Display color.
   */
  @ApiProperty({
    description: 'Optional category color.',
    example: '#3B82F6',
    nullable: true,
    required: false,
  })
  readonly color?: string | null;

  /**
   * Owner identifier.
   */
  @ApiProperty({
    description: 'Identifier of the category owner.',
    example: '2b40d70d-9b80-42d3-8e7b-0a2a85c0f521',
  })
  readonly userId!: string;

  /**
   * Creation timestamp.
   */
  @ApiProperty({
    description: 'Category creation timestamp.',
    example: '2026-07-21T10:30:00.000Z',
  })
  readonly createdAt!: Date;

  /**
   * Last update timestamp.
   */
  @ApiProperty({
    description: 'Category last update timestamp.',
    example: '2026-07-21T12:45:00.000Z',
  })
  readonly updatedAt!: Date;
}
