/**
 * ============================================================================
 * File: validation.exception.ts
 * ============================================================================
 *
 * Validation Exception.
 *
 * Responsibilities
 * ----------------
 * - Represent validation failures.
 * - Standardize DTO validation errors.
 * - Handle custom business validation failures.
 * - Extend the base AppException.
 *
 * Examples:
 * - Invalid input
 * - Missing fields
 * - DTO validation failures
 * - Business rule violations
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - class-validator
 * - ValidationPipe
 * ============================================================================
 */

import { HttpStatus } from '@nestjs/common';

import { AppException } from './app.exception';

import { ERROR_CODES } from '../constants';

/**
 * ============================================================================
 * Validation Exception
 * ============================================================================
 */
export class ValidationException extends AppException {
  constructor(
    code: string = ERROR_CODES.VALIDATION_ERROR,

    message = 'Validation failed.',

    details?: unknown,
  ) {
    super(
      code,

      message,

      HttpStatus.BAD_REQUEST,

      details,
    );
  }
}
