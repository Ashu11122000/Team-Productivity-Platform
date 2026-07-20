/**
 * ============================================================================
 * File: pagination.type.ts
 * ============================================================================
 *
 * Enterprise Pagination Types
 *
 * Responsibilities
 * ----------------
 * - Define reusable pagination type aliases.
 * - Improve type safety across repositories and services.
 * - Eliminate duplicate pagination-related type definitions.
 *
 * NOTE
 * ----
 * These are compile-time TypeScript types only.
 * Runtime validation should be handled by DTOs.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * - Node.js 22+
 * ============================================================================
 */

/**
 * Represents pagination parameters.
 */
export type Pagination = Readonly<{
  /**
   * Current page number.
   */
  page: number;

  /**
   * Number of records per page.
   */
  limit: number;
}>;

/**
 * Represents pagination metadata.
 */
export type PaginationMeta = Readonly<{
  /**
   * Current page number.
   */
  page: number;

  /**
   * Number of records per page.
   */
  limit: number;

  /**
   * Total number of records.
   */
  total: number;

  /**
   * Total number of pages.
   */
  totalPages: number;
}>;

/**
 * Represents a generic paginated result.
 *
 * @template T Entity type.
 */
export type PaginatedResult<T> = Readonly<{
  /**
   * Collection of returned items.
   */
  data: readonly T[];

  /**
   * Pagination metadata.
   */
  meta: PaginationMeta;
}>;
