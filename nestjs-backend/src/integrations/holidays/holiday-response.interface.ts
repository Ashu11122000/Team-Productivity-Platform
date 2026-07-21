/*
 * ============================================================================
 * File: holiday-response.interface.ts
 * ============================================================================
 *
 * External Holiday Provider Response Interfaces
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Describe raw responses from external holiday APIs.
 * - Isolate provider-specific structures.
 * - Provide type safety for API clients.
 *
 * Does NOT:
 * ----------------------------------------------------------------------------
 * - Contain business logic.
 * - Map calendar data.
 * - Validate application rules.
 *
 *
 * Architecture:
 *
 * External Holiday API
 *
 *        ↓
 *
 * HolidayResponse Interfaces
 *
 *        ↓
 *
 * HolidayApiService
 *
 *        ↓
 *
 * Calendar Module
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
// Raw Holiday Item From Provider
// ============================================================================

export interface HolidayResponseItem {
  /**
   * Holiday name from provider.
   *
   * Example:
   *
   * Republic Day
   */
  name: string;

  /**
   * Holiday date.
   *
   * Provider usually returns:
   *
   * YYYY-MM-DD
   */
  date: string;

  /**
   * Country code.
   *
   * Example:
   *
   * IN
   */
  country?: string;

  /**
   * Holiday category.
   *
   * Example:
   *
   * Public Holiday
   */
  type?: string;

  /**
   * Provider description.
   */
  description?: string;

  /**
   * Provider unique identifier.
   */
  id?: string;

  /**
   * Optional ISO weekday.
   */
  weekday?: string;
}

// ============================================================================
// Raw Holiday API Response
// ============================================================================

export interface HolidayApiRawResponse {
  /**
   * Provider success flag.
   */
  success?: boolean;

  /**
   * Provider message.
   */
  message?: string;

  /**
   * Raw holiday collection.
   */
  holidays: HolidayResponseItem[];
}

// ============================================================================
// Provider Error Response
// ============================================================================

export interface HolidayApiErrorResponse {
  /**
   * HTTP status.
   */
  statusCode?: number;

  /**
   * Provider error message.
   */
  message: string;

  /**
   * Provider error code.
   */
  code?: string;
}

// ============================================================================
// Provider Pagination Metadata
// ============================================================================
//
// Some holiday APIs return pagination metadata.
// Kept optional for provider compatibility.
//
// ============================================================================

export interface HolidayApiPagination {
  page?: number;

  limit?: number;

  total?: number;

  totalPages?: number;
}

// ============================================================================
// Complete Provider Response
// ============================================================================

export interface HolidayApiProviderResponse {
  data: HolidayResponseItem[];

  pagination?: HolidayApiPagination;

  success?: boolean;

  message?: string;
}
