/**
 * ============================================================================
 * File: current-user.decorator.ts
 * ============================================================================
 *
 * Enterprise Current User Decorator
 * ============================================================================
 */

import { createParamDecorator } from '@nestjs/common';

/**
 * Represents the authenticated user attached to the request.
 *
 * This will later be replaced with a dedicated JwtPayload interface
 * inside common/interfaces.
 */
type AuthenticatedUser = Record<string, unknown>;

/**
 * Extracts the authenticated user (or one of its properties)
 * from the current HTTP request.
 *
 * Examples
 * --------
 *
 * @CurrentUser()
 * user
 *
 * @CurrentUser('id')
 * userId
 *
 * @CurrentUser('email')
 * email
 */
export const CurrentUser = createParamDecorator<
  keyof AuthenticatedUser | undefined,
  unknown
>((data, context) => {
  const request = context.switchToHttp().getRequest<{
    user?: AuthenticatedUser;
  }>();

  const user = request.user;

  if (data === undefined) {
    return user;
  }

  return user?.[data];
});
