/**
 * ============================================================================
 * File: not-found.exception.ts
 * ============================================================================
 *
 * Not Found Exception.
 *
 * Responsibilities
 * ----------------
 * - Represent HTTP 404 resource lookup failures.
 * - Provide consistent API error responses.
 * - Support resource-specific error codes.
 * - Extend the base AppException.
 *
 * Examples:
 * - User not found
 * - Task not found
 * - Category not found
 * - Tag not found
 * - Notification not found
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM
 * ============================================================================
 */

import { HttpStatus } from '@nestjs/common';

import { AppException } from './app.exception';

import { ERROR_CODES } from '../constants';

/**
 * ============================================================================
 * Not Found Exception
 * ============================================================================
 */
export class NotFoundException extends AppException {
  constructor(
    code: string = ERROR_CODES.NOT_FOUND,

    message = 'Resource not found.',

    details?: unknown,
  ) {
    super(
      code,

      message,

      HttpStatus.NOT_FOUND,

      details,
    );
  }
}
