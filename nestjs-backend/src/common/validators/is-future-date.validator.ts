/**
 * ============================================================================
 * File: task-status.enum.ts
 * ============================================================================
 *
 * Task Status Enumeration
 *
 * Responsibilities
 * ----------------
 * - Define all supported task lifecycle states.
 * - Eliminate magic strings.
 * - Provide strongly typed task statuses.
 * - Standardize task workflow across the application.
 *
 * NOTE
 * ----
 * Task status represents the current lifecycle stage of a task.
 * These values are persisted in the database and should remain
 * stable to avoid breaking existing records.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM
 * - PostgreSQL
 * - TypeScript 5+
 * - Node.js 22+
 * ============================================================================
 */

/**
 * Supported task lifecycle states.
 */
export enum TaskStatus {
  /**
   * Task has been created but work has not started.
   */
  TODO = 'TODO',

  /**
   * Task is currently being worked on.
   */
  IN_PROGRESS = 'IN_PROGRESS',

  /**
   * Task has been successfully completed.
   */
  COMPLETED = 'COMPLETED',

  /**
   * Task has been cancelled and will not be completed.
   */
  CANCELLED = 'CANCELLED',
}
