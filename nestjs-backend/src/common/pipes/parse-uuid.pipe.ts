/**
 * ============================================================================
 * File: parse-uuid.pipe.ts
 * ============================================================================
 *
 * Enterprise UUID Validation Pipe
 *
 * Responsibilities
 * ----------------
 * - Validate UUID route parameters.
 * - Reject invalid UUID values before reaching controllers/services.
 * - Produce standardized BadRequestException responses.
 * - Eliminate repetitive UUID validation inside controllers.
 *
 * Why use this pipe?
 * ------------------
 * Instead of:
 *
 * @Get(':id')
 * getTask(@Param('id') id: string) {
 *   if (!isUUID(id)) {
 *     throw new BadRequestException(...);
 *   }
 * }
 *
 * simply use:
 *
 * @Get(':id')
 * getTask(
 *   @Param('id', ParseUuidPipe) id: string,
 * ) {}
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - class-validator
 * - UUID v1/v3/v4/v5/v7
 * *
 * Future Improvements
 * -------------------
 * - Restrict accepted UUID versions if business rules require it.
 * - Support custom validation messages through constructor options.
 * ============================================================================
 */

import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';

import { ERROR_CODES } from '../constants';
import { ValidationMessages } from '../messages';

/**
 * Enterprise UUID validation pipe.
 */
@Injectable()
export class ParseUuidPipe implements PipeTransform<string, string> {
  /**
   * Validates that the supplied value is a valid UUID.
   *
   * @param value Route parameter value.
   * @returns Valid UUID string.
   * @throws BadRequestException When UUID is invalid.
   */
  transform(value: string): string {
    const normalizedValue = value?.trim();

    if (!normalizedValue || !isUUID(normalizedValue, 'all')) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        code: ERROR_CODES.VALIDATION_ERROR,
        message: ValidationMessages.INVALID_UUID,
      });
    }

    return normalizedValue;
  }
}
