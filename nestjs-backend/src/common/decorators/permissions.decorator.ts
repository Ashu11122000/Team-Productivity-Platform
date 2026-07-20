/**
 * ============================================================================
 * File: permissions.decorator.ts
 * ============================================================================
 *
 * Enterprise Permissions Decorator
 *
 * Responsibilities
 * ----------------
 * - Declare permission-based authorization requirements.
 * - Attach permission metadata to controllers or route handlers.
 * - Keep authorization declarative and separate from business logic.
 * - Provide metadata consumed by PermissionsGuard.
 *
 * Why use this decorator?
 * -----------------------
 * Role-based authorization is often too coarse-grained.
 * Permissions allow fine-grained access control.
 *
 * Example:
 *
 * @Permissions('task:create')
 * @Post()
 * createTask() {}
 *
 * Multiple permissions:
 *
 * @Permissions(
 *   'task:read',
 *   'task:update',
 * )
 * @Patch(':id')
 * updateTask() {}
 *
 * Entire controllers can also be protected:
 *
 * @Permissions('admin:access')
 * @Controller('admin')
 * export class AdminController {}
 *
 * The actual authorization logic belongs inside
 * PermissionsGuard, which will inspect this metadata
 * using NestJS's Reflector service.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * - Node.js 22+
 *
 * Future Improvements
 * -------------------
 * - Replace string permissions with a strongly typed Permission enum.
 * - Support wildcard permissions (e.g. task:*).
 * - Support hierarchical permission evaluation.
 * - Integrate with external RBAC/ABAC providers.
 * ============================================================================
 */

import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key used by PermissionsGuard.
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * Declares one or more permissions required to access
 * a controller or route handler.
 *
 * Examples
 * --------
 *
 * @Permissions('task:create')
 *
 * @Permissions(
 *   'task:read',
 *   'task:update',
 * )
 *
 * @param permissions Required application permissions.
 * @returns MethodDecorator & ClassDecorator
 */
export const Permissions = (
  ...permissions: readonly string[]
): MethodDecorator & ClassDecorator =>
  SetMetadata(PERMISSIONS_KEY, permissions);
