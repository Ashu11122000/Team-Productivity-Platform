/**
 * ============================================================================
 * File: activity-log-metadata.interface.ts
 * ============================================================================
 *
 * Activity Log Metadata Interface.
 *
 * Responsibilities
 * ----------------
 * - Define the structure of additional metadata associated with
 *   an activity log.
 * - Provide a reusable type across entities, DTOs, mappers,
 *   repositories, and services.
 * - Support flexible metadata while maintaining type safety.
 *
 * Notes
 * -----
 * Different activity types may include different metadata.
 * For example:
 *
 * - Category Created
 * - Task Updated
 * - Tag Deleted
 * - Notification Read
 * - Analytics Generated
 *
 * Therefore, this interface intentionally allows arbitrary
 * key-value pairs.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * - Node.js 22+
 * ============================================================================
 */

/**
 * ============================================================================
 * Activity Log Metadata
 * ============================================================================
 *
 * Represents additional contextual information describing
 * an activity.
 *
 * Example
 * -------
 * ```ts
 * {
 *   oldName: 'Work',
 *   newName: 'Office',
 *   priority: 'HIGH',
 *   color: '#3B82F6',
 *   taskCount: 15,
 * }
 * ```
 * ============================================================================
 */
export interface ActivityLogMetadata {
  /**
   * Flexible metadata object.
   *
   * Keys should be descriptive and values should be
   * JSON-serializable.
   */
  [key: string]:
    | string
    | number
    | boolean
    | null
    | string[]
    | number[]
    | boolean[]
    | Record<string, unknown>
    | Record<string, unknown>[];
}
