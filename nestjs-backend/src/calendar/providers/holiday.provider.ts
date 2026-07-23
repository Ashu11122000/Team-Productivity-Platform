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
 * External Holiday API (Nager.Date)
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
   */

  public async getHolidays(filter: CalendarFilter): Promise<Holiday[]> {
    const country = filter.country ?? process.env.HOLIDAY_COUNTRY ?? 'IN';

    const year = filter.year ?? new Date().getFullYear();

    const holidays: CalendarHoliday[] =
      await this.holidayApiService.getHolidays(country, year);

    return holidays.map((holiday) => ({
      id: holiday.id ?? `${country}-${year}-${holiday.title}`,

      name: holiday.title,

      date: holiday.date,

      country: holiday.country,

      type: 'PUBLIC',

      allDay: true,

      description: holiday.description,

      metadata: {
        provider: 'nager-date',
      },
    }));
  }

  /**
   * ==========================================================================
   * Converts HolidayQueryDto into CalendarFilter.
   * ==========================================================================
   */

  public createFilter(query: HolidayQueryDto): CalendarFilter {
    return {
      country: query.country ?? process.env.HOLIDAY_COUNTRY ?? 'IN',

      year: query.year ?? new Date().getFullYear(),

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
