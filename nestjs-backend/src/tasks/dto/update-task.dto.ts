/**
 * ============================================================================
 * File: update-task.dto.ts
 * ============================================================================
 *
 * Data Transfer Object for updating an existing task.
 *
 * Responsibilities
 * ----------------
 * - Define the API contract for partial task updates.
 * - Reuse all validation rules from CreateTaskDto.
 * - Make every field optional to support PATCH operations.
 * - Generate accurate Swagger documentation.
 *
 * Notes
 * -----
 * - Inherits all validation decorators from CreateTaskDto.
 * - Uses NestJS PartialType to automatically convert all
 *   properties into optional fields.
 * - Keeps validation rules centralized and avoids duplication.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - @nestjs/swagger
 * - class-validator
 * - class-transformer
 * ============================================================================
 */

import { PartialType } from '@nestjs/swagger';

import { CreateTaskDto } from './create-task.dto';

/**
 * DTO used for partially updating an existing task.
 *
 * Every property inherited from CreateTaskDto
 * becomes optional.
 */
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
