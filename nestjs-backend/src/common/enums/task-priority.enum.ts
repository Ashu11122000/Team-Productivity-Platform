/**
 * ============================================================================
 * File: task-priority.enum.ts
 * ============================================================================
 *
 * Task Priority Enumeration
 *
 * Responsibilities
 * ----------------
 * - Define all supported task priority levels.
 * - Eliminate magic strings.
 * - Provide strongly typed task priorities.
 * - Standardize priority values across the application.
 *
 * NOTE
 * ----
 * Priority indicates the relative importance of a task.
 * These values are persisted in the database and should
 * remain stable.
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
 * Supported task priority levels.
 */
export enum TaskPriority {
  /**
   * Low priority.
   */
  LOW = 'LOW',

  /**
   * Medium priority.
   */
  MEDIUM = 'MEDIUM',

  /**
   * High priority.
   */
  HIGH = 'HIGH',

  /**
   * Critical task requiring immediate attention.
   */
  URGENT = 'URGENT',
}
