/*
 * ============================================================================
 * File: calendar.provider.ts
 * ============================================================================
 *
 * Enterprise Calendar Provider
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Aggregate calendar events from multiple providers.
 * - Normalize different event sources into CalendarEvent models.
 * - Hide external provider implementations from CalendarService.
 * - Provide a single calendar data access point.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Provider Pattern
 * - Single Responsibility Principle
 * - No DTO transformation
 * - No HTTP logic
 * - No controller concerns
 *
 * Notes
 * ----------------------------------------------------------------------------
 * This provider does not return DTOs.
 * CalendarMapper is responsible for converting CalendarEvent models into DTOs.
 *
 * Future integrations:
 * - Google Calendar
 * - Microsoft Outlook Calendar
 * - Task events
 * - Reminder events
 * - Notification events
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';

import { CalendarEvent } from '../interfaces/calendar-event.interface';
import { CalendarFilter } from '../interfaces/calendar-filter.interface';

import { HolidayProvider } from './holiday.provider';

@Injectable()
export class CalendarProvider {
  constructor(private readonly holidayProvider: HolidayProvider) {}

  /**
   * ==========================================================================
   * Returns calendar events based on provided filters.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Fetch events from enabled providers.
   * - Merge all event sources.
   * - Return normalized CalendarEvent objects.
   *
   * @param filter Calendar filter.
   * @returns Calendar events.
   */
  public async getEvents(filter: CalendarFilter): Promise<CalendarEvent[]> {
    const events: CalendarEvent[] = [];

    /**
     * Fetch holidays.
     */
    if (filter.includeHolidays !== false) {
      const holidays = await this.holidayProvider.getHolidays(filter);

      if (holidays && Array.isArray(holidays)) {
        events.push(
          ...holidays.map((holiday) => ({
            id: holiday.id,

            title: holiday.name,

            description: holiday.description,

            date: holiday.date,

            type: 'HOLIDAY' as const,

            color: '#EF4444',

            allDay: holiday.allDay,

            metadata: holiday.metadata,
          })),
        );
      }
    }

    /**
     * Future integrations:
     *
     * if (filter.includeTasks) {
     *    events.push(...taskEvents);
     * }
     *
     * if (filter.includeReminders) {
     *    events.push(...reminderEvents);
     * }
     *
     * if (filter.includeNotifications) {
     *    events.push(...notificationEvents);
     * }
     */

    return events;
  }
}
