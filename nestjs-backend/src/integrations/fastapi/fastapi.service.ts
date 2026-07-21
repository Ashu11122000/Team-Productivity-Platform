/*
 * ============================================================================
 * File: fastapi.service.ts
 * ============================================================================
 *
 * FastAPI Integration Service
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Provide application-level access to FastAPI APIs.
 * - Coordinate FastAPI client calls.
 * - Hide external API communication details.
 * - Provide reusable methods for NestJS modules.
 *
 * Does NOT:
 * ----------------------------------------------------------------------------
 * - Manage authentication sessions.
 * - Create users.
 * - Access databases.
 * - Contain business rules.
 *
 *
 * Architecture:
 *
 * Feature Service
 *        |
 *        ↓
 * FastApiService
 *        |
 *        ↓
 * FastApiClient
 *        |
 *        ↓
 * FastAPI
 *
 *
 * Compatible:
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - TypeScript 5+
 *
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';

import { FastApiClient } from './fastapi.client';

import {
  FastApiAuthenticatedUser,
  FastApiProfileResponse,
  FastApiTokenValidationResponse,
  FastApiUser,
} from './fastapi.interface';

import { IntegrationException } from '../../common/exceptions';

@Injectable()
export class FastApiService {
  constructor(private readonly client: FastApiClient) {}

  /**
   * ==========================================================================
   * Get Current User
   * ==========================================================================
   */

  async getCurrentUser(token: string): Promise<FastApiUser> {
    try {
      return await this.client.get<FastApiUser>(
        '/api/v1/users/me',

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch {
      throw new IntegrationException(
        'Unable to fetch current user from FastAPI',
      );
    }
  }

  /**
   * ==========================================================================
   * Validate JWT Token
   * ==========================================================================
   *
   * FastAPI owns authentication.
   * NestJS only consumes validation result.
   *
   * ==========================================================================
   */

  async validateToken(token: string): Promise<FastApiTokenValidationResponse> {
    try {
      return await this.client.get<FastApiTokenValidationResponse>(
        '/api/v1/auth/validate',

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch {
      throw new IntegrationException('FastAPI token validation failed');
    }
  }

  /**
   * ==========================================================================
   * Get User Profile
   * ==========================================================================
   */

  async getProfile(
    userId: string,
    token?: string,
  ): Promise<FastApiProfileResponse> {
    try {
      return await this.client.get<FastApiProfileResponse>(
        `/api/v1/users/${userId}`,

        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        },
      );
    } catch {
      throw new IntegrationException('Unable to fetch FastAPI user profile');
    }
  }

  /**
   * ==========================================================================
   * Get Authenticated User Context
   * ==========================================================================
   *
   * Combines:
   *
   * Token validation
   * +
   * User context
   *
   * ==========================================================================
   */

  async getAuthenticatedUser(token: string): Promise<FastApiAuthenticatedUser> {
    const validation = await this.validateToken(token);

    if (!validation.valid || !validation.user) {
      throw new IntegrationException('Invalid FastAPI authentication token');
    }

    return {
      user: validation.user,
    };
  }
}
