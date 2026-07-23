/*
 * ============================================================================
 * File: holiday-api.interface.ts
 * ============================================================================
 *
 * Holiday API Integration Interfaces
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define OpenHolidays API contracts.
 * - Provide type safety for integration layer.
 * - Define internal Calendar holiday model.
 *
 * Compatible:
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - TypeScript 5+
 * - OpenHolidays API
 *
 * ============================================================================
 */

// ============================================================================
// Holiday API Request
// ============================================================================

export interface HolidayApiRequest {
  /**
   * ISO Country Code
   *
   * Example:
   * IN
   * US
   */
  country: string;

  /**
   * Requested year.
   */
  year: number;
}

// ============================================================================
// OpenHolidays Localized Text
// ============================================================================

export interface HolidayTranslation {
  language: string;

  text: string;
}

// ============================================================================
// OpenHolidays Holiday
// ============================================================================

export interface HolidayApiHoliday {
  /**
   * Provider identifier.
   */
  id: string;

  /**
   * Holiday start date.
   *
   * Example:
   * 2026-01-26
   */
  startDate: string;

  /**
   * Holiday end date.
   */
  endDate: string;

  /**
   * Localized holiday names.
   */
  name: HolidayTranslation[];

  /**
   * Regional applicability.
   */
  nationwide?: boolean;

  /**
   * Holiday subdivisions.
   */
  subdivisions?: string[];
}

// ============================================================================
// OpenHolidays Response
// ============================================================================
//
// OpenHolidays returns an array directly.
//
// [
//   {
//      ...
//   }
// ]
//
// ============================================================================

export type HolidayApiResponse = HolidayApiHoliday[];

// ============================================================================
// Provider Metadata
// ============================================================================

export interface HolidayProviderInfo {
  provider: string;

  version?: string;

  fetchedAt?: Date;
}

// ============================================================================
// Internal Calendar Holiday
// ============================================================================

export interface CalendarHoliday {
  id: string;

  title: string;

  date: Date;

  country: string;

  description?: string;
}
