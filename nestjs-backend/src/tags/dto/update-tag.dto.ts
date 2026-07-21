/**
 * ============================================================================
 * File: update-tag.dto.ts
 * ============================================================================
 *
 * Data Transfer Object for updating an existing tag.
 *
 * Responsibilities
 * ----------------
 * - Define the API contract for tag updates.
 * - Reuse all validation rules from CreateTagDto.
 * - Make every property optional.
 * - Provide Swagger documentation.
 *
 * Notes
 * -----
 * - Extends CreateTagDto using PartialType.
 * - All validation rules are inherited.
 * - Suitable for HTTP PATCH operations.
 *
 * Compatible With
 * ---------------
 * - NestJS 11
 * - class-validator
 * - @nestjs/swagger
 * ============================================================================
 */

import { PartialType } from '@nestjs/swagger';

import { CreateTagDto } from './create-tag.dto';

/**
 * DTO used for updating an existing tag.
 *
 * Every property inherited from CreateTagDto is optional,
 * allowing partial updates through PATCH requests.
 */
export class UpdateTagDto extends PartialType(CreateTagDto) {}
