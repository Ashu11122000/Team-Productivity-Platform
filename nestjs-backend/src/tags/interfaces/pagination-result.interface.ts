/**
 * ============================================================================
 * File: pagination-result.interface.ts
 * ============================================================================
 *
 * Generic Pagination Result Interface.
 *
 * Responsibilities
 * ----------------
 * - Represent a standardized paginated response.
 * - Decouple repositories from HTTP response models.
 * - Provide a reusable pagination contract across modules.
 *
 * Notes
 * -----
 * - Used internally between Repository and Service layers.
 * - Independent of controllers and DTOs.
 * - Generic and reusable throughout the application.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * ============================================================================
 */

/**
 * Generic pagination result.
 *
 * @template T Type of the paginated records.
 */
export interface PaginationResult<T> {
  /**
   * Current page records.
   */
  readonly data: T[];

  /**
   * Total number of matching records.
   */
  readonly total: number;

  /**
   * Current page number.
   */
  readonly page: number;

  /**
   * Number of records per page.
   */
  readonly limit: number;

  /**
   * Total number of pages.
   */
  readonly totalPages: number;

  /**
   * Indicates whether another page exists.
   */
  readonly hasNextPage: boolean;

  /**
   * Indicates whether a previous page exists.
   */
  readonly hasPreviousPage: boolean;
}
