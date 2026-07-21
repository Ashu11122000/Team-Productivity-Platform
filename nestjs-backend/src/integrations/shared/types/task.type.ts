/*
 * ============================================================================
 * File: task.type.ts
 * ============================================================================
 *
 * External Task Integration Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define reusable task contracts for integrations.
 * - Represent task data exchanged between services.
 *
 * Used By:
 * ----------------------------------------------------------------------------
 * - FastAPI integration
 * - Analytics integration
 * - External task providers
 * - Internal service communication
 *
 * Does NOT:
 * ----------------------------------------------------------------------------
 * - Replace Task entity.
 * - Contain database logic.
 *
 * ============================================================================
 */

// ============================================================================
// Task Status
// ============================================================================

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

// ============================================================================
// Task Priority
// ============================================================================

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// ============================================================================
// External Task Contract
// ============================================================================

export interface IntegrationTask {
  /**
   * External task identifier.
   */
  id?: string;

  /**
   * Task title.
   */
  title: string;

  /**
   * Optional description.
   */
  description?: string;

  /**
   * Current task status.
   */
  status: TaskStatus;

  /**
   * Task priority.
   */
  priority: TaskPriority;

  /**
   * Optional due date.
   */
  dueDate?: string;

  /**
   * Owner user identifier.
   *
   * Comes from FastAPI.
   */
  userId: string;

  /**
   * Creation timestamp.
   */
  createdAt?: string;

  /**
   * Last update timestamp.
   */
  updatedAt?: string;
}
