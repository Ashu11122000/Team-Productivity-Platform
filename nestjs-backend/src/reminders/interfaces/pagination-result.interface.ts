/*
 * ============================================================================
 * File: pagination-result.interface.ts
 * ============================================================================
 *
 * Enterprise Pagination Result Interface
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Defines the generic paginated result returned by the repository layer.
 * - Serves as the internal contract between repositories and mappers.
 * - Provides pagination metadata independent of HTTP response DTOs.
 * - Supports any entity type through TypeScript generics.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Interface only
 * - Generic and reusable
 * - Strongly typed
 * - Repository-oriented
 * - No business logic
 *
 * Notes
 * ----------------------------------------------------------------------------
 * Repositories return this interface after executing paginated queries.
 * Mappers transform this interface into module-specific pagination response
 * DTOs before returning them from the service layer.
 *
 * This interface is intentionally generic so it can be reused across
 * multiple modules (Tasks, Tags, Notifications, Reminders, etc.).
 * ============================================================================
 */

export interface PaginationResult<T> {
  /**
   * Collection of records for the current page.
   */
  items: T[];

  /**
   * Total number of matching records.
   */
  total: number;

  /**
   * Current page number.
   */
  page: number;

  /**
   * Number of records per page.
   */
  limit: number;

  /**
   * Total number of available pages.
   */
  totalPages: number;

  /**
   * Indicates whether a next page exists.
   */
  hasNext: boolean;

  /**
   * Indicates whether a previous page exists.
   */
  hasPrevious: boolean;
}
