/*
 * ============================================================================
 * File: fastapi.client.ts
 * ============================================================================
 *
 * FastAPI HTTP Client
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Communicate with FastAPI backend.
 * - Execute HTTP requests.
 * - Handle integration level errors.
 * - Return raw API responses.
 *
 * Does NOT:
 * ----------------------------------------------------------------------------
 * - Contain business logic.
 * - Map DTOs.
 * - Validate application rules.
 *
 *
 * Architecture:
 *
 * FastAPI Service
 *        |
 *        ↓
 * FastAPI Client
 *        |
 *        ↓
 * HTTP API
 *
 *
 * Compatible:
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - Axios
 *
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';

import { AxiosRequestConfig } from 'axios';

import { firstValueFrom } from 'rxjs';

import { IntegrationException } from '../../common/exceptions';

@Injectable()
export class FastApiClient {
  private readonly baseUrl = process.env.FASTAPI_BASE_URL;

  constructor(private readonly httpService: HttpService) {}

  /**
   * ==========================================================================
   * GET Request
   * ==========================================================================
   */

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<T>(
          `${this.baseUrl}${endpoint}`,

          {
            timeout: 5000,

            ...config,
          },
        ),
      );

      return response.data;
    } catch (error) {
      throw new IntegrationException(
        `FastAPI request failed: ${endpoint} - ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * ==========================================================================
   * POST Request
   * ==========================================================================
   */

  async post<T>(
    endpoint: string,
    body: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<T>(
          `${this.baseUrl}${endpoint}`,

          body,

          {
            timeout: 5000,

            ...config,
          },
        ),
      );

      return response.data;
    } catch (error) {
      throw new IntegrationException(
        `FastAPI request failed: ${endpoint} - ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * ==========================================================================
   * PATCH Request
   * ==========================================================================
   */

  async patch<T>(
    endpoint: string,
    body: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.patch<T>(
          `${this.baseUrl}${endpoint}`,

          body,

          {
            timeout: 5000,

            ...config,
          },
        ),
      );

      return response.data;
    } catch (error) {
      throw new IntegrationException(
        `FastAPI request failed: ${endpoint} - ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * ==========================================================================
   * DELETE Request
   * ==========================================================================
   */

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.delete<T>(
          `${this.baseUrl}${endpoint}`,

          {
            timeout: 5000,

            ...config,
          },
        ),
      );

      return response.data;
    } catch (error) {
      throw new IntegrationException(
        `FastAPI request failed: ${endpoint} - ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}
