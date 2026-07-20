/**
 * ============================================================================
 * File: internal-server.exception.ts
 * ============================================================================
 *
 * Internal Server Exception.
 *
 * Responsibilities
 * ----------------
 * - Represent HTTP 500 server errors.
 * - Handle unexpected application failures.
 * - Provide consistent error response structure.
 * - Extend the base AppException.
 *
 * Examples:
 * - Unexpected runtime errors
 * - Database failures
 * - External service failures
 * - Unknown exceptions
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Global Exception Filters
 * - Pino Logger
 * ============================================================================
 */

import { HttpStatus } from '@nestjs/common';

import { AppException } from './app.exception';

import { ERROR_CODES } from '../constants';

/**
 * ============================================================================
 * Internal Server Exception
 * ============================================================================
 */
export class InternalServerException extends AppException {
  constructor(
    code: string = ERROR_CODES.INTERNAL_SERVER_ERROR,

    message = 'Internal server error occurred.',

    details?: unknown,
  ) {
    super(
      code,

      message,

      HttpStatus.INTERNAL_SERVER_ERROR,

      details,
    );
  }
}
