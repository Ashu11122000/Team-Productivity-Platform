/**
 * ============================================================================
 * File: request-logger.middleware.ts
 * ============================================================================
 *
 * Request Logger Middleware
 *
 * Responsibilities
 * ----------------
 * - Log every incoming HTTP request.
 * - Include Request ID for log correlation.
 * - Record request metadata.
 * - Measure request duration.
 * - Log response status.
 *
 * NOTE
 * ----
 * This middleware intentionally logs only request metadata.
 * Business events should be logged inside services.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Express
 * - Node.js 22+
 * ============================================================================
 */

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { RequestWithId } from './request-id.middleware';

/**
 * Logs every incoming HTTP request and its response.
 */
@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  /**
   * NestJS logger.
   */
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  /**
   * Process incoming request.
   *
   * @param req Express request.
   * @param res Express response.
   * @param next Next middleware.
   */
  use(req: RequestWithId, res: Response, next: NextFunction): void {
    const startedAt = Date.now();

    /**
     * Response finished.
     */
    res.on('finish', () => {
      const duration = Date.now() - startedAt;

      this.logger.log({
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: this.getClientIp(req),
        userAgent: req.get('user-agent') ?? 'Unknown',
      });
    });

    next();
  }

  /**
   * Returns client IP address.
   *
   * Supports reverse proxies.
   */
  private getClientIp(req: Request): string {
    const forwardedFor = req.headers['x-forwarded-for'];

    if (typeof forwardedFor === 'string') {
      return forwardedFor.split(',')[0].trim();
    }

    return req.ip ?? 'Unknown';
  }
}
