/**
 * ============================================================================
 * File: features/tasks/types/create-task.types.ts
 * ============================================================================
 *
 * Create Task Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define request contracts for creating tasks.
 * - Mirror the NestJS CreateTaskDto.
 * - Provide reusable task-related enums and DTOs.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Task management is owned by the NestJS backend.
 * - Authentication is provided by the FastAPI backend.
 * ============================================================================
 */

/**
 * ============================================================================
 * Task Status
 * ============================================================================
 */

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

/**
 * ============================================================================
 * Task Priority
 * ============================================================================
 */

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * ============================================================================
 * Create Task Request
 * ============================================================================
 */

export interface CreateTaskRequest {
  /**
   * Task title.
   */
  readonly title: string;

  /**
   * Optional task description.
   */
  readonly description?: string;

  /**
   * Initial task status.
   */
  readonly status?: TaskStatus;

  /**
   * Task priority.
   */
  readonly priority?: TaskPriority;

  /**
   * Due date (ISO 8601).
   */
  readonly dueDate?: string | null;

  /**
   * Related category identifier.
   */
  readonly categoryId?: string | null;

  /**
   * Associated tag identifiers.
   */
  readonly tagIds?: readonly string[];
}
