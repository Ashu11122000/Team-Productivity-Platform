/*
 * ============================================================================
 * File: pagination.interface.ts
 * ============================================================================
 *
 * Pagination Interfaces
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define reusable pagination contracts.
 * - Standardize paginated responses from integrations.
 *
 * Used By:
 * ----------------------------------------------------------------------------
 * - FastAPI integration
 * - External APIs
 * - Future integrations
 *
 * Does NOT:
 * ----------------------------------------------------------------------------
 * - Contain database pagination logic.
 * - Contain query logic.
 *
 * ============================================================================
 */

// ============================================================================
// Pagination Metadata
// ============================================================================

export interface PaginationMeta {
  /**
   * Current page number.
   */
  page: number;

  /**
   * Items per page.
   */
  limit: number;

  /**
   * Total available records.
   */
  total: number;

  /**
   * Total number of pages.
   */
  totalPages: number;
}

// ============================================================================
// Generic Paginated Response
// ============================================================================

export interface PaginationResult<T> {
  /**
   * Returned records.
   */
  data: T[];

  /**
   * Pagination information.
   */
  pagination: PaginationMeta;
}
