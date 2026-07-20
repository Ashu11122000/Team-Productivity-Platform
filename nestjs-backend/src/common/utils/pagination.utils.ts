/**
 * ============================================================================
 * File: pagination.utils.ts
 * ============================================================================
 *
 * Enterprise Pagination Utilities
 *
 * Responsibilities
 * ----------------
 * - Generate standardized pagination metadata.
 * - Eliminate duplicated pagination calculations.
 * - Provide reusable pagination helper functions.
 * - Improve consistency across services and repositories.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * - Node.js 22+
 * ============================================================================
 */

import type { PaginationMeta } from '../types';

/**
 * Builds pagination metadata.
 *
 * @param total Total number of available records.
 * @param page Current page number.
 * @param limit Number of records per page.
 *
 * @returns Standardized pagination metadata.
 */
export function getPaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginationMeta {
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return Object.freeze({
    total,
    page,
    limit,
    totalPages,
  });
}
