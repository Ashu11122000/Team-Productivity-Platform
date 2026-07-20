/**
 * ============================================================================
 * File: bad-request.exception.ts
 * ============================================================================
 *
 * Bad Request Exception.
 *
 * Responsibilities
 * ----------------
 * - Represent HTTP 400 errors.
 * - Provide consistent application error responses.
 * - Extend the base AppException.
 *
 * Examples:
 * - Invalid input
 * - Invalid state transition
 * - Failed business validation
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
 * Bad Request Exception
 * ============================================================================
 */
export class BadRequestException extends AppException {
  constructor(
    code: string = ERROR_CODES.BAD_REQUEST,
    message = 'Bad request.',
    details?: unknown,
  ) {
    super(code, message, HttpStatus.BAD_REQUEST, details);
  }
}
