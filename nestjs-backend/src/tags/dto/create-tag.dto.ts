/***
 * ============================================================================
 * File: create-tag.dto.ts
 * ============================================================================
 *
 * Data Transfer Object for creating a new tag.
 *
 * Responsibilities
 * ----------------
 * - Validate incoming tag creation requests.
 * - Define the API contract for tag creation.
 * - Provide Swagger documentation.
 * - Prevent invalid input from reaching the service layer.
 *
 * Notes
 * -----
 * - Authentication is handled by FastAPI.
 * - User information is extracted from the validated JWT.
 * - Tag names must be unique per authenticated user.
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
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    description: 'Tag name.',
    example: 'Backend',
    maxLength: 100,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({
    message: 'Tag name must be a valid string.',
  })
  @IsNotEmpty({
    message: 'Tag name is required.',
  })
  @MinLength(2, {
    message: 'Tag name must contain at least 2 characters.',
  })
  @MaxLength(100, {
    message: 'Tag name cannot exceed 100 characters.',
  })
  name!: string;

  @ApiPropertyOptional({
    description: 'Tag color in hexadecimal format.',
    example: '#3B82F6',
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsHexColor({
    message: 'Tag color must be a valid hexadecimal color.',
  })
  color?: string;
}
