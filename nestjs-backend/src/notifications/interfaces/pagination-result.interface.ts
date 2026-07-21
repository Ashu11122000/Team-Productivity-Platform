/**
 * ============================================================================
 * File: pagination-result.interface.ts
 * ============================================================================
 *
 * Enterprise Pagination Result Interface
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents a generic paginated result.
 * - Used by repository methods returning paginated data.
 * - Acts as the internal contract between Repository and Service.
 * - Remains independent of DTOs and HTTP concerns.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Generic Programming
 * - Single Responsibility Principle (SRP)
 * - Strong Typing
 * - Framework Agnostic
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - This interface is NOT exposed directly to API consumers.
 * - Repository implementations populate this interface.
 * - Services map it into response DTOs.
 *
 * Compatible With
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - TypeScript 5+
 * ============================================================================
 */

export interface PaginationResult<T> {
  /**
   * Paginated records.
   */
  items: T[];

  /**
   * Total records.
   */
  total: number;

  /**
   * Current page number.
   */
  page: number;

  /**
   * Records per page.
   */
  limit: number;

  /**
   * Total available pages.
   */
  totalPages: number;

  /**
   * Indicates whether another page exists.
   */
  hasNextPage: boolean;

  /**
   * Indicates whether a previous page exists.
   */
  hasPreviousPage: boolean;
}
