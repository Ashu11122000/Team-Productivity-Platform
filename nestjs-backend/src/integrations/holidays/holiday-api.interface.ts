/*
 * ============================================================================
 * File: holiday-api.interface.ts
 * ============================================================================
 *
 * Holiday API Integration Interfaces
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define external holiday provider contracts.
 * - Describe request and response structures.
 * - Provide type safety for integration layer.
 *
 * Does NOT:
 * ----------------------------------------------------------------------------
 * - Contain business rules.
 * - Perform validation.
 * - Map calendar DTOs.
 *
 *
 * Architecture:
 *
 * Holiday Provider API
 *          |
 *          ↓
 * HolidayApiClient
 *          |
 *          ↓
 * Interfaces
 *          |
 *          ↓
 * HolidayApiService
 *
 *
 * Compatible:
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - TypeScript 5+
 *
 * ============================================================================
 */

// ============================================================================
// Holiday API Request
// ============================================================================

export interface HolidayApiRequest {
  /**
   * ISO country code.
   *
   * Example:
   *
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
// Holiday Item Response
// ============================================================================

export interface HolidayApiHoliday {
  /**
   * Holiday name.
   */
  name: string;

  /**
   * Holiday date.
   *
   * Format depends on provider.
   */
  date: string;

  /**
   * Country code.
   */
  country?: string;

  /**
   * Holiday type.
   *
   * Example:
   *
   * Public
   * National
   */
  type?: string;

  /**
   * Optional description.
   */
  description?: string;

  /**
   * Provider identifier.
   */
  id?: string;
}

// ============================================================================
// Holiday API Response
// ============================================================================

export interface HolidayApiResponse {
  /**
   * Provider status.
   */
  success?: boolean;

  /**
   * Returned holidays.
   */
  holidays: HolidayApiHoliday[];

  /**
   * Optional provider message.
   */
  message?: string;
}

// ============================================================================
// Holiday Provider Metadata
// ============================================================================

export interface HolidayProviderInfo {
  /**
   * Provider name.
   */
  provider: string;

  /**
   * API version.
   */
  version?: string;

  /**
   * Last synchronization time.
   */
  fetchedAt?: Date;
}

// ============================================================================
// Calendar Holiday Domain Contract
// ============================================================================
//
// Used after provider transformation.
// Calendar module can consume this format without
// knowing external API structure.
//

// ============================================================================

export interface CalendarHoliday {
  id?: string;

  title: string;

  date: Date;

  country: string;

  description?: string;
}
