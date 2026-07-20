/**
 * ============================================================================
 * File: all-exceptions.filter.ts
 * ============================================================================
 *
 * Global Exception Filter
 *
 * Responsibilities
 * ----------------
 * - Handle every unhandled exception.
 * - Standardize error responses.
 * - Preserve HTTP status codes.
 * - Handle TypeORM database exceptions.
 * - Prevent leaking internal implementation details.
 * - Correlate errors using Request ID.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Express
 * - TypeORM
 * - Node.js 22+
 * ============================================================================
 */

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

import appConfig from '../../config/app.config';
import { ERROR_CODES } from '../constants';
import { RequestWithId } from '../middleware';

/**
 * Standard API error response.
 */
interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
  code: string;
  timestamp: string;
  path: string;
  requestId?: string;
}

/**
 * Global exception filter.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<RequestWithId>();

    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[] = 'Internal server error.';

    let code: string = ERROR_CODES.INTERNAL_SERVER_ERROR;

    /**
     * ---------------------------------------------------------
     * HTTP Exceptions
     * ---------------------------------------------------------
     */
    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObject = exceptionResponse as Record<string, unknown>;

        message = (responseObject.message as string | string[]) ?? message;

        code = (responseObject.code as string) ?? code;
      }
    }

    /**
     * ---------------------------------------------------------
     * TypeORM Exceptions
     * ---------------------------------------------------------
     */
    else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;

      code = ERROR_CODES.BAD_REQUEST;

      message = 'Database operation failed.';
    }

    /**
     * ---------------------------------------------------------
     * Unexpected Exceptions
     * ---------------------------------------------------------
     */
    else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    }

    /**
     * ---------------------------------------------------------
     * Build response.
     * ---------------------------------------------------------
     */
    const body: ErrorResponse = {
      statusCode: status,
      error: HttpStatus[status] ?? 'Internal Server Error',
      message,
      code,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
      requestId: request.requestId,
    };

    /**
     * ---------------------------------------------------------
     * Include stack trace only in development.
     * ---------------------------------------------------------
     */
    if (this.config.isDevelopment && exception instanceof Error) {
      Object.assign(body, {
        stack: exception.stack,
      });
    }

    response.status(status).json(body);
  }
}
