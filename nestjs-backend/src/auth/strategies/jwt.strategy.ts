/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { PassportStrategy } from '@nestjs/passport';

import {
  ExtractJwt,
  Strategy,
  type StrategyOptionsWithoutRequest,
} from 'passport-jwt';

import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
) {
  constructor(
    private readonly configService: ConfigService,
  ) {
    const options: StrategyOptionsWithoutRequest = {
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey:
        configService.getOrThrow<string>(
          'jwt.secret',
        ),

      issuer:
        configService.getOrThrow<string>(
          'jwt.issuer',
        ),

      audience:
        configService.getOrThrow<string>(
          'jwt.audience',
        ),
    };

    super(options);
  }

  validate(
    payload: JwtPayload,
  ): JwtPayload {
    return payload;
  }
}