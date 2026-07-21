/*
 * ============================================================================
 * File: calendar.controller.ts
 * ============================================================================
 *
 * Enterprise Calendar Controller
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Expose Calendar REST endpoints.
 * - Validate incoming query DTOs.
 * - Delegate business operations to CalendarService.
 * - Return DTO responses only.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Thin Controller
 * - Clean Architecture
 * - DTO-only responses
 * - No provider access
 * - No business logic
 *
 * ============================================================================
 */

import { Controller, Get, Query } from '@nestjs/common';

import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CalendarResponseDto } from '../dto/calendar-response.dto';
import { HolidayQueryDto } from '../dto/holiday-query.dto';

import { CalendarService } from '../services/calendar.service';
import { HolidayResponseDto } from '../dto/holiday-response.dto';
import { CalendarOverviewDto } from '../dto/calendar-overview.dto';

@ApiTags('Calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  /**
   * ==========================================================================
   * Returns calendar events.
   * ==========================================================================
   *
   * @param query Calendar filters.
   * @returns Calendar response.
   */
  @Get()
  @ApiOperation({
    summary: 'Get calendar events',
    description: 'Returns calendar events based on provided filters.',
  })
  @ApiOkResponse({
    description: 'Calendar events retrieved successfully.',
    type: CalendarResponseDto,
  })
  public async getCalendar(
    @Query()
    query: HolidayQueryDto,
  ): Promise<CalendarResponseDto> {
    return this.calendarService.getCalendar(query);
  }

  /**
   * ==========================================================================
   * Returns calendar overview.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Return dashboard-friendly calendar data.
   * - Delegate processing to CalendarService.
   *
   * @param query Calendar filters.
   * @returns Calendar overview response.
   */
  @Get('overview')
  @ApiOperation({
    summary: 'Get calendar overview',
    description:
      'Returns aggregated calendar information grouped by event type.',
  })
  @ApiOkResponse({
    description: 'Calendar overview retrieved successfully.',
    type: CalendarOverviewDto,
  })
  public async getOverview(
    @Query()
    query: HolidayQueryDto,
  ): Promise<CalendarOverviewDto> {
    return this.calendarService.getOverview(query);
  }

  /**
   * ==========================================================================
   * Returns public holidays.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Retrieve holiday events.
   * - Return normalized holiday DTOs.
   *
   * @param query Holiday filters.
   * @returns Holiday response collection.
   */
  @Get('holidays')
  @ApiOperation({
    summary: 'Get public holidays',
    description: 'Returns public holidays based on country and year filters.',
  })
  @ApiOkResponse({
    description: 'Public holidays retrieved successfully.',
    type: [HolidayResponseDto],
  })
  public async getHolidays(
    @Query()
    query: HolidayQueryDto,
  ): Promise<HolidayResponseDto[]> {
    return this.calendarService.getHolidays(query);
  }
}
