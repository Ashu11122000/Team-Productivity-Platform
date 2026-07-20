/**
 * ============================================================================
 * File: validation.messages.ts
 * ============================================================================
 *
 * Validation Messages
 *
 * Responsibilities
 * ----------------
 * - Centralize reusable validation messages.
 * - Eliminate hardcoded strings in DTOs and pipes.
 * - Standardize validation responses across the application.
 * - Improve consistency and maintainability.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - class-validator
 * * ============================================================================
 */

/**
 * Validation messages.
 */
export const ValidationMessages = {
  /**
   * --------------------------------------------------------------------------
   * Generic
   * --------------------------------------------------------------------------
   */
  REQUIRED: 'This field is required.',
  OPTIONAL: 'This field is optional.',
  VALIDATION_FAILED: 'Validation failed.',

  /**
   * --------------------------------------------------------------------------
   * Type Validation
   * --------------------------------------------------------------------------
   */
  INVALID_TYPE: 'Invalid data type.',
  INVALID_VALUE: 'Invalid value.',
  INVALID_FORMAT: 'Invalid format.',

  /**
   * --------------------------------------------------------------------------
   * String Validation
   * --------------------------------------------------------------------------
   */
  TOO_SHORT: 'Value is too short.',
  TOO_LONG: 'Value is too long.',
  MUST_BE_STRING: 'Value must be a string.',
  MUST_NOT_BE_EMPTY: 'Value must not be empty.',

  /**
   * --------------------------------------------------------------------------
   * Number Validation
   * --------------------------------------------------------------------------
   */
  INVALID_NUMBER: 'Invalid number.',
  INVALID_INTEGER: 'Invalid integer.',
  MUST_BE_POSITIVE: 'Value must be a positive number.',
  MUST_BE_NEGATIVE: 'Value must be a negative number.',
  MUST_BE_BOOLEAN: 'Value must be a boolean.',

  /**
   * --------------------------------------------------------------------------
   * UUID
   * --------------------------------------------------------------------------
   */
  INVALID_UUID: 'Invalid UUID format.',

  /**
   * --------------------------------------------------------------------------
   * Date & Time
   * --------------------------------------------------------------------------
   */
  INVALID_DATE: 'Invalid date.',
  INVALID_TIME: 'Invalid time.',
  INVALID_DATETIME: 'Invalid date and time.',

  /**
   * --------------------------------------------------------------------------
   * Email / Username / Password
   * --------------------------------------------------------------------------
   */
  INVALID_EMAIL: 'Invalid email address.',
  INVALID_USERNAME: 'Invalid username.',
  INVALID_PASSWORD: 'Invalid password.',

  /**
   * --------------------------------------------------------------------------
   * URL / Slug
   * --------------------------------------------------------------------------
   */
  INVALID_URL: 'Invalid URL.',
  INVALID_SLUG: 'Invalid slug.',

  /**
   * --------------------------------------------------------------------------
   * Pagination
   * --------------------------------------------------------------------------
   */
  INVALID_PAGINATION: 'Invalid pagination parameters.',
  INVALID_PAGE: 'Invalid page number.',
  INVALID_LIMIT: 'Invalid page size.',
  INVALID_SORT_ORDER: 'Invalid sort order.',
  INVALID_SORT_FIELD: 'Invalid sort field.',

  /**
   * --------------------------------------------------------------------------
   * Arrays
   * --------------------------------------------------------------------------
   */
  INVALID_ARRAY: 'Invalid array.',
  ARRAY_EMPTY: 'Array must not be empty.',

  /**
   * --------------------------------------------------------------------------
   * Files
   * --------------------------------------------------------------------------
   */
  INVALID_FILE: 'Invalid file.',
  FILE_TOO_LARGE: 'Uploaded file exceeds the maximum allowed size.',
  UNSUPPORTED_FILE_TYPE: 'Unsupported file type.',

  /**
   * --------------------------------------------------------------------------
   * JSON
   * --------------------------------------------------------------------------
   */
  INVALID_JSON: 'Invalid JSON payload.',
} as const;

/**
 * Validation message keys.
 */
export type ValidationMessageKey = keyof typeof ValidationMessages;
