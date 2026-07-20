/**
 * ============================================================================
 * File: forbidden.exception.ts
 * ============================================================================
 *
 * Forbidden Exception.
 *
 * Responsibilities
 * ----------------
 * - Represent HTTP 403 authorization failures.
 * - Handle permission and role restrictions.
 * - Provide consistent application error responses.
 * - Extend the base AppException.
 *
 * Examples:
 * - Insufficient permissions
 * - Role restrictions
 * - Ownership violations
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - RBAC / RolesGuard
 * ============================================================================
 */

import { HttpStatus } from '@nestjs/common';

import { AppException } from './app.exception';

import { ERROR_CODES } from '../constants';

/**
 * ============================================================================
 * Forbidden Exception
 * ============================================================================
 */
export class ForbiddenException extends AppException {
  constructor(
    code: string = ERROR_CODES.FORBIDDEN,

    message = 'Access forbidden.',

    details?: unknown,
  ) {
    super(
      code,

      message,

      HttpStatus.FORBIDDEN,

      details,
    );
  }
}
