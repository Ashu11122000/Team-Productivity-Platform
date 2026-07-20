/**
 * ============================================================================
 * File: request-id.middleware.ts
 * ============================================================================
 *
 * Request ID Middleware
 *
 * Responsibilities
 * ----------------
 * - Assign a unique Request ID to every incoming request.
 * - Reuse an existing Request ID when provided.
 * - Improve request tracing and observability.
 * - Enable log correlation across the application.
 *
 * Why?
 * ----
 * Every request should have a unique identifier so that:
 *
 * - Logs can be correlated.
 * - Errors become easier to trace.
 * - Distributed services can propagate the same request ID.
 * - Debugging production issues becomes significantly easier.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Express
 * - Node.js 22+
 * ============================================================================
 */

import { randomUUID } from 'node:crypto';

import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

/**
 * Extend Express Request with a request ID.
 */
export interface RequestWithId extends Request {
  /**
   * Unique request identifier.
   */
  requestId: string;
}

/**
 * Header used for request correlation.
 */
const REQUEST_ID_HEADER = 'x-request-id';

/**
 * Middleware responsible for attaching a Request ID
 * to every incoming request.
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  /**
   * Process the incoming request.
   *
   * @param req Express request.
   * @param res Express response.
   * @param next Next middleware.
   */
  use(req: RequestWithId, res: Response, next: NextFunction): void {
    /**
     * Use the incoming Request ID if provided,
     * otherwise generate a new UUID.
     */
    const requestId = this.getRequestId(req) ?? randomUUID();

    /**
     * Store on request object.
     */
    req.requestId = requestId;

    /**
     * Expose to downstream services and clients.
     */
    res.setHeader(REQUEST_ID_HEADER, requestId);

    next();
  }

  /**
   * Extract Request ID from headers.
   *
   * @param req Express request.
   * @returns Request ID if present.
   */
  private getRequestId(req: Request): string | undefined {
    const header = req.headers[REQUEST_ID_HEADER];

    if (typeof header === 'string') {
      const value = header.trim();

      return value.length > 0 ? value : undefined;
    }

    return undefined;
  }
}
