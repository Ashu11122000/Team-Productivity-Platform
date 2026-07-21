/**
 * ============================================================================
 * File: task-filter.interface.ts
 * ============================================================================
 *
 * Internal filtering contract for task queries.
 *
 * Responsibilities
 * ----------------
 * - Transfer filtering criteria from the Service layer to the Repository.
 * - Keep repositories independent from HTTP-specific DTOs.
 * - Support reusable QueryBuilder filtering.
 *
 * Notes
 * -----
 * - This interface is NOT exposed through the API.
 * - It contains only repository-level filtering options.
 * - It should be created from TaskQueryDto inside the service layer.
 *
 * Compatible With
 * ---------------
 * - NestJS 11
 * - TypeScript 5+
 * ============================================================================
 */

import { TaskPriority } from '../../common/enums/task-priority.enum';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { SortOrder } from '../../common/enums/sort-order.enum';

/**
 * Internal repository filter for querying tasks.
 */
export interface TaskFilter {
  /**
   * Authenticated user identifier.
   *
   * Every repository query should be scoped
   * to the authenticated user.
   */
  userId: string;

  /**
   * Page number.
   */
  page: number;

  /**
   * Records per page.
   */
  limit: number;

  /**
   * Number of records to skip.
   *
   * Calculated in the service:
   * (page - 1) * limit
   */
  skip: number;

  /**
   * Task status filter.
   */
  status?: TaskStatus;

  /**
   * Task priority filter.
   */
  priority?: TaskPriority;

  /**
   * Category identifier.
   */
  categoryId?: string;

  /**
   * Tag identifiers.
   *
   * Repository should return tasks
   * containing one or more of these tags.
   */
  tagIds?: string[];

  /**
   * Search term.
   *
   * Used for title/description searching.
   */
  search?: string;

  /**
   * Due date start.
   */
  dueDateFrom?: Date;

  /**
   * Due date end.
   */
  dueDateTo?: Date;

  /**
   * Completed tasks only.
   */
  completed?: boolean;

  /**
   * Include overdue tasks only.
   */
  overdue?: boolean;

  /**
   * Include archived (soft deleted) tasks.
   */
  includeDeleted?: boolean;

  /**
   * Column used for sorting.
   */
  sortBy: string;

  /**
   * Sort direction.
   */
  sortOrder: SortOrder;
}
