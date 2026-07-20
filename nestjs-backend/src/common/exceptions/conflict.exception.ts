/**
 * ============================================================================
 * File: conflict.exception.ts
 * ============================================================================
 *
 * Conflict Exception.
 *
 * Responsibilities
 * ----------------
 * - Represent HTTP 409 conflict errors.
 * - Handle duplicate resource scenarios.
 * - Provide consistent application error responses.
 * - Extend the base AppException.
 *
 * Examples:
 * - User already exists
 * - Email already registered
 * - Duplicate task/category/tag
 * - Database unique constraint violation
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * ============================================================================
 */

import { HttpStatus } from '@nestjs/common';

import { AppException } from './app.exception';

import { ERROR_CODES } from '../constants';

/**
 * ============================================================================
 * Conflict Exception
 * ============================================================================
 */
export class ConflictException extends AppException {
  constructor(
    code: string = ERROR_CODES.CONFLICT,

    message = 'Resource conflict occurred.',

    details?: unknown,
  ) {
    super(
      code,

      message,

      HttpStatus.CONFLICT,

      details,
    );
  }
}
