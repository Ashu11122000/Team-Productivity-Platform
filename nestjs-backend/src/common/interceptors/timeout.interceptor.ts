/**
 * ============================================================================
 * File: timeout.interceptor.ts
 * ============================================================================
 *
 * Timeout Interceptor
 *
 * Responsibilities
 * ----------------
 * - Enforce a maximum request execution time.
 * - Prevent indefinitely hanging requests.
 * - Convert timeout errors into GatewayTimeoutException.
 * - Keep timeout behavior centralized.
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
  GatewayTimeoutException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

/**
 * Enterprise timeout interceptor.
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  /**
   * Creates a new interceptor.
   */
  constructor(private readonly configService: ConfigService) {}

  /**
   * Intercepts request execution.
   *
   * @param context Execution context.
   * @param next Next handler.
   * @returns Observable response.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    /**
     * Read timeout from configuration.
     *
     * Falls back to 30 seconds if not configured.
     */
    const timeoutMs =
      this.configService.get<number>('app.requestTimeout') ?? 30_000;

    return next.handle().pipe(
      timeout(timeoutMs),

      catchError((error: unknown) => {
        if (error instanceof TimeoutError) {
          return throwError(
            () => new GatewayTimeoutException('Request timed out.'),
          );
        }

        return throwError(() => error);
      }),
    );
  }
}
