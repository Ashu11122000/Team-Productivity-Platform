/**
 * ============================================================================
 * File: parse-int.pipe.ts
 * ============================================================================
 *
 * Enterprise Integer Parsing Pipe
 *
 * Responsibilities
 * ----------------
 * - Parse numeric route/query parameters.
 * - Validate integer values.
 * - Reject invalid, empty, or malformed input.
 * - Produce standardized BadRequestException responses.
 * - Prevent repetitive parsing logic inside controllers.
 *
 * Why use this pipe?
 * ------------------
 * Instead of:
 *
 * const page = Number(req.query.page);
 * if (isNaN(page)) {
 *   throw new BadRequestException(...);
 * }
 *
 * simply use:
 *
 * @Get()
 * findAll(
 *   @Query('page', ParseIntPipe) page: number,
 * ) {}
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * - Node.js 22+
 *
 * Future Improvements
 * -------------------
 * - Optional min/max validation.
 * - Optional positive-only mode.
 * - Optional zero allowance configuration.
 * ============================================================================
 */

import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { ERROR_CODES } from '../constants';
import { ValidationMessages } from '../messages';

/**
 * Enterprise integer parsing pipe.
 *
 * Converts incoming values to integers while providing
 * consistent validation errors across the application.
 */
@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  /**
   * Transform and validate an integer value.
   *
   * @param value Incoming route/query parameter.
   * @returns Parsed integer.
   * @throws BadRequestException When value is not a valid integer.
   */
  transform(value: string): number {
    const normalizedValue = value?.trim();

    if (!normalizedValue) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        code: ERROR_CODES.VALIDATION_ERROR,
        message: ValidationMessages.REQUIRED,
      });
    }

    /**
     * Ensure the input contains only an optional leading
     * minus sign followed by digits.
     *
     * Rejects:
     * - 12.5
     * - abc
     * - 10abc
     * - 1e5
     * - Infinity
     */
    if (!/^-?\d+$/.test(normalizedValue)) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        code: ERROR_CODES.VALIDATION_ERROR,
        message: ValidationMessages.INVALID_VALUE,
      });
    }

    const parsedValue = Number.parseInt(normalizedValue, 10);

    if (!Number.isSafeInteger(parsedValue)) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        code: ERROR_CODES.VALIDATION_ERROR,
        message: ValidationMessages.INVALID_VALUE,
      });
    }

    return parsedValue;
  }
}
