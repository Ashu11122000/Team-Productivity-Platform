/**
 * ============================================================================
 * File: create-category.dto.ts
 * ============================================================================
 *
 * Create Category DTO.
 *
 * Responsibilities
 * ----------------
 * - Validate category creation requests.
 * - Provide Swagger documentation.
 * - Sanitize incoming input.
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

import { Transform } from 'class-transformer';

import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO used to create a new category.
 */
export class CreateCategoryDto {
  /**
   * Category name.
   */
  @ApiProperty({
    description: 'Unique category name.',
    example: 'Work',
    maxLength: 100,
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  /**
   * Optional category description.
   */
  @ApiPropertyOptional({
    description: 'Optional category description.',
    example: 'Tasks related to work and projects.',
    maxLength: 500,
  })
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  /**
   * Optional category color.
   *
   * Must be a valid hexadecimal color.
   */
  @ApiPropertyOptional({
    description: 'Hexadecimal category color.',
    example: '#3B82F6',
  })
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Color must be a valid hexadecimal value (e.g. #3B82F6).',
  })
  color?: string;
}
