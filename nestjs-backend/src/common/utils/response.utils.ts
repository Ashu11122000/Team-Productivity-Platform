/**
 * ============================================================================
 * File: response.utils.ts
 * ============================================================================
 *
 * Enterprise Response Utilities
 *
 * Responsibilities
 * ----------------
 * - Build standardized successful API responses.
 * - Eliminate duplicated response object creation.
 * - Ensure consistent response structure.
 * - Improve type safety across the application.
 *
 * NOTE
 * ----
 * This utility is intended for internal application use.
 * Global HTTP responses should primarily be handled by the
 * ResponseInterceptor.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * - Node.js 22+
 * ============================================================================
 */

import type { ApiResponseType } from '../types';

/**
 * Creates a standardized successful API response.
 *
 * @template T Response payload type.
 *
 * @param data Response payload.
 * @param message Human-readable success message.
 *
 * @returns Immutable API response.
 */
export function buildResponse<T>(
  data: T,
  message = 'Success',
): ApiResponseType<T> {
  return Object.freeze({
    success: true,
    message,
    data,
  });
}
