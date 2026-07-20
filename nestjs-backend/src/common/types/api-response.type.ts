/**
 * ============================================================================
 * File: api-response.type.ts
 * ============================================================================
 *
 * Enterprise API Response Type
 *
 * Responsibilities
 * ----------------
 * - Define an immutable API response type.
 * - Provide a reusable type alias for internal application use.
 * - Complement the ApiResponse interface and ApiResponseDto.
 *
 * NOTE
 * ----
 * This is a compile-time TypeScript type only.
 * Runtime serialization and API documentation should use
 * ApiResponseDto<T>.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * - Node.js 22+
 * ============================================================================
 */

import type { ApiResponse } from '../interfaces';

/**
 * Immutable API response type.
 *
 * @template T Response payload type.
 */
export type ApiResponseType<T> = Readonly<ApiResponse<T>>;
