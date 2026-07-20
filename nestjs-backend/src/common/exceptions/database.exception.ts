/**
 * ============================================================================
 * File: database.exception.ts
 * ============================================================================
 *
 * Database Exception.
 *
 * Responsibilities
 * ----------------
 * - Represent database-related failures.
 * - Hide internal database details from API consumers.
 * - Provide consistent database error responses.
 * - Extend the base AppException.
 *
 * Examples:
 * - Connection failures
 * - Query failures
 * - Transaction failures
 * - Constraint violations
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM 0.3+
 * - PostgreSQL
 * ============================================================================
 */

import { HttpStatus } from '@nestjs/common';

import { AppException } from './app.exception';

import { DATABASE_ERROR_CODES } from '../constants';

/**
 * ============================================================================
 * Database Exception
 * ============================================================================
 */
export class DatabaseException extends AppException {
  constructor(
    code: string = DATABASE_ERROR_CODES.DATABASE_QUERY_FAILED,

    message = 'Database operation failed.',

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
