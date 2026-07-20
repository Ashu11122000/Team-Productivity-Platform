/**
 * ============================================================================
 * File: logging.interceptor.ts
 * ============================================================================
 *
 * Logging Interceptor
 *
 * Responsibilities
 * ----------------
 * - Log controller execution.
 * - Measure handler execution time.
 * - Log successful execution.
 * - Log exceptions before rethrowing.
 * - Correlate logs using Request ID.
 *
 * NOTE
 * ----
 * This interceptor complements RequestLoggerMiddleware.
 * It intentionally does NOT log HTTP request metadata
 * (method, URL, IP, etc.), since that is already handled
 * by the middleware.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - RxJS 7+
 * - Node.js 22+
 * ============================================================================
 */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { RequestWithId } from '../middleware';

/**
 * Logs controller execution lifecycle.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  /**
   * NestJS logger.
   */
  private readonly logger = new Logger(LoggingInterceptor.name);

  /**
   * Intercepts controller execution.
   *
   * @param context Execution context.
   * @param next Next handler.
   * @returns Observable response.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startedAt = Date.now();

    const request = context.switchToHttp().getRequest<RequestWithId>();

    const controller = context.getClass().name;

    const handler = context.getHandler().name;

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startedAt;

        this.logger.log({
          requestId: request.requestId,
          controller,
          handler,
          duration: `${duration}ms`,
          status: 'SUCCESS',
        });
      }),

      catchError((error: Error) => {
        const duration = Date.now() - startedAt;

        this.logger.error({
          requestId: request.requestId,
          controller,
          handler,
          duration: `${duration}ms`,
          status: 'FAILED',
          error: error.message,
        });

        return throwError(() => error);
      }),
    );
  }
}
