/**
 * ============================================================================
 * File: index.ts
 * ============================================================================
 *
 * Decorators Barrel Export
 *
 * Responsibilities
 * ----------------
 * - Provide a single entry point for all custom decorators.
 * - Simplify imports throughout the application.
 * - Reduce import path duplication.
 * - Improve maintainability as the project grows.
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
 * import { CurrentUser } from './decorators/current-user.decorator';
 * import { Public } from './decorators/public.decorator';
 * import { Roles } from './decorators/roles.decorator';
 *
 * simply use:
 *
 * import {
 *   CurrentUser,
 *   Permissions,
 *   Public,
 *   Roles,
 * } from './decorators';
 * ============================================================================
 */

/**
 * --------------------------------------------------------------------------
 * Authentication Decorators
 * --------------------------------------------------------------------------
 */

export * from './current-user.decorator';
export * from './public.decorator';

/**
 * --------------------------------------------------------------------------
 * Authorization Decorators
 * --------------------------------------------------------------------------
 */

export * from './roles.decorator';
export * from './permissions.decorator';
