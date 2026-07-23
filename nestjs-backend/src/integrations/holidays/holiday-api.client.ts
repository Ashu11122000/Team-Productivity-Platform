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
 * OpenHolidays API
 *
 *
 * Compatible:
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - Axios
 * - OpenHolidays API
 *
 * ============================================================================
 */

import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { AxiosError, AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';

import { IntegrationException } from '../../common/exceptions';

@Injectable()
export class HolidayApiClient {
  private readonly logger = new Logger(HolidayApiClient.name);

  private readonly baseUrl =
    process.env.HOLIDAY_API_URL ?? 'https://openholidaysapi.org';

  private readonly language = process.env.HOLIDAY_LANGUAGE ?? 'EN';

  constructor(private readonly httpService: HttpService) {}

  /**
   * ==========================================================================
   * Generic GET Request
   * ==========================================================================
   */

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;

      this.logger.log(`Calling Holiday API: ${url}`);

      const response = await firstValueFrom(
        this.httpService.get<T>(url, {
          timeout: 10000,
          ...config,
        }),
      );

      this.logger.log(`Status: ${response.status}`);

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;

      this.logger.error(axiosError.response?.data ?? axiosError.message);

      throw new IntegrationException(
        axiosError.response?.statusText ??
          axiosError.message ??
          'Holiday API request failed',
      );
    }
  }

  /**
   * ==========================================================================
   * Get Public Holidays
   * ==========================================================================
   *
   * OpenHolidays API
   *
   * GET /PublicHolidays
   *
   * ==========================================================================
   */

  async getHolidays<T>(country: string, year: number): Promise<T> {
    return this.get<T>('/PublicHolidays', {
      params: {
        countryIsoCode: country,
        languageIsoCode: this.language,
        validFrom: `${year}-01-01`,
        validTo: `${year}-12-31`,
      },
    });
  }
}
