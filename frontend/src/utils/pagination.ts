/**
 * ============================================================================
 * File: utils/pagination.ts
 * ============================================================================
 *
 * Pagination Utilities
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Shared pagination helpers.
 * - Calculate offsets.
 * - Calculate total pages.
 * - Navigation helpers.
 * - Pagination metadata.
 * - Used by both FastAPI and NestJS modules.
 * ============================================================================
 */

/**
 * ============================================================================
 * Types
 * ============================================================================
 */

export interface PaginationParams {
  page: number;

  limit: number;
}

export interface PaginationMeta {
  page: number;

  limit: number;

  totalItems: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;
}

/**
 * ============================================================================
 * Constants
 * ============================================================================
 */

export const DEFAULT_PAGE = 1;

export const DEFAULT_LIMIT = 10;

export const MAX_LIMIT = 100;

/**
 * ============================================================================
 * Normalize
 * ============================================================================
 */

export function normalizePagination(params: Partial<PaginationParams>): PaginationParams {
  return {
    page: params.page && params.page > 0 ? params.page : DEFAULT_PAGE,

    limit: params.limit && params.limit > 0 ? Math.min(params.limit, MAX_LIMIT) : DEFAULT_LIMIT,
  };
}

/**
 * ============================================================================
 * Offset
 * ============================================================================
 */

export function getPaginationOffset(page: number, limit: number): number {
  return Math.max(page - 1, 0) * limit;
}

/**
 * ============================================================================
 * Total Pages
 * ============================================================================
 */

export function getTotalPages(totalItems: number, limit: number): number {
  if (limit <= 0) {
    return 0;
  }

  return Math.ceil(totalItems / limit);
}

/**
 * ============================================================================
 * Next Page
 * ============================================================================
 */

export function hasNextPage(page: number, totalPages: number): boolean {
  return page < totalPages;
}

/**
 * ============================================================================
 * Previous Page
 * ============================================================================
 */

export function hasPreviousPage(page: number): boolean {
  return page > 1;
}

/**
 * ============================================================================
 * Metadata
 * ============================================================================
 */

export function createPaginationMeta(
  totalItems: number,
  page: number,
  limit: number,
): PaginationMeta {
  const totalPages = getTotalPages(totalItems, limit);

  return {
    page,

    limit,

    totalItems,

    totalPages,

    hasNextPage: hasNextPage(page, totalPages),

    hasPreviousPage: hasPreviousPage(page),
  };
}

/**
 * ============================================================================
 * Query Parameters
 * ============================================================================
 */

export function createPaginationQuery(page: number, limit: number): Record<string, number> {
  return {
    page,
    limit,
  };
}
