/**
 * ============================================================================
 * File: features/tasks/types/task.types.ts
 * ============================================================================
 *
 * Task Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define shared task-related domain models.
 * - Mirror the NestJS task response DTOs.
 * - Provide reusable types across the Tasks feature.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Tasks are managed by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
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
 * Task Category
 * ============================================================================
 */

export interface TaskCategory {
  readonly id: string;

  readonly name: string;

  readonly description?: string | null;

  readonly color?: string | null;
}

/**
 * ============================================================================
 * Task Tag
 * ============================================================================
 */

export interface TaskTag {
  readonly id: string;

  readonly name: string;

  readonly color?: string | null;
}

/**
 * ============================================================================
 * Task
 * ============================================================================
 */

export interface Task {
  /**
   * Unique task identifier.
   */
  readonly id: string;

  /**
   * Task title.
   */
  readonly title: string;

  /**
   * Optional task description.
   */
  readonly description: string | null;

  /**
   * Current task status.
   */
  readonly status: TaskStatus;

  /**
   * Task priority.
   */
  readonly priority: TaskPriority;

  /**
   * Due date (ISO 8601).
   */
  readonly dueDate: string | null;

  /**
   * Owner of the task.
   */
  readonly userId: string;

  /**
   * Indicates whether this task originated from a note.
   */
  readonly isConvertedFromNote: boolean;

  /**
   * Source note identifier.
   */
  readonly sourceNoteId: string | null;

  /**
   * Related category identifier.
   */
  readonly categoryId: string | null;

  /**
   * Category details.
   */
  readonly category: TaskCategory | null;

  /**
   * Associated tags.
   */
  readonly tags: readonly TaskTag[];

  /**
   * Creation timestamp (ISO 8601).
   */
  readonly createdAt: string;

  /**
   * Last update timestamp (ISO 8601).
   */
  readonly updatedAt: string;
}

/**
 * ============================================================================
 * Tasks Response
 * ============================================================================
 */

export interface TasksResponse {
  readonly data: readonly Task[];

  readonly total: number;

  readonly page: number;

  readonly limit: number;

  readonly totalPages: number;
}
