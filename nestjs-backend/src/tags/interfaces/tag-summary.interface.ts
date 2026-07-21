/**
 * ============================================================================
 * File: tag-summary.interface.ts
 * ============================================================================
 *
 * Enterprise Tag Summary Interface.
 *
 * Responsibilities
 * ----------------
 * - Represent aggregated tag statistics.
 * - Define the internal analytics contract used by the Tags module.
 * - Decouple repository aggregation results from API response DTOs.
 *
 * Architecture
 * ------------
 * TagsRepository
 *      │
 *      ▼
 * TagSummary
 *      │
 *      ▼
 * TagsService
 *      │
 *      ▼
 * TagResponseDto / Analytics Module
 *
 * Notes
 * -----
 * - Used internally between Repository and Service layers.
 * - Never returned directly by controllers.
 * - Independent of Swagger decorators and TypeORM.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * ============================================================================
 */

/**
 * Aggregated tag statistics.
 */
export interface TagSummary {
  /**
   * Total number of tags.
   */
  readonly total: number;

  /**
   * Number of active (non-deleted) tags.
   */
  readonly active: number;

  /**
   * Number of soft-deleted tags.
   */
  readonly deleted: number;

  /**
   * Number of tags currently assigned
   * to one or more tasks.
   */
  readonly used: number;

  /**
   * Number of tags that are not assigned
   * to any task.
   */
  readonly unused: number;
}
