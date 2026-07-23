/*
 * ============================================================================
 * File: holiday-api.service.ts
 * ============================================================================
 *
 * Holiday API Integration Service
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Provide application-level access to OpenHolidays API.
 * - Coordinate holiday API requests.
 * - Transform external responses into internal contracts.
 * - Hide provider implementation details.
 *
 * Compatible:
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - TypeScript 5+
 * - OpenHolidays API
 *
 * ============================================================================
 */

import { Injectable, Logger } from '@nestjs/common';

import { HolidayApiClient } from './holiday-api.client';

import {
  CalendarHoliday,
  HolidayApiHoliday,
  HolidayApiResponse,
} from './holiday-api.interface';

import { IntegrationException } from '../../common/exceptions';

@Injectable()
export class HolidayApiService {
  private readonly logger = new Logger(HolidayApiService.name);

  constructor(private readonly client: HolidayApiClient) {}

  /**
   * ==========================================================================
   * Get Holidays
   * ==========================================================================
   */

  async getHolidays(country: string, year: number): Promise<CalendarHoliday[]> {
    country = country || process.env.HOLIDAY_COUNTRY || 'IN';
    year = year || new Date().getFullYear();

    this.logger.log(`Fetching holidays for country=${country}, year=${year}`);

    try {
      const holidays = await this.client.getHolidays<HolidayApiResponse>(
        country,
        year,
      );

      if (!Array.isArray(holidays)) {
        this.logger.error(`Expected array but received ${typeof holidays}`);

        throw new IntegrationException('Invalid holiday provider response');
      }

      return holidays.map((holiday: HolidayApiHoliday): CalendarHoliday => ({
        id: holiday.id,

        title:
          holiday.name.find((item) => item.language === 'EN')?.text ??
          holiday.name[0]?.text ??
          'Unnamed Holiday',

        date: new Date(holiday.startDate),

        country,

        description: holiday.nationwide
          ? 'Nationwide Public Holiday'
          : 'Regional Public Holiday',
      }));
    } catch (error) {
      this.logger.error(
        'Holiday provider request failed',
        error instanceof Error ? error.stack : String(error),
      );

      if (error instanceof IntegrationException) {
        throw error;
      }

      throw new IntegrationException(
        'Unable to fetch holidays from OpenHolidays API',
      );
    }
  }

  /**
   * ==========================================================================
   * Get Current Year Holidays
   * ==========================================================================
   */

  async getCurrentYearHolidays(country: string): Promise<CalendarHoliday[]> {
    return this.getHolidays(country, new Date().getFullYear());
  }

  /**
   * ==========================================================================
   * Get Next Year Holidays
   * ==========================================================================
   */

  async getNextYearHolidays(country: string): Promise<CalendarHoliday[]> {
    return this.getHolidays(country, new Date().getFullYear() + 1);
  }
}
