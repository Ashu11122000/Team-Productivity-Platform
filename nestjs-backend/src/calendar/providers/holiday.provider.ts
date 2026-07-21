/*
 * ============================================================================
 * File: holiday.provider.ts
 * ============================================================================
 *
 * Enterprise Holiday Provider
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Retrieve public holiday data.
 * - Abstract external holiday API communication.
 * - Normalize external responses into internal Holiday models.
 * - Hide third-party provider details from Calendar module.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Provider Pattern
 * - Single Responsibility Principle
 * - External integration isolation
 * - No DTO transformation
 * - No controller dependency
 * - No HTTP logic
 *
 *
 * Architecture:
 *
 * CalendarService
 *        |
 *        ↓
 * HolidayProvider
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
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';

import { HolidayQueryDto } from '../dto/holiday-query.dto';

import { CalendarFilter } from '../interfaces/calendar-filter.interface';

import { Holiday } from '../interfaces/holiday.interface';

import {
  HolidayApiService,
  CalendarHoliday,
} from '../../integrations/holidays';

@Injectable()
export class HolidayProvider {
  constructor(private readonly holidayApiService: HolidayApiService) {}

  /**
   * ==========================================================================
   * Returns holidays based on calendar filters.
   * ==========================================================================
   *
   * Responsibilities:
   * --------------------------------------------------------------------------
   * - Call external holiday integration.
   * - Convert integration models into Calendar models.
   *
   * @param filter Calendar filter.
   * @returns Holiday collection.
   * ==========================================================================
   */

  public async getHolidays(filter: CalendarFilter): Promise<Holiday[]> {
    const holidays: CalendarHoliday[] =
      await this.holidayApiService.getHolidays(filter.country, filter.year);

    return holidays.map((holiday) => ({
      id: holiday.id ?? `${filter.country}-${filter.year}-${holiday.title}`,

      name: holiday.title,

      date: holiday.date,

      country: holiday.country,

      type: 'PUBLIC',

      allDay: true,

      description: holiday.description,

      metadata: {
        provider: 'holiday-api',
      },
    }));
  }

  /**
   * ==========================================================================
   * Converts HolidayQueryDto into CalendarFilter.
   * ==========================================================================
   *
   * This keeps HTTP DTOs isolated from providers.
   *
   * ==========================================================================
   */

  public createFilter(query: HolidayQueryDto): CalendarFilter {
    return {
      country: query.country,

      year: query.year,

      month: query.month,

      type: query.type,

      fromDate: query.fromDate,

      toDate: query.toDate,

      includeHolidays: true,

      includeTasks: false,

      includeReminders: false,

      includeNotifications: false,
    };
  }
}
