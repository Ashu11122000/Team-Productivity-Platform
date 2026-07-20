/**
 * ============================================================================
 * File: index.ts
 * ============================================================================
 *
 * Types Barrel Exports
 *
 * Responsibilities
 * ----------------
 * - Provide a single entry point for shared type aliases.
 * - Simplify imports throughout the application.
 * - Reduce import path duplication.
 * - Improve maintainability and scalability.
 *
 * NOTE
 * ----
 * Unlike interfaces, type aliases are commonly used for:
 * - Utility types
 * - Union types
 * - Mapped types
 * - Generic aliases
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
 * import { ApiResponse } from './types/api-response.type';
 * import { CurrentUser } from './types/current-user.type';
 *
 * simply use:
 *
 * import {
 *   ApiResponse,
 *   CurrentUser,
 *   Pagination,
 * } from './types';
 * ============================================================================
 */

/**
 * --------------------------------------------------------------------------
 * API Types
 * --------------------------------------------------------------------------
 */

export * from './api-response.type';

/**
 * --------------------------------------------------------------------------
 * Authentication Types
 * --------------------------------------------------------------------------
 */

export * from './current-user.type';

/**
 * --------------------------------------------------------------------------
 * Pagination Types
 * --------------------------------------------------------------------------
 */

export * from './pagination.type';
