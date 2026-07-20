/**
 * ============================================================================
 * File: app.exception.ts
 * ============================================================================
 *
 * Base application exception.
 *
 * Responsibilities
 * ----------------
 * - Provide a common exception structure.
 * - Standardize API error responses.
 * - Store machine-readable error codes.
 * - Store human-readable messages.
 * - Support global exception filters.
 *
 * Used By
 * -------
 * - Custom HTTP exceptions
 * - Database exceptions
 * - Integration exceptions
 * - Validation exceptions
 * - Global Exception Filter
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Express
 * - FastAPI-compatible API responses
 * ============================================================================
 */

import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * ============================================================================
 * Exception Response Interface
 * ============================================================================
 */
export interface AppExceptionResponse {
  /**
   * Always false for errors.
   */
  success: false;

  /**
   * HTTP status code.
   */
  statusCode: number;

  /**
   * Internal application error code.
   *
   * Example:
   *
   * USER_NOT_FOUND
   */
  code: string;

  /**
   * Human-readable message.
   */
  message: string;

  /**
   * Optional additional error details.
   */
  details?: unknown;

  /**
   * Error timestamp.
   */
  timestamp: string;
}

/**
 * ============================================================================
 * App Exception
 * ============================================================================
 */
export class AppException extends HttpException {
  /**
   * Internal error code.
   */
  public readonly code: string;

  /**
   * Error timestamp.
   */
  public readonly timestamp: string;

  constructor(
    code: string,
    message: string,
    statusCode: HttpStatus,
    details?: unknown,
  ) {
    const response: AppExceptionResponse = {
      success: false,

      statusCode,

      code,

      message,

      ...(details !== undefined ? { details } : {}),

      timestamp: new Date().toISOString(),
    };

    super(response, statusCode);

    this.code = code;

    this.timestamp = response.timestamp;
  }
}
