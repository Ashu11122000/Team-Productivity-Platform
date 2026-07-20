/**
 * ============================================================================
 * File: regex.constants.ts
 * ============================================================================
 *
 * Regular expression constants for the Team Productivity Platform.
 *
 * Responsibilities
 * ----------------
 * - Centralize reusable regular expressions.
 * - Eliminate duplicated regex patterns.
 * - Improve maintainability.
 * - Standardize validation rules.
 *
 * NOTE
 * ----
 * These expressions are intended for general validation.
 * Business-specific validation should be implemented separately.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - class-validator
 * - TypeScript 5+
 * ============================================================================
 */

/**
 * ============================================================================
 * Email
 * ============================================================================
 *
 * General-purpose email validation.
 *
 * For most DTOs, prefer @IsEmail() from class-validator.
 * This regex is useful for utilities and custom validators.
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * ============================================================================
 * Strong Password
 * ============================================================================
 *
 * Requirements:
 * - At least one lowercase letter
 * - At least one uppercase letter
 * - At least one digit
 * - At least one special character
 * - Minimum 8 characters
 */
export const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&()[\]{}<>#^+=._-])[A-Za-z\d@$!%*?&()[\]{}<>#^+=._-]{8,}$/;

/**
 * ============================================================================
 * Username
 * ============================================================================
 *
 * Rules:
 * - Letters
 * - Numbers
 * - Underscore
 * - Period
 * - Hyphen
 */
export const USERNAME_REGEX = /^[a-zA-Z0-9._-]+$/;

/**
 * ============================================================================
 * UUID v4
 * ============================================================================
 */
export const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * ============================================================================
 * Slug
 * ============================================================================
 *
 * Example:
 * my-first-post
 */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * ============================================================================
 * Hex Color
 * ============================================================================
 *
 * Examples:
 * #ffffff
 * #FFF
 */
export const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

/**
 * ============================================================================
 * Phone Number (International)
 * ============================================================================
 *
 * Supports:
 * +919876543210
 * 9876543210
 */
export const PHONE_REGEX = /^\+?[1-9]\d{9,14}$/;

/**
 * ============================================================================
 * URL
 * ============================================================================
 *
 * For DTOs prefer @IsUrl().
 */
export const URL_REGEX = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;

/**
 * ============================================================================
 * Alpha Only
 * ============================================================================
 */
export const ALPHA_REGEX = /^[A-Za-z]+$/;

/**
 * ============================================================================
 * Alpha Numeric
 * ============================================================================
 */
export const ALPHANUMERIC_REGEX = /^[A-Za-z0-9]+$/;

/**
 * ============================================================================
 * Alpha Numeric + Spaces
 * ============================================================================
 */
export const ALPHANUMERIC_SPACE_REGEX = /^[A-Za-z0-9 ]+$/;

/**
 * ============================================================================
 * Numeric
 * ============================================================================
 */
export const NUMERIC_REGEX = /^[0-9]+$/;

/**
 * ============================================================================
 * Decimal Number
 * ============================================================================
 */
export const DECIMAL_REGEX = /^\d+(\.\d+)?$/;

/**
 * ============================================================================
 * ISO Date
 * ============================================================================
 *
 * Example:
 * 2026-07-20
 */
export const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * ============================================================================
 * ISO DateTime
 * ============================================================================
 *
 * Example:
 * 2026-07-20T10:30:45Z
 */
export const ISO_DATETIME_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$/;

/**
 * ============================================================================
 * Time (24-hour)
 * ============================================================================
 *
 * Example:
 * 18:30
 */
export const TIME_24H_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * ============================================================================
 * Whitespace
 * ============================================================================
 */
export const WHITESPACE_REGEX = /\s+/;

/**
 * ============================================================================
 * Multiple Spaces
 * ============================================================================
 */
export const MULTIPLE_SPACES_REGEX = /\s{2,}/g;

/**
 * ============================================================================
 * HTML Tags
 * ============================================================================
 *
 * Useful for simple sanitization checks.
 */
export const HTML_TAG_REGEX = /<[^>]*>/g;

/**
 * ============================================================================
 * File Extensions
 * ============================================================================
 */
export const IMAGE_EXTENSION_REGEX = /\.(jpg|jpeg|png|gif|webp|svg)$/i;

export const PDF_EXTENSION_REGEX = /\.pdf$/i;

/**
 * ============================================================================
 * File Names
 * ============================================================================
 */
export const SAFE_FILENAME_REGEX = /^[a-zA-Z0-9._-]+$/;

/**
 * ============================================================================
 * Common Regex Collection
 * ============================================================================
 */
export const REGEX = {
  EMAIL: EMAIL_REGEX,

  PASSWORD: STRONG_PASSWORD_REGEX,

  USERNAME: USERNAME_REGEX,

  UUID: UUID_V4_REGEX,

  SLUG: SLUG_REGEX,

  HEX_COLOR: HEX_COLOR_REGEX,

  PHONE: PHONE_REGEX,

  URL: URL_REGEX,

  ALPHA: ALPHA_REGEX,

  ALPHANUMERIC: ALPHANUMERIC_REGEX,

  ALPHANUMERIC_SPACE: ALPHANUMERIC_SPACE_REGEX,

  NUMERIC: NUMERIC_REGEX,

  DECIMAL: DECIMAL_REGEX,

  ISO_DATE: ISO_DATE_REGEX,

  ISO_DATETIME: ISO_DATETIME_REGEX,

  TIME_24H: TIME_24H_REGEX,

  WHITESPACE: WHITESPACE_REGEX,

  MULTIPLE_SPACES: MULTIPLE_SPACES_REGEX,

  HTML_TAG: HTML_TAG_REGEX,

  IMAGE_EXTENSION: IMAGE_EXTENSION_REGEX,

  PDF_EXTENSION: PDF_EXTENSION_REGEX,

  SAFE_FILENAME: SAFE_FILENAME_REGEX,
} as const;
