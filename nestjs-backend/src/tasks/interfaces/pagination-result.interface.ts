/**
 * ============================================================================
 * File: pagination-result.interface.ts
 * ============================================================================
 *
 * Generic pagination result contract.
 *
 * Responsibilities
 * ----------------
 * - Standardize paginated responses across repositories.
 * - Provide strongly typed pagination metadata.
 * - Promote reuse across all feature modules.
 *
 * Used By
 * -------
 * - Tasks
 * - Categories
 * - Tags
 * - Activity Logs
 * - Analytics
 * - Dashboard
 * - Calendar
 * - Reminders
 *
 * Notes
 * -----
 * This interface is intended for the Repository and Service layers.
 * Controllers should return Response DTOs mapped from these results.
 *
 * Compatible With
 * ---------------
 * - NestJS 11
 * - TypeScript 5+
 * ============================================================================
 */

/**
 * Generic pagination result.
 *
 * @template T Type of records contained in the current page.
 */
export interface PaginationResult<T> {
  /**
   * Records for the current page.
   */
  data: T[];

  /**
   * Total number of matching records.
   */
  total: number;

  /**
   * Current page number.
   */
  page: number;

  /**
   * Number of records requested per page.
   */
  limit: number;

  /**
   * Total number of available pages.
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
