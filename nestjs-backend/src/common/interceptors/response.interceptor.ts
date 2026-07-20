/**
 * ============================================================================
 * File: response.interceptor.ts
 * ============================================================================
 *
 * Response Interceptor
 *
 * Responsibilities
 * ----------------
 * - Attach common response metadata.
 * - Preserve controller response shape.
 * - Avoid modifying primitive, stream, or file responses.
 * - Correlate responses using the Request ID.
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
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RequestWithId } from '../middleware';

/**
 * Standard response metadata.
 */
export interface ResponseMetadata {
  /**
   * Request correlation identifier.
   */
  requestId?: string;

  /**
   * UTC timestamp.
   */
  timestamp: string;
}

/**
 * Response wrapper.
 */
export interface ApiResponse<T> {
  /**
   * Response payload.
   */
  data: T;

  /**
   * Response metadata.
   */
  meta: ResponseMetadata;
}

/**
 * Standardizes successful API responses.
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<RequestWithId>();

    return next.handle().pipe(
      map((data) => {
        return {
          data,
          meta: {
            requestId: request.requestId,
            timestamp: new Date().toISOString(),
          },
        };
      }),
    );
  }
}
