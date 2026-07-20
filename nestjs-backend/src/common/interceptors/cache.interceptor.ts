/**
 * ============================================================================
 * File: cache.interceptor.ts
 * ============================================================================
 *
 * Enterprise Cache Interceptor
 *
 * Responsibilities
 * ----------------
 * - Extend NestJS CacheInterceptor.
 * - Generate consistent cache keys.
 * - Customize cache behavior.
 * - Remain compatible with Redis and CacheManager.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - @nestjs/cache-manager
 * - Redis
 * - Memory Cache
 * ============================================================================
 */

import { CacheInterceptor as NestCacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

/**
 * Enterprise cache interceptor.
 */
@Injectable()
export class CacheInterceptor extends NestCacheInterceptor {
  /**
   * Generates a cache key for incoming requests.
   *
   * Default format:
   *
   * METHOD:URL
   *
   * Example:
   *
   * GET:/api/tasks?page=1
   */
  protected trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();

    if (!request) {
      return undefined;
    }

    /**
     * Only cache GET requests.
     */
    if (request.method !== 'GET') {
      return undefined;
    }

    return `${request.method}:${request.originalUrl}`;
  }
}
