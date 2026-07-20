/**
 * ============================================================================
 * File: index.ts
 * ============================================================================
 *
 * Barrel exports for application exceptions.
 *
 * Responsibilities
 * ----------------
 * - Provide a single import entry point.
 * - Simplify exception imports.
 * - Improve maintainability.
 * - Keep modules clean.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * ============================================================================
 */

/**
 * ============================================================================
 * Base Exception
 * ============================================================================
 */
export * from './app.exception';

/**
 * ============================================================================
 * HTTP Exceptions
 * ============================================================================
 */
export * from './bad-request.exception';

export * from './conflict.exception';

export * from './forbidden.exception';

export * from './internal-server.exception';

export * from './not-found.exception';

export * from './unauthorized.exception';

/**
 * ============================================================================
 * Infrastructure Exceptions
 * ============================================================================
 */
export * from './database.exception';

export * from './integration.exception';

/**
 * ============================================================================
 * Validation Exceptions
 * ============================================================================
 */
export * from './validation.exception';
