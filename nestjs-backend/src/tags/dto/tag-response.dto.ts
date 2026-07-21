import { ApiProperty } from '@nestjs/swagger';

/**
 * ============================================================================
 * File: tag-response.dto.ts
 * ============================================================================
 *
 * Tag Response DTO.
 *
 * Responsibilities
 * ----------------
 * - Represent a tag returned by the API.
 * - Hide persistence-layer implementation details.
 * - Serve as the public response contract.
 *
 * Notes
 * -----
 * - Returned by TagsController.
 * - Never expose entities directly.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Swagger
 * ============================================================================
 */

export class TagResponseDto {
  @ApiProperty({
    description: 'Unique tag identifier.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  readonly id!: string;

  @ApiProperty({
    description: 'Tag name.',
    example: 'Backend',
  })
  readonly name!: string;

  @ApiProperty({
    description: 'Hexadecimal color associated with the tag.',
    example: '#3B82F6',
    nullable: true,
  })
  readonly color!: string | null;

  @ApiProperty({
    description: 'Owner of the tag.',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  readonly userId!: string;

  @ApiProperty({
    description: 'Timestamp when the tag was created.',
    example: '2026-07-21T10:30:00.000Z',
  })
  readonly createdAt!: Date;

  @ApiProperty({
    description: 'Timestamp when the tag was last updated.',
    example: '2026-07-21T11:45:00.000Z',
  })
  readonly updatedAt!: Date;
}
