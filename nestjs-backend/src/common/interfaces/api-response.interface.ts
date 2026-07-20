/**
 * ============================================================================
 * File: api-response.interface.ts
 * ============================================================================
 *
 * Enterprise API Response Interface
 *
 * Responsibilities
 * ----------------
 * - Define the standard structure of successful API responses.
 * - Provide a reusable contract for services, interceptors, and controllers.
 * - Improve type safety across the application.
 *
 * NOTE
 * ----
 * This interface exists only at compile time.
 * Runtime API documentation should use ApiResponseDto<T>.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * - Node.js 22+
 * ============================================================================
 */

/**
 * Generic interface representing a successful API response.
 *
 * @template T Type of the response payload.
 */
export interface ApiResponse<T> {
  /**
   * Indicates whether the operation completed successfully.
   */
  success: boolean;

  /**
   * Human-readable response message.
   */
  message: string;

  /**
   * Response payload.
   */
  data: T;
}
