/**
 * ============================================================================
 * File: unauthorized.exception.ts
 * ============================================================================
 *
 * Unauthorized Exception.
 *
 * Responsibilities
 * ----------------
 * - Represent HTTP 401 authentication failures.
 * - Handle JWT/authentication errors.
 * - Provide consistent API error responses.
 * - Extend the base AppException.
 *
 * Examples:
 * - Missing JWT token
 * - Invalid JWT token
 * - Expired token
 * - Invalid authentication context
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Passport JWT
 * - FastAPI Shared JWT Authentication
 * ============================================================================
 */

import { HttpStatus } from '@nestjs/common';

import { AppException } from './app.exception';

import { ERROR_CODES } from '../constants';

/**
 * ============================================================================
 * Unauthorized Exception
 * ============================================================================
 */
export class UnauthorizedException extends AppException {
  constructor(
    code: string = ERROR_CODES.UNAUTHORIZED,

    message = 'Authentication required.',

    details?: unknown,
  ) {
    super(
      code,

      message,

      HttpStatus.UNAUTHORIZED,

      details,
    );
  }
}
