/* eslint-disable prettier/prettier */

import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

import { RolesGuard } from '../../../src/auth/guards/roles.guard';

import type { Role } from '../../../src/common/constants/roles.constants';

describe('RolesGuard', () => {
  let guard: RolesGuard;

  let reflector: Reflector;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as Reflector;

    guard = new RolesGuard(reflector);
  });

  const createContext = (role: Role): ExecutionContext =>
    ({
      getHandler: jest.fn(),

      getClass: jest.fn(),

      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            role,
          },
        }),
      }),
    }) as unknown as ExecutionContext;

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access when no roles required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const result = guard.canActivate(
      createContext('USER'),
    );

    expect(result).toBe(true);
  });

  it('should allow access when role matches', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(['USER' as Role]);

    const result = guard.canActivate(
      createContext('USER'),
    );

    expect(result).toBe(true);
  });

  it('should deny access when role does not match', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(['ADMIN' as Role]);

    const result = guard.canActivate(
      createContext('USER'),
    );

    expect(result).toBe(false);
  });
});