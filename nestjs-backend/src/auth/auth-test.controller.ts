/**
 * ============================================================================
 * File: auth-test.controller.ts
 * ============================================================================
 *
 * Enterprise Authentication Test Controller.
 *
 * Responsibilities
 * ----------------
 * - Verify public endpoint accessibility.
 * - Verify JWT authentication.
 * - Demonstrate authenticated user extraction.
 * - Provide simple authentication testing endpoints.
 *
 * Notes
 * -----
 * This controller exists only for development and authentication
 * verification. It should be removed or disabled in production
 * environments once authentication has been fully validated.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Swagger
 * - Passport JWT
 * - Node.js 22+
 * ============================================================================
 */

import { Controller, Get, UseGuards } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser, Public } from '../common/decorators';

import { JwtPayload } from '../common/interfaces';

import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * Authentication testing endpoints.
 */
@ApiTags('Authentication')
@Controller('auth-test')
export class AuthTestController {
  /**
   * Public endpoint.
   *
   * Does not require authentication.
   */
  @Public()
  @Get('public')
  @ApiOperation({
    summary: 'Public authentication test endpoint',
  })
  @ApiOkResponse({
    description: 'Public endpoint is accessible.',
  })
  publicRoute(): {
    success: boolean;
    message: string;
  } {
    return {
      success: true,
      message: 'Public endpoint is accessible.',
    };
  }

  /**
   * Protected endpoint.
   *
   * Requires a valid JWT issued by the FastAPI
   * authentication service.
   */
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Protected authentication test endpoint',
  })
  @ApiOkResponse({
    description: 'Authenticated user returned successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing JWT access token.',
  })
  protectedRoute(@CurrentUser() user: JwtPayload): {
    success: boolean;
    message: string;
    user: JwtPayload;
  } {
    return {
      success: true,
      message: 'JWT authentication successful.',
      user,
    };
  }
}
