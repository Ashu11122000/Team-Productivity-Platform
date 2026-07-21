/*
 * ============================================================================
 * File: calendar-filter.interface.ts
 * ============================================================================
 *
 * Enterprise Calendar Filter Interface
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Defines the internal filtering contract used by CalendarService and
 *   calendar providers.
 * - Decouples HTTP request DTOs from provider implementations.
 * - Supports filtering calendar events from multiple sources.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Interface only
 * - Strongly typed
 * - No business logic
 * - Provider independent
 * - Reusable across the Calendar module
 *
 * Notes
 * ----------------------------------------------------------------------------
 * Controllers receive HolidayQueryDto (or future CalendarQueryDto).
 * Services convert request DTOs into CalendarFilter.
 * Providers consume CalendarFilter to retrieve the required events.
 *
 * This interface is intentionally independent of any external calendar
 * provider (Google Calendar, Outlook, Nager.Date, Calendarific, etc.).
 * ============================================================================
 */

export interface CalendarFilter {
  /**
   * Country ISO 3166-1 alpha-2 code.
   */
  country: string;

  /**
   * Calendar year.
   */
  year: number;

  /**
   * Optional month filter.
   */
  month?: number;

  /**
   * Holiday or event type.
   */
  type?: string;

  /**
   * Start date filter.
   */
  fromDate?: Date;

  /**
   * End date filter.
   */
  toDate?: Date;

  /**
   * Whether holidays should be included.
   */
  includeHolidays?: boolean;

  /**
   * Whether reminders should be included.
   */
  includeReminders?: boolean;

  /**
   * Whether tasks should be included.
   */
  includeTasks?: boolean;

  /**
   * Whether notifications should be included.
   */
  includeNotifications?: boolean;
}
