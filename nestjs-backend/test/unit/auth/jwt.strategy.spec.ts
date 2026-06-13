/* eslint-disable prettier/prettier */

import { ConfigService } from '@nestjs/config';

import { JwtStrategy } from '../../../src/auth/strategies/jwt.strategy';

import type { JwtPayload } from '../../../src/common/interfaces/jwt-payload.interface';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    const configService = {
      getOrThrow: jest.fn((key: string) => {
        const values: Record<string, string> = {
          'jwt.secret': 'test-secret',
          'jwt.issuer': 'fastapi-backend',
          'jwt.audience': 'team-productivity-platform',
        };

        return values[key];
      }),
    } as unknown as ConfigService;

    strategy = new JwtStrategy(configService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should return payload from validate()', () => {
    const payload: JwtPayload = {
      sub: 'user-123',
      email: 'user@example.com',
      role: 'USER',
      iss: 'fastapi-backend',
      aud: 'team-productivity-platform',
      type: 'access',
    };

    expect(
      strategy.validate(payload),
    ).toEqual(payload);
  });
});