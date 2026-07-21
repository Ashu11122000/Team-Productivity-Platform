/*
 * ============================================================================
 * File: update-reminder.dto.ts
 * ============================================================================
 *
 * Enterprise Update Reminder DTO
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Defines the payload for updating an existing reminder.
 * - Makes every property optional to support partial updates.
 * - Applies validation rules identical to CreateReminderDto.
 * - Provides complete Swagger documentation.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - DTO only
 * - No business logic
 * - PATCH-friendly
 * - Validation-first
 * - OpenAPI documented
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Authentication is handled by FastAPI.
 * - NestJS validates the JWT and determines the authenticated user.
 * - The service layer is responsible for ownership validation.
 * - Only supplied fields will be updated.
 * ============================================================================
 */

import { PartialType } from '@nestjs/swagger';
import { CreateReminderDto } from './create-reminder.dto';

/**
 * DTO for partially updating an existing reminder.
 *
 * Extends CreateReminderDto while making every property optional,
 * allowing PATCH semantics.
 */
export class UpdateReminderDto extends PartialType(CreateReminderDto) {}
