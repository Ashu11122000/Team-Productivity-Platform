/**
 * ============================================================================
 * File: features/tasks/types/update-task.types.ts
 * ============================================================================
 *
 * Update Task Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define request contracts for updating existing tasks.
 * - Mirror the NestJS UpdateTaskDto.
 * - Provide strong typing for partial task updates.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - All properties are optional because updates are partial.
 * - Task management is handled by the NestJS backend.
 * ============================================================================
 */

import type { TaskPriority, TaskStatus } from './task.types';

/**
 * ============================================================================
 * Update Task Request
 * ============================================================================
 */

export interface UpdateTaskRequest {
  /**
   * Updated task title.
   */
  readonly title?: string;

  /**
   * Updated task description.
   */
  readonly description?: string;

  /**
   * Updated task status.
   */
  readonly status?: TaskStatus;

  /**
   * Updated task priority.
   */
  readonly priority?: TaskPriority;

  /**
   * Updated due date (ISO 8601).
   */
  readonly dueDate?: string | null;

  /**
   * Updated category identifier.
   */
  readonly categoryId?: string | null;

  /**
   * Updated tag identifiers.
   */
  readonly tagIds?: readonly string[];
}
