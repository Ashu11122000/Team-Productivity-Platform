/**
 * ============================================================================
 * File: features/tasks/types/task-query.types.ts
 * ============================================================================
 *
 * Task Query Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define query parameters for retrieving tasks.
 * - Mirror the NestJS task query DTO.
 * - Provide strongly typed filtering, sorting, and pagination.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Task management is owned by the NestJS backend.
 * - Used by React Query hooks and task service APIs.
 * ============================================================================
 */

import type { TaskPriority, TaskStatus } from './task.types';

/**
 * ============================================================================
 * Sort Order
 * ============================================================================
 */

export type SortOrder = 'ASC' | 'DESC';

/**
 * ============================================================================
 * Task Query Parameters
 * ============================================================================
 */

export interface TaskQueryParams {
  /**
   * Page number (1-based).
   */
  readonly page?: number;

  /**
   * Number of records per page.
   */
  readonly limit?: number;

  /**
   * Search term.
   */
  readonly search?: string;

  /**
   * Filter by task status.
   */
  readonly status?: TaskStatus;

  /**
   * Filter by task priority.
   */
  readonly priority?: TaskPriority;

  /**
   * Filter by category.
   */
  readonly categoryId?: string;

  /**
   * Filter by tag.
   */
  readonly tagId?: string;

  /**
   * Field used for sorting.
   */
  readonly sortBy?: string;

  /**
   * Sort direction.
   */
  readonly sortOrder?: SortOrder;
}
