/**
 * ============================================================================
 * File: pagination.constants.ts
 * ============================================================================
 *
 * Pagination constants for the Team Productivity Platform.
 *
 * Responsibilities
 * ----------------
 * - Centralize pagination defaults.
 * - Eliminate magic numbers.
 * - Standardize sorting.
 * - Provide reusable pagination metadata.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM
 * - PostgreSQL
 * ============================================================================
 */

/**
 * ============================================================================
 * Sort Direction
 * ============================================================================
 */
export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

/**
 * ============================================================================
 * Pagination Defaults
 * ============================================================================
 */
export const PAGINATION = {
  /**
   * Default page number.
   */
  DEFAULT_PAGE: 1,

  /**
   * Default page size.
   */
  DEFAULT_LIMIT: 10,

  /**
   * Minimum page number.
   */
  MIN_PAGE: 1,

  /**
   * Minimum page size.
   */
  MIN_LIMIT: 1,

  /**
   * Maximum page size.
   */
  MAX_LIMIT: 100,

  /**
   * Default sort field.
   */
  DEFAULT_SORT_FIELD: 'createdAt',

  /**
   * Default sort direction.
   */
  DEFAULT_ORDER: SortDirection.DESC,
} as const;

/**
 * ============================================================================
 * Alias
 * ============================================================================
 *
 * Used throughout services and pipes.
 */
export const PAGINATION_CONSTANTS = PAGINATION;

/**
 * ============================================================================
 * Default Sorting
 * ============================================================================
 */
export const DEFAULT_SORT = {
  FIELD: PAGINATION.DEFAULT_SORT_FIELD,

  ORDER: PAGINATION.DEFAULT_ORDER,
} as const;

/**
 * ============================================================================
 * Pagination Query Parameters
 * ============================================================================
 */
export const PAGINATION_QUERY = {
  PAGE: 'page',

  LIMIT: 'limit',

  SORT_BY: 'sortBy',

  SORT_ORDER: 'sortOrder',

  SEARCH: 'search',
} as const;

/**
 * ============================================================================
 * Pagination Response Keys
 * ============================================================================
 */
export const PAGINATION_RESPONSE = {
  ITEMS: 'items',

  META: 'meta',

  TOTAL_ITEMS: 'totalItems',

  ITEM_COUNT: 'itemCount',

  ITEMS_PER_PAGE: 'itemsPerPage',

  TOTAL_PAGES: 'totalPages',

  CURRENT_PAGE: 'currentPage',

  HAS_NEXT_PAGE: 'hasNextPage',

  HAS_PREVIOUS_PAGE: 'hasPreviousPage',
} as const;

/**
 * ============================================================================
 * Allowed Sort Orders
 * ============================================================================
 */
export const ALLOWED_SORT_ORDERS = Object.freeze([
  SortDirection.ASC,
  SortDirection.DESC,
]);

/**
 * ============================================================================
 * Common Sort Fields
 * ============================================================================
 *
 * These fields are commonly available across most entities.
 * Individual modules may extend this list as needed.
 */
export const COMMON_SORT_FIELDS = Object.freeze([
  'id',
  'createdAt',
  'updatedAt',
  'title',
  'name',
]);

/**
 * ============================================================================
 * Pagination Limits
 * ============================================================================
 */
export const PAGINATION_LIMITS = {
  PAGE_MIN: PAGINATION.MIN_PAGE,

  LIMIT_MIN: PAGINATION.MIN_LIMIT,

  LIMIT_MAX: PAGINATION.MAX_LIMIT,
} as const;

/**
 * ============================================================================
 * Helper Functions
 * ============================================================================
 */

/**
 * Determines whether a sort order is valid.
 *
 * @param value Sort order.
 * * @returns True if valid.
 */
export function isValidSortOrder(value: string): value is SortDirection {
  return ALLOWED_SORT_ORDERS.includes(value as SortDirection);
}

/**
 * Determines whether a page number is valid.
 *
 * @param page Page number.
 * @returns True if valid.
 */
export function isValidPage(page: number): boolean {
  return Number.isInteger(page) && page >= PAGINATION.MIN_PAGE;
}

/**
 * Determines whether a page size is valid.
 *
 * @param limit Requested page size.
 * @returns True if valid.
 */
export function isValidLimit(limit: number): boolean {
  return (
    Number.isInteger(limit) &&
    limit >= PAGINATION.MIN_LIMIT &&
    limit <= PAGINATION.MAX_LIMIT
  );
}

/**
 * Normalizes the requested page size.
 *
 * Values outside the configured limits are clamped.
 *
 * @param limit Requested page size.
 * @returns Normalized page size.
 */
export function normalizeLimit(limit: number): number {
  if (limit < PAGINATION.MIN_LIMIT) {
    return PAGINATION.MIN_LIMIT;
  }

  if (limit > PAGINATION.MAX_LIMIT) {
    return PAGINATION.MAX_LIMIT;
  }

  return limit;
}

/**
 * Calculates the database offset.
 *
 * @param page Current page.
 * @param limit Page size.
 * @returns Database offset.
 */
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}
