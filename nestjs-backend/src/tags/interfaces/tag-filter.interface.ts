/**
 * ============================================================================
 * File: tag-filter.interface.ts
 * ============================================================================
 *
 * Enterprise Tag Filter Interface.
 *
 * Responsibilities
 * ----------------
 * - Define the normalized filter contract used internally by the Tags module.
 * - Decouple repository queries from HTTP request DTOs.
 * - Carry authenticated user context and repository filtering options.
 * - Provide a reusable filtering model for QueryBuilder operations.
 *
 * Architecture
 * ------------
 * Controller
 *      │
 *      ▼
 * TagQueryDto
 *      │
 *      ▼
 * TagsService
 *      │
 *      ▼
 * TagFilter
 *      │
 *      ▼
 * TagsRepository
 *
 * Notes
 * -----
 * - Used internally between the Service and Repository layers.
 * - Never exposed directly through the API.
 * - Independent of Swagger decorators and TypeORM.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * ============================================================================
 */

/**
 * Internal filter contract used by TagsRepository.
 */
export interface TagFilter {
  /**
   * Authenticated user identifier.
   */
  readonly userId: string;

  /**
   * Requested page number.
   */
  readonly page: number;

  /**
   * Number of records per page.
   */
  readonly limit: number;

  /**
   * Calculated pagination offset.
   *
   * Usually:
   * (page - 1) * limit
   */
  readonly skip: number;

  /**
   * Search keyword.
   *
   * Searches against:
   * - name
   */
  readonly search?: string;

  /**
   * Database column used for sorting.
   */
  readonly sortBy: string;

  /**
   * Sorting direction.
   */
  readonly sortOrder: 'ASC' | 'DESC';

  /**
   * Whether soft-deleted tags should be included.
   */
  readonly includeDeleted?: boolean;
}
