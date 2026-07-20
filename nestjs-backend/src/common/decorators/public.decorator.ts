/**
 * ============================================================================
 * File: public.decorator.ts
 * ============================================================================
 *
 * Enterprise Public Route Decorator
 *
 * Responsibilities
 * ----------------
 * - Mark controllers or route handlers as publicly accessible.
 * - Allow specific endpoints to bypass JWT authentication.
 * - Attach standardized metadata consumed by authentication guards.
 * - Keep authentication concerns separated from controller logic.
 *
 * Why use this decorator?
 * -----------------------
 * Instead of embedding conditional authentication logic inside guards
 * or controllers, this decorator provides a declarative way to identify
 * public endpoints.
 *
 * Example:
 *
 * @Public()
 * @Get('health')
 * healthCheck() {
 *   return { status: 'ok' };
 * }
 *
 * The authentication guard can later inspect this metadata using NestJS's
 * Reflector service:
 *
 * const isPublic = this.reflector.getAllAndOverride<boolean>(
 *   IS_PUBLIC_KEY,
 *   [context.getHandler(), context.getClass()],
 * );
 *
 * if (isPublic) {
 *   return true;
 * }
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * - Node.js 22+
 *
 * Future Improvements
 * -------------------
 * - Support configurable authentication strategies.
 * - Allow conditional public access based on environment.
 * - Integrate with API versioning metadata if required.
 * ============================================================================
 */

import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key used to identify public routes.
 *
 * Authentication guards should inspect this metadata to determine
 * whether JWT validation should be skipped.
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a controller or route handler as publicly accessible.
 *
 * Public endpoints bypass authentication while remaining available
 * for logging, rate limiting, validation, and other middleware.
 *
 * Example:
 *
 * @Public()
 * @Get('health')
 * health() {}
 *
 * @returns MethodDecorator & ClassDecorator
 */
export const Public = (): MethodDecorator & ClassDecorator =>
  SetMetadata(IS_PUBLIC_KEY, true);
