/**
 * ============================================================================
 * File: jwt.strategy.ts
 * ============================================================================
 *
 * Enterprise JWT Authentication Strategy.
 *
 * Responsibilities
 * ----------------
 * - Validate JWT access tokens issued by the FastAPI authentication service.
 * - Verify signature, issuer, audience and expiration.
 * - Extract the authenticated user payload.
 * - Provide the authenticated user to Passport guards.
 *
 * Notes
 * -----
 * - FastAPI is the authentication owner.
 * - NestJS NEVER generates JWT tokens.
 * - NestJS ONLY validates incoming JWT access tokens.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Passport JWT
 * - Node.js 22+
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

import { JwtPayload } from '../../common/interfaces';

/**
 * Enterprise JWT authentication strategy.
 *
 * This strategy validates JWT access tokens produced by
 * the FastAPI authentication service.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    const jwtOptions: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: configService.getOrThrow<string>('jwt.secret'),

      issuer: configService.getOrThrow<string>('jwt.issuer'),

      audience: configService.getOrThrow<string>('jwt.audience'),

      algorithms: ['HS256'],
    };

    super(jwtOptions);
  }

  /**
   * Validates the decoded JWT payload.
   *
   * Passport automatically verifies:
   * - Signature
   * - Expiration
   * - Issuer
   * - Audience
   *
   * This method is responsible only for returning the
   * authenticated user object that will later be attached
   * to request.user.
   *
   * @param payload Decoded JWT payload.
   * @returns Authenticated user payload.
   */
  override validate(payload: JwtPayload): JwtPayload {
    console.log('===== JWT PAYLOAD =====');
    console.log(payload);
    console.log('=======================');

    return payload;
  }
}
