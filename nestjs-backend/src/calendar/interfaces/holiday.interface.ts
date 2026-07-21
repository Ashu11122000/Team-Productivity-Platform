/*
 * ============================================================================
 * File: holiday.interface.ts
 * ============================================================================
 *
 * Enterprise Holiday Interface
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents the internal holiday model used within the Calendar module.
 * - Acts as the contract between holiday providers and CalendarMapper.
 * - Decouples provider implementations from API response DTOs.
 * - Supports multiple holiday providers through a common interface.
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
 * This interface is consumed internally by CalendarService and
 * CalendarMapper.
 *
 * Controllers should never return this interface directly.
 * CalendarMapper converts Holiday objects into HolidayResponseDto.
 * ============================================================================
 */

export interface Holiday {
  /**
   * Unique holiday identifier.
   */
  id: string;

  /**
   * Holiday name.
   */
  name: string;

  /**
   * Holiday date.
   */
  date: Date;

  /**
   * ISO 3166-1 alpha-2 country code.
   */
  country: string;

  /**
   * Holiday type.
   */
  type: string;

  /**
   * Indicates whether the holiday lasts the entire day.
   */
  allDay: boolean;

  /**
   * Localized holiday name.
   */
  localName?: string;

  /**
   * Optional holiday description.
   */
  description?: string;

  /**
   * Additional provider-specific metadata.
   */
  metadata?: Record<string, unknown>;
}
