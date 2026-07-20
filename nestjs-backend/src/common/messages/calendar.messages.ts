/**
 * ============================================================================
 * File: calendar.messages.ts
 * ============================================================================
 *
 * Calendar and holiday-related application messages.
 *
 * Responsibilities
 * ----------------
 * - Centralize calendar messages.
 * - Standardize holiday responses.
 * - Support external holiday API integration.
 * - Support scheduled synchronization jobs.
 *
 * Used By
 * -------
 * - Calendar Module
 * - Holiday Integration
 * - Scheduler Jobs
 * - Dashboard Module
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Scheduler
 * - External Holiday APIs
 * ============================================================================
 */

/**
 * ============================================================================
 * Calendar Success Messages
 * ============================================================================
 */
export const CalendarSuccessMessages = {
  /**
   * Holiday retrieval
   */
  HOLIDAY_FOUND: 'Holiday retrieved successfully.',

  HOLIDAYS_FETCHED: 'Holidays retrieved successfully.',

  /**
   * Calendar retrieval
   */
  CALENDAR_FETCHED: 'Calendar data retrieved successfully.',

  EVENTS_FETCHED: 'Calendar events retrieved successfully.',

  /**
   * Synchronization
   */
  SYNC_STARTED: 'Holiday synchronization started.',

  SYNC_COMPLETED: 'Holiday synchronization completed successfully.',

  CACHE_REFRESHED: 'Holiday cache refreshed successfully.',
} as const;

/**
 * ============================================================================
 * Calendar Error Messages
 * ============================================================================
 */
export const CalendarErrorMessages = {
  /**
   * Lookup
   */
  HOLIDAY_NOT_FOUND: 'Holiday not found.',

  CALENDAR_NOT_FOUND: 'Calendar information not found.',

  INVALID_DATE: 'Invalid calendar date.',

  INVALID_YEAR: 'Invalid calendar year.',

  /**
   * Operations
   */
  FETCH_FAILED: 'Unable to retrieve calendar information.',

  SYNC_FAILED: 'Unable to synchronize holidays.',

  CACHE_REFRESH_FAILED: 'Unable to refresh holiday cache.',

  /**
   * Configuration
   */
  INVALID_COUNTRY: 'Invalid country configuration.',

  UNSUPPORTED_COUNTRY: 'Country is not supported.',
} as const;

/**
 * ============================================================================
 * Calendar Validation Messages
 * ============================================================================
 */
export const CalendarValidationMessages = {
  COUNTRY_REQUIRED: 'Country code is required.',

  INVALID_COUNTRY_CODE: 'Invalid country code.',

  YEAR_REQUIRED: 'Year is required.',

  INVALID_YEAR_FORMAT: 'Invalid year format.',

  INVALID_DATE_RANGE: 'Invalid calendar date range.',
} as const;

/**
 * ============================================================================
 * Holiday Messages
 * ============================================================================
 */
export const HolidayMessages = {
  PUBLIC_HOLIDAY: 'Public holiday.',

  NATIONAL_HOLIDAY: 'National holiday.',

  OPTIONAL_HOLIDAY: 'Optional holiday.',

  WEEKEND: 'Weekend holiday.',
} as const;

/**
 * ============================================================================
 * Holiday Synchronization Messages
 * ============================================================================
 *
 * Used by scheduled jobs.
 */
export const HolidaySyncMessages = {
  JOB_STARTED: 'Holiday synchronization job started.',

  JOB_COMPLETED: 'Holiday synchronization job completed.',

  JOB_FAILED: 'Holiday synchronization job failed.',

  NO_UPDATES: 'No holiday updates found.',

  UPDATED_RECORDS: 'Holiday records updated successfully.',
} as const;

/**
 * ============================================================================
 * Holiday Integration Messages
 * ============================================================================
 *
 * Used when communicating with external holiday providers.
 */
export const HolidayIntegrationMessages = {
  PROVIDER_UNAVAILABLE: 'Holiday provider is currently unavailable.',

  PROVIDER_TIMEOUT: 'Holiday provider request timed out.',

  INVALID_RESPONSE: 'Invalid response received from holiday provider.',

  REQUEST_FAILED: 'Holiday provider request failed.',
} as const;

/**
 * ============================================================================
 * Calendar Cache Messages
 * ============================================================================
 */
export const CalendarCacheMessages = {
  CACHE_HIT: 'Calendar data loaded from cache.',

  CACHE_MISS: 'Calendar data not found in cache.',

  CACHE_STORE_FAILED: 'Unable to store calendar data in cache.',

  CACHE_DELETE_FAILED: 'Unable to remove calendar cache.',
} as const;
