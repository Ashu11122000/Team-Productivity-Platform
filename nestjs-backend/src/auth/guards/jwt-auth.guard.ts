/**
 * ============================================================================
 * File: jwt-auth.guard.ts
 * ============================================================================
 *
 * Enterprise JWT Authentication Guard.
 *
 * Responsibilities
 * ----------------
 * - Protect authenticated routes.
 * - Delegate JWT validation to Passport's JWT strategy.
 * - Return the authenticated user to the request pipeline.
 * - Convert authentication failures into standardized exceptions.
 *
 * Notes
 * -----
 * Authentication is owned by the FastAPI backend.
 * NestJS only validates JWT access tokens.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Passport JWT
 * - Node.js 22+
 * ============================================================================
 */

import { ExecutionContext, Injectable } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { UnauthorizedException } from '../../common/exceptions';

/**
 * Enterprise JWT authentication guard.
 *
 * This guard delegates authentication to Passport's JWT strategy and
 * converts authentication failures into the application's standardized
 * UnauthorizedException.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Determines whether the current request can proceed.
   *
   * Currently delegates to Passport.
   *
   * @param context Current execution context.
   * @returns Authentication result.
   */
  override canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  /**
   * Handles the authenticated user returned by Passport.
   *
   * @param error Passport authentication error.
   * @param user Authenticated user.
   * @param info Passport strategy information.
   * @returns Authenticated user.
   *
   * @throws UnauthorizedException
   * When authentication fails or no authenticated user exists.
   */
  override handleRequest<TUser = unknown>(
    error: Error | null,
    user: TUser | false | null,
    _info?: unknown,
  ): TUser {
    void _info;

    /**
     * Future Enhancement:
     *
     * If detailed authentication logging is required,
     * inject PinoLogger instead of using console.log().
     *
     * Example:
     *
     * this.logger.warn({
     *   error,
     *   info,
     * });
     */

    if (error || !user) {
      throw (
        error ??
        new UnauthorizedException(
          'Authentication failed or access token is invalid.',
        )
      );
    }

    return user;
  }
}
