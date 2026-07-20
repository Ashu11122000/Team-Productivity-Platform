/**
 * ============================================================================
 * File: index.ts
 * ============================================================================
 *
 * Common Filters Barrel Export
 *
 * Responsibilities
 * ----------------
 * - Provide a single entry point for all exception filters.
 * - Simplify imports throughout the application.
 * - Reduce import path duplication.
 * - Improve maintainability as new filters are added.
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
 * Global Exception Filter
 * ============================================================================
 */

export * from './all-exceptions.filter';
