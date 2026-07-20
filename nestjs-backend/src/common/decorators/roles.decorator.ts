/**
 * ============================================================================
 * File: roles.decorator.ts
 * ============================================================================
 *
 * Enterprise Roles Decorator
 *
 * Responsibilities
 * ----------------
 * - Declare role-based authorization requirements.
 * - Attach role metadata to controllers or route handlers.
 * - Keep authorization rules declarative and centralized.
 * - Provide metadata for consumption by RolesGuard.
 *
 * Why use this decorator?
 * -----------------------
 * Instead of embedding authorization logic inside controllers,
 * use this decorator to declare the required roles.
 *
 * Example:
 *
 * @Roles('admin')
 * @Get()
 * findAll() {}
 *
 * Multiple roles:
 *
 * @Roles('admin', 'manager')
 * @Post()
 * create() {}
 *
 * Controllers can also be protected:
 *
 * @Roles('admin')
 * @Controller('users')
 * export class UsersController {}
 *
 * The actual authorization logic belongs inside RolesGuard,
 * which will inspect this metadata using NestJS's Reflector.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * - Node.js 22+
 *
 * Future Improvements
 * -------------------
 * - Replace string roles with a strongly typed Role enum.
 * - Integrate with a permissions-based authorization model.
 * - Support hierarchical role evaluation.
 * ============================================================================
 */

import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key used by RolesGuard.
 */
export const ROLES_KEY = 'roles';

/**
 * Declares the roles required to access a controller
 * or route handler.
 *
 * Example:
 *
 * @Roles('admin')
 *
 * @Roles('admin', 'manager')
 *
 * @param roles One or more application roles.
 * @returns MethodDecorator & ClassDecorator
 */
export const Roles = (
  ...roles: readonly string[]
): MethodDecorator & ClassDecorator => SetMetadata(ROLES_KEY, roles);
