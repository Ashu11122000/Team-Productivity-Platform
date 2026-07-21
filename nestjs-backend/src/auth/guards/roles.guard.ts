/**
 * ============================================================================
 * File: roles.guard.ts
 * ============================================================================
 *
 * Enterprise Roles Authorization Guard.
 *
 * Responsibilities
 * ----------------
 * - Read required roles from route metadata.
 * - Compare authenticated user roles against required roles.
 * - Allow access when no role restriction exists.
 * - Deny access when the authenticated user lacks the required role.
 *
 * Notes
 * -----
 * This guard performs authorization only.
 * Authentication must already have been completed by JwtAuthGuard.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Passport JWT
 * - Node.js 22+
 * ============================================================================
 */

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { Request } from 'express';

import { ForbiddenException } from '../../common/exceptions';
import { ROLES_KEY } from '../../common/decorators';
// The common/constants module may not export a Role type in all projects.
// Use a local Role alias compatible with expected usage (string-based role names).
type Role = string;
import { JwtPayload } from '../../common/interfaces';

/**
 * Express request extended with authenticated user information.
 */
interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

/**
 * Enterprise role-based authorization guard.
 *
 * Reads role metadata attached by the @Roles() decorator
 * and verifies that the authenticated user possesses one
 * of the required roles.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  /**
   * Determines whether the current request is authorized.
   *
   * @param context Current execution context.
   * @returns True when access is permitted.
   *
   * @throws ForbiddenException
   * When the authenticated user does not satisfy
   * the required role requirements.
   */
  canActivate(context: ExecutionContext): boolean {
    /**
     * Retrieve required roles from method or controller.
     */
    const requiredRoles = this.reflector.getAllAndOverride<ReadonlyArray<Role>>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    /**
     * No role restrictions.
     */
    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const user = request.user;

    /**
     * JwtAuthGuard should already guarantee
     * an authenticated user. This check is
     * defensive for unexpected pipeline issues.
     */
    if (!user) {
      throw new ForbiddenException(
        'Authenticated user information is unavailable.',
      );
    }

    /**
     * Allow access if user has one of the required roles.
     */
    const hasRequiredRole = requiredRoles.includes(user.role);

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource.',
      );
    }

    return true;
  }
}
