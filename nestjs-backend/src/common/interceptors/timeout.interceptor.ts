/* eslint-disable prettier/prettier */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';

import { Observable, throwError } from 'rxjs';

import {
  catchError,
  timeout,
} from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      timeout(5000),
      catchError((error) => {
        if (error.name === 'TimeoutError') {
          return throwError(
            () => new RequestTimeoutException(),
          );
        }

        return throwError(() => error);
      }),
    );
  }
}