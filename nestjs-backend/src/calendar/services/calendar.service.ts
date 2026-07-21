/*
 * ============================================================================
 * File: calendar.service.ts
 * ============================================================================
 *
 * Enterprise Calendar Service
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Coordinate Calendar business operations.
 * - Build provider filters.
 * - Delegate data retrieval to CalendarProvider.
 * - Delegate transformations to CalendarMapper.
 * - Return DTOs only.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Clean Architecture
 * - Service Layer Pattern
 * - Provider Pattern
 * - Mapper Pattern
 * - SOLID
 * - DRY
 *
 * Notes
 * ----------------------------------------------------------------------------
 * Calendar module does not use TypeORM.
 *
 * Data flow:
 *
 * Controller
 *      |
 *      ▼
 * CalendarService
 *      |
 *      ▼
 * CalendarProvider
 *      |
 *      ▼
 * HolidayProvider / External APIs
 *      |
 *      ▼
 * CalendarMapper
 *      |
 *      ▼
 * Response DTO
 *
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';

import { CalendarResponseDto } from '../dto/calendar-response.dto';
import { HolidayQueryDto } from '../dto/holiday-query.dto';

import { CalendarFilter } from '../interfaces/calendar-filter.interface';

import { CalendarMapper } from '../mappers/calendar.mapper';

import { CalendarProvider } from '../providers/calendar.provider';
import { HolidayResponseDto } from '../dto/holiday-response.dto';
import { CalendarOverviewDto } from '../dto/calendar-overview.dto';

@Injectable()
export class CalendarService {
  constructor(
    private readonly calendarProvider: CalendarProvider,

    private readonly calendarMapper: CalendarMapper,
  ) {}

  /**
   * ==========================================================================
   * Returns calendar events.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Convert query DTO into internal filter.
   * - Retrieve events from CalendarProvider.
   * - Convert internal models into response DTOs.
   *
   * @param query Calendar query parameters.
   * @returns Calendar response DTO.
   */
  public async getCalendar(
    query: HolidayQueryDto,
  ): Promise<CalendarResponseDto> {
    const filter = this.createFilter(query);

    const events = await this.calendarProvider.getEvents(filter);

    return this.calendarMapper.toCalendarResponseDto(events);
  }

  /**
   * ==========================================================================
   * Returns calendar overview data.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Retrieve calendar events.
   * - Generate dashboard-friendly calendar overview.
   * - Delegate transformation to CalendarMapper.
   *
   * @param query Calendar query parameters.
   * @returns Calendar overview DTO.
   */
  public async getOverview(
    query: HolidayQueryDto,
  ): Promise<CalendarOverviewDto> {
    const filter = this.createFilter(query);

    const events = await this.calendarProvider.getEvents(filter);

    return this.calendarMapper.toCalendarOverviewDto(events);
  }

  /**
   * ==========================================================================
   * Returns public holidays.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Retrieve holiday events.
   * - Filter only holiday type events.
   * - Convert them into HolidayResponseDto objects.
   *
   * @param query Holiday query parameters.
   * @returns Holiday response DTO collection.
   */
  public async getHolidays(
    query: HolidayQueryDto,
  ): Promise<HolidayResponseDto[]> {
    const filter = this.createFilter(query);

    const events = await this.calendarProvider.getEvents(filter);

    const holidays = events.filter((event) => event.type === 'HOLIDAY');

    return holidays.map((holiday) => ({
      id: holiday.id,

      name: holiday.title,

      date: holiday.date,

      country: filter.country,

      type: 'PUBLIC',

      allDay: holiday.allDay,

      description: holiday.description,

      metadata: holiday.metadata,
    }));
  }

  /**
   * ==========================================================================
   * Creates an internal calendar filter.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Convert HTTP query DTO into internal provider filter.
   * - Keep providers independent from HTTP contracts.
   * - Apply default values.
   *
   * @param query Holiday query DTO.
   * @returns Calendar filter.
   */
  private createFilter(query: HolidayQueryDto): CalendarFilter {
    return {
      country: query.country ?? 'IN',

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
