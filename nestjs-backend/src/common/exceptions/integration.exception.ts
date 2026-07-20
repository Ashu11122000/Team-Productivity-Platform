/**
 * ============================================================================
 * File: integration.exception.ts
 * ============================================================================
 *
 * Integration Exception.
 *
 * Responsibilities
 * ----------------
 * - Represent external service failures.
 * - Handle third-party API errors.
 * - Hide external service details from API consumers.
 * - Provide consistent integration error responses.
 *
 * Examples:
 * - FastAPI unavailable
 * - Holiday API timeout
 * - External provider failure
 * - Invalid external response
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Axios
 * - External API Integrations
 * ============================================================================
 */

import { HttpStatus } from '@nestjs/common';

import { AppException } from './app.exception';

import { INTEGRATION_ERROR_CODES } from '../constants';

/**
 * ============================================================================
 * Integration Exception
 * ============================================================================
 */
export class IntegrationException extends AppException {
  constructor(
    code: string = INTEGRATION_ERROR_CODES.EXTERNAL_SERVICE_TIMEOUT,

    message = 'External service request failed.',

    details?: unknown,
  ) {
    super(
      code,

      message,

      HttpStatus.SERVICE_UNAVAILABLE,

      details,
    );
  }
}
