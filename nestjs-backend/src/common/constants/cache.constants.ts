/**
 * ============================================================================
 * File: cache.constants.ts
 * ============================================================================
 *
 * Cache constants for the Team Productivity Platform.
 *
 * Responsibilities
 * ----------------
 * - Centralize cache-related constants.
 * - Define cache TTL defaults.
 * - Standardize cache key namespaces.
 * - Eliminate magic strings.
 *
 * NOTE
 * ----
 * Environment-specific cache values belong in:
 *
 * src/config/
 *
 * This file only contains immutable application constants.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - @nestjs/cache-manager
 * - Redis
 * ============================================================================
 */

/**
 * ============================================================================
 * Cache Namespaces
 * ============================================================================
 *
 * Every cache key should begin with one of these namespaces.
 */
export const CACHE_NAMESPACE = {
  USER: 'user',

  TASK: 'task',

  CATEGORY: 'category',

  TAG: 'tag',

  NOTE: 'note',

  NOTIFICATION: 'notification',

  ANALYTICS: 'analytics',

  HOLIDAY: 'holiday',

  DASHBOARD: 'dashboard',

  HEALTH: 'health',
} as const;

/**
 * ============================================================================
 * Cache Key Prefixes
 * ============================================================================
 *
 * Prefixes used when constructing cache keys.
 *
 * Example:
 * user:123
 * task:list
 * analytics:dashboard
 */
export const CACHE_PREFIX = {
  USER: 'user:',

  TASK: 'task:',

  CATEGORY: 'category:',

  TAG: 'tag:',

  NOTE: 'note:',

  NOTIFICATION: 'notification:',

  ANALYTICS: 'analytics:',

  HOLIDAY: 'holiday:',

  DASHBOARD: 'dashboard:',

  HEALTH: 'health:',
} as const;

/**
 * ============================================================================
 * Cache TTL
 * ============================================================================
 *
 * Time-to-live values in seconds.
 *
 * These are application defaults.
 *
 * Runtime values can be overridden via configuration.
 */
export const CACHE_TTL = {
  SHORT: 60,

  MEDIUM: 300,

  LONG: 3600,

  DAY: 86400,

  WEEK: 604800,
} as const;

/**
 * ============================================================================
 * Cache Keys
 * ============================================================================
 *
 * Frequently used cache keys.
 */
export const CACHE_KEYS = {
  DASHBOARD_STATS: 'dashboard:stats',

  HOLIDAYS: 'holiday:list',

  HEALTH_STATUS: 'health:status',

  ANALYTICS_SUMMARY: 'analytics:summary',
} as const;

/**
 * ============================================================================
 * Cache Tags
 * ============================================================================
 *
 * Used for grouped cache invalidation.
 */
export const CACHE_TAGS = {
  USERS: 'users',

  TASKS: 'tasks',

  CATEGORIES: 'categories',

  TAGS: 'tags',

  NOTES: 'notes',

  NOTIFICATIONS: 'notifications',

  ANALYTICS: 'analytics',

  HOLIDAYS: 'holidays',

  DASHBOARD: 'dashboard',
} as const;

/**
 * ============================================================================
 * Cache Header
 * ============================================================================
 *
 * Future support for HTTP cache headers.
 */
export const CACHE_HEADERS = {
  CACHE_CONTROL: 'Cache-Control',

  ETAG: 'ETag',

  LAST_MODIFIED: 'Last-Modified',
} as const;

/**
 * ============================================================================
 * Helper Functions
 * ============================================================================
 */

/**
 * Creates a cache key.
 *
 * Example:
 *
 * buildCacheKey('task', '123')
 *
 * Returns:
 *
 * task:123
 */
export function buildCacheKey(
  prefix: string,
  identifier: string | number,
): string {
  return `${prefix}:${identifier}`;
}

/**
 * Creates a cache key for lists.
 *
 * Example:
 *
 * buildListCacheKey('task')
 *
 * Returns:
 *
 * task:list
 */
export function buildListCacheKey(prefix: string): string {
  return `${prefix}:list`;
}

/**
 * Creates a cache key with multiple segments.
 *
 * Example:
 *
 * buildNestedCacheKey('analytics', 'dashboard', 'today')
 *
 * Returns:
 *
 * analytics:dashboard:today
 */
export function buildNestedCacheKey(
  ...segments: Array<string | number>
): string {
  return segments.join(':');
}
