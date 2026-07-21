/*
 * ============================================================================
 * File: base-entity.interface.ts
 * ============================================================================
 *
 * Base External Entity Interface
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define common fields returned by external integrations.
 * - Provide reusable contract for API responses.
 *
 * Used By:
 * ----------------------------------------------------------------------------
 * - FastAPI integration
 * - Holiday providers
 * - Future external services
 *
 *
 * Important:
 * ----------------------------------------------------------------------------
 * Integration layer receives serialized API data.
 *
 * Therefore timestamps are strings.
 *
 * Database entities may use Date objects.
 *
 * ============================================================================
 */

export interface BaseEntityInterface {
  /**
   * External resource identifier.
   */
  id: string;

  /**
   * Creation timestamp from external API.
   *
   * Usually ISO string.
   *
   * Example:
   *
   * 2026-07-21T10:30:00Z
   */
  createdAt?: string;

  /**
   * Last update timestamp from external API.
   */
  updatedAt?: string;
}
