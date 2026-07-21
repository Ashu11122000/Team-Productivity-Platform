/**
 * ============================================================================
 * File: update-category.dto.ts
 * ============================================================================
 *
 * Update Category DTO.
 *
 * Responsibilities
 * ----------------
 * - Define the payload for updating an existing category.
 * - Reuse validation rules from CreateCategoryDto.
 * - Make all properties optional for partial updates.
 * - Preserve Swagger metadata automatically.
 *
 * Notes
 * -----
 * This DTO extends CreateCategoryDto using PartialType(), ensuring
 * that validation rules remain centralized while supporting HTTP PATCH
 * semantics.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Swagger
 * - class-validator
 * - TypeScript 5+
 * ============================================================================
 */

import { PartialType } from '@nestjs/swagger';

import { CreateCategoryDto } from './create-category.dto';

/**
 * DTO used to update an existing category.
 *
 * All fields inherited from CreateCategoryDto become optional.
 */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
