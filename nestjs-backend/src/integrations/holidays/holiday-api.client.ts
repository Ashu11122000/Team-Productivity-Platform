/*
 * ============================================================================
 * File: holiday-api.client.ts
 * ============================================================================
 *
 * Holiday API HTTP Client
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Communicate with external holiday providers.
 * - Execute HTTP requests.
 * - Handle integration failures.
 * - Return provider responses.
 *
 * Does NOT:
 * ----------------------------------------------------------------------------
 * - Contain calendar business logic.
 * - Map API responses.
 * - Access repositories.
 *
 *
 * Architecture:
 *
 * Calendar Service
 *        |
 *        ↓
 * Holiday API Service
 *        |
 *        ↓
 * Holiday API Client
 *        |
 *        ↓
 * External API
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
export class HolidayApiClient {
  private readonly baseUrl = process.env.HOLIDAY_API_URL;

  constructor(private readonly httpService: HttpService) {}

  /**
   * ==========================================================================
   * GET Request
   * ==========================================================================
   *
   * Generic GET wrapper for holiday providers.
   *
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
    } catch {
      throw new IntegrationException('Holiday API request failed');
    }
  }

  /**
   * ==========================================================================
   * GET Holidays By Country
   * ==========================================================================
   *
   * Common operation used by Calendar module.
   *
   * Example:
   *
   * GET /holidays?country=IN&year=2026
   *
   * ==========================================================================
   */

  async getHolidays<T>(
    country: string,

    year: number,
  ): Promise<T> {
    return this.get<T>(
      '/holidays',

      {
        params: {
          country,

          year,
        },
      },
    );
  }
}
