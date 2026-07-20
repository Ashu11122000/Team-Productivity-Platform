/**
 * ============================================================================
 * File: activity-entity-type.enum.ts
 * ============================================================================
 *
 * Activity Entity Type Enumeration
 *
 * Responsibilities
 * ----------------
 * - Define the supported entity types for activity logs.
 * - Standardize entity references across the application.
 * - Eliminate magic strings.
 * - Provide strongly typed activity entities.
 *
 * NOTE
 * ----
 * These values identify the entity associated with an activity log.
 *
 * Example:
 * - Entity Type : TASK
 * - Entity ID   : 8c5b4d9d-1d56-4b4f-a0a8-65b6db0d9d1b
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
 * Supported activity entity types.
 */
export enum ActivityEntityType {
  // ==========================================================================
  // Task Management
  // ==========================================================================

  TASK = 'TASK',

  CATEGORY = 'CATEGORY',

  TAG = 'TAG',
}
