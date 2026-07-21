/*
 * ============================================================================
 * File: calendar.mapper.ts
 * ============================================================================
 *
 * Enterprise Calendar Mapper
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Transforms provider models into API response DTOs.
 * - Prevents provider implementations from leaking outside the service layer.
 * - Centralizes all Calendar module mapping logic.
 * - Provides reusable transformation methods.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Stateless
 * - Pure transformation layer
 * - No business logic
 * - No provider access
 * - No HTTP concerns
 * - SOLID
 *
 * Mapping Flow
 * ----------------------------------------------------------------------------
 *
 * Holiday
 *      │
 *      ▼
 * CalendarMapper
 *      │
 *      ▼
 * HolidayResponseDto
 *
 * CalendarEvent
 *      │
 *      ▼
 * CalendarMapper
 *      │
 *      ▼
 * CalendarEventDto
 *
 * CalendarEvent[]
 *      │
 *      ▼
 * CalendarResponseDto
 *
 * CalendarEvent[]
 *      │
 *      ▼
 * CalendarOverviewDto
 *
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';

import { CalendarEventDto } from '../dto/calendar-event.dto';
import { CalendarOverviewDto } from '../dto/calendar-overview.dto';
import { CalendarResponseDto } from '../dto/calendar-response.dto';
import { HolidayResponseDto } from '../dto/holiday-response.dto';

import { CalendarEvent } from '../interfaces/calendar-event.interface';
import { Holiday } from '../interfaces/holiday.interface';

@Injectable()
export class CalendarMapper {
  /**
   * ==========================================================================
   * Converts a Holiday into a HolidayResponseDto.
   * ==========================================================================
   *
   * @param holiday Holiday model.
   * @returns Holiday response DTO.
   */
  public toHolidayResponseDto(holiday: Holiday): HolidayResponseDto {
    return {
      id: holiday.id,
      name: holiday.name,
      date: holiday.date,
      country: holiday.country,
      type: holiday.type,
      allDay: holiday.allDay,
      localName: holiday.localName,
      description: holiday.description,
      metadata: holiday.metadata,
    };
  }

  /**
   * ==========================================================================
   * Converts a collection of Holiday objects into HolidayResponseDto objects.
   * ==========================================================================
   *
   * @param holidays Holiday collection.
   * @returns Holiday response DTO collection.
   */
  public toHolidayResponseDtoList(holidays: Holiday[]): HolidayResponseDto[] {
    return holidays.map((holiday) => this.toHolidayResponseDto(holiday));
  }

  /**
   * ==========================================================================
   * Converts a CalendarEvent into a CalendarEventDto.
   * ==========================================================================
   *
   * @param event Calendar event.
   * @returns Calendar event response DTO.
   */
  public toCalendarEventDto(event: CalendarEvent): CalendarEventDto {
    return {
      id: event.id,

      title: event.title,

      description: event.description,

      date: event.date,

      type: event.type,

      color: event.color,

      allDay: event.allDay,

      url: event.url,

      metadata: event.metadata,
    };
  }

  /**
   * ==========================================================================
   * Converts a collection of CalendarEvent objects into
   * CalendarEventDto objects.
   * ==========================================================================
   *
   * @param events Calendar event collection.
   * @returns Calendar event response DTO collection.
   */
  public toCalendarEventDtoList(events: CalendarEvent[]): CalendarEventDto[] {
    return events.map((event) => this.toCalendarEventDto(event));
  }

  /**
   * ==========================================================================
   * Converts calendar events into a CalendarResponseDto.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Transform internal CalendarEvent models into CalendarEventDto objects.
   * - Build the standard Calendar API response.
   * - Prevent internal models from leaking outside the service layer.
   *
   * @param events Calendar events.
   * @returns Calendar response DTO.
   */
  public toCalendarResponseDto(events: CalendarEvent[]): CalendarResponseDto {
    return {
      events: this.toCalendarEventDtoList(events),

      total: events.length,

      hasMore: false,

      generatedAt: new Date(),
    };
  }

  /**
   * ==========================================================================
   * Converts calendar events into a CalendarOverviewDto.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Group calendar events by business type.
   * - Generate dashboard-friendly calendar overview data.
   * - Transform internal models into response DTOs.
   * - Prevent internal models from leaking outside the module.
   *
   * @param events Calendar events.
   * @returns Calendar overview response DTO.
   */
  public toCalendarOverviewDto(events: CalendarEvent[]): CalendarOverviewDto {
    const eventDtos = this.toCalendarEventDtoList(events);

    const holidays = eventDtos.filter((event) => event.type === 'HOLIDAY');

    const tasks = eventDtos.filter((event) => event.type === 'TASK');

    const reminders = eventDtos.filter((event) => event.type === 'REMINDER');

    const notifications = eventDtos.filter(
      (event) => event.type === 'NOTIFICATION',
    );

    const upcomingEvents = eventDtos
      .filter((event) => event.date >= new Date())
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return {
      events: eventDtos,

      upcomingEvents,

      holidays,

      tasks,

      reminders,

      notifications,

      totalEvents: eventDtos.length,

      totalHolidays: holidays.length,

      totalReminders: reminders.length,

      totalTasks: tasks.length,

      totalNotifications: notifications.length,
    };
  }
}
