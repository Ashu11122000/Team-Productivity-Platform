/**
 * ============================================================================
 * File: index.ts
 * ============================================================================
 *
 * Utilities Barrel Exports
 *
 * Responsibilities
 * ----------------
 * - Provide a single entry point for shared utility functions.
 * - Simplify imports throughout the application.
 * - Reduce import path duplication.
 * - Improve maintainability and scalability.
 *
 * NOTE
 * ----
 * Utility functions should be:
 * - Pure functions whenever possible.
 * - Stateless.
 * - Reusable across modules.
 * - Independent of NestJS dependency injection.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * - Node.js 22+
 *
 * Example
 * -------
 * Instead of:
 *
 * import { getPaginationMeta } from './utils/pagination.utils';
 * import { buildResponse } from './utils/response.utils';
 *
 * simply use:
 *
 * import {
 *   buildResponse,
 *   getPaginationMeta,
 * } from './utils';
 * ============================================================================
 */

/**
 * --------------------------------------------------------------------------
 * Pagination Utilities
 * --------------------------------------------------------------------------
 */

export * from './pagination.utils';

/**
 * --------------------------------------------------------------------------
 * Response Utilities
 * --------------------------------------------------------------------------
 */

export * from './response.utils';
