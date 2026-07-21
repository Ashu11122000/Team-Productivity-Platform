/*
 * ============================================================================
 * File: holiday-api.service.ts
 * ============================================================================
 *
 * Holiday API Integration Service
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Provide application-level access to holiday provider.
 * - Coordinate holiday API requests.
 * - Transform external responses into internal contracts.
 * - Hide provider implementation details.
 *
 * Does NOT:
 * ----------------------------------------------------------------------------
 * - Manage calendar rules.
 * - Store holidays.
 * - Access repositories.
 *
 *
 * Architecture:
 *
 * CalendarService
 *        |
 *        ↓
 * HolidayApiService
 *        |
 *        ↓
 * HolidayApiClient
 *        |
 *        ↓
 * External Holiday API
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

import { HolidayApiClient } from './holiday-api.client';

import { CalendarHoliday, HolidayApiResponse } from './holiday-api.interface';

import { IntegrationException } from '../../common/exceptions';

@Injectable()
export class HolidayApiService {
  constructor(private readonly client: HolidayApiClient) {}

  /**
   * ==========================================================================
   * Get Holidays
   * ==========================================================================
   *
   * Fetch holidays from external provider.
   *
   * Converts:
   *
   * HolidayApiHoliday
   *
   * into:
   *
   * CalendarHoliday
   *
   * ==========================================================================
   */

  async getHolidays(country: string, year: number): Promise<CalendarHoliday[]> {
    try {
      const response = await this.client.getHolidays<HolidayApiResponse>(
        country,

        year,
      );

      if (!response || !response.holidays) {
        throw new IntegrationException('Invalid holiday provider response');
      }

      return response.holidays.map((holiday) => ({
        id: holiday.id,

        title: holiday.name,

        date: new Date(holiday.date),

        country: holiday.country ?? country,

        description: holiday.description,
      }));
    } catch (error) {
      if (error instanceof IntegrationException) {
        throw error;
      }

      throw new IntegrationException('Unable to fetch holidays from provider');
    }
  }

  /**
   * ==========================================================================
   * Get Current Year Holidays
   * ==========================================================================
   *
   * Convenience wrapper.
   *
   * ==========================================================================
   */

  async getCurrentYearHolidays(country: string): Promise<CalendarHoliday[]> {
    const year = new Date().getFullYear();

    return this.getHolidays(country, year);
  }

  /**
   * ==========================================================================
   * Get Next Year Holidays
   * ==========================================================================
   *
   * Useful for calendar planning.
   *
   * ==========================================================================
   */

  async getNextYearHolidays(country: string): Promise<CalendarHoliday[]> {
    const year = new Date().getFullYear() + 1;

    return this.getHolidays(country, year);
  }
}
