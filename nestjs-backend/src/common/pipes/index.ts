/**
 * ============================================================================
 * File: index.ts
 * ============================================================================
 *
 * Common Pipes Barrel Export
 *
 * Responsibilities
 * ----------------
 * - Provide a single entry point for all custom pipes.
 * - Simplify imports throughout the application.
 * - Reduce import path duplication.
 * - Improve maintainability as new pipes are added.
 *
 * Why use a barrel file?
 * ----------------------
 * Instead of:
 *
 * import { ParseUuidPipe } from './common/pipes/parse-uuid.pipe';
 * import { ParseIntPipe } from './common/pipes/parse-int.pipe';
 * import { TrimPipe } from './common/pipes/trim.pipe';
 *
 * simply use:
 *
 * import {
 *   ParseUuidPipe,
 *   ParseIntPipe,
 *   TrimPipe,
 * } from '@/common/pipes';
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
 * Parameter Parsing Pipes
 * ============================================================================
 */

export * from './parse-int.pipe';
export * from './parse-uuid.pipe';

/**
 * ============================================================================
 * Input Normalization Pipes
 * ============================================================================
 */

export * from './sanitize.pipe';
export * from './trim.pipe';

/**
 * ============================================================================
 * Query Utility Pipes
 * ============================================================================
 */

export * from './pagination.pipe';

/**
 * ============================================================================
 * Global Validation
 * ============================================================================
 */

export * from './validation.pipe';
