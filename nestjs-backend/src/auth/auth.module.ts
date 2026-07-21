/**
 * ============================================================================
 * File: auth.module.ts
 * ============================================================================
 *
 * Enterprise Authentication Module.
 *
 * Responsibilities
 * ----------------
 * - Configure Passport authentication.
 * - Register the JWT validation strategy.
 * - Register authorization guards.
 * - Expose authentication infrastructure to feature modules.
 *
 * Notes
 * -----
 * This module DOES NOT perform authentication.
 *
 * Authentication is owned by the FastAPI backend.
 * NestJS only validates JWT access tokens and provides
 * authorization infrastructure for protected resources.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Passport JWT
 * - Node.js 22+
 * ============================================================================
 */

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthTestController } from './auth-test.controller';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

import { JwtStrategy } from './strategies/jwt.strategy';

/**
 * Authentication infrastructure module.
 */
@Module({
  /**
   * --------------------------------------------------------------------------
   * Imports
   * --------------------------------------------------------------------------
   */
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],

  /**
   * --------------------------------------------------------------------------
   * Controllers
   * --------------------------------------------------------------------------
   */
  controllers: [AuthTestController],

  /**
   * --------------------------------------------------------------------------
   * Providers
   * --------------------------------------------------------------------------
   *
   * Registers authentication and authorization components
   * for dependency injection.
   */
  providers: [JwtStrategy, JwtAuthGuard, RolesGuard],

  /**
   * --------------------------------------------------------------------------
   * Exports
   * --------------------------------------------------------------------------
   *
   * Makes authentication infrastructure available to
   * feature modules across the application.
   */
  exports: [PassportModule, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
