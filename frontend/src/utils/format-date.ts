/**
 * ============================================================================
 * File: utils/date.ts
 * ============================================================================
 *
 * Date Utilities
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Format dates.
 * - Format date & time.
 * - Format relative dates.
 * - Format ISO strings.
 * - Validate dates.
 * - Shared across FastAPI & NestJS features.
 * ============================================================================
 */

const DEFAULT_LOCALE = 'en-IN';

/**
 * ============================================================================
 * Helpers
 * ============================================================================
 */

function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

function isValidDate(value: Date): boolean {
  return !Number.isNaN(value.getTime());
}

/**
 * ============================================================================
 * Date
 * ============================================================================
 */

export function formatDate(value: string | Date, locale = DEFAULT_LOCALE): string {
  const date = toDate(value);

  if (!isValidDate(date)) {
    return '-';
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * ============================================================================
 * Date & Time
 * ============================================================================
 */

export function formatDateTime(value: string | Date, locale = DEFAULT_LOCALE): string {
  const date = toDate(value);

  if (!isValidDate(date)) {
    return '-';
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * ============================================================================
 * Time
 * ============================================================================
 */

export function formatTime(value: string | Date, locale = DEFAULT_LOCALE): string {
  const date = toDate(value);

  if (!isValidDate(date)) {
    return '-';
  }

  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * ============================================================================
 * ISO
 * ============================================================================
 */

export function formatISO(value: string | Date): string {
  const date = toDate(value);

  if (!isValidDate(date)) {
    return '';
  }

  return date.toISOString();
}

/**
 * ============================================================================
 * Relative Date
 * ============================================================================
 */

export function formatRelativeDate(value: string | Date): string {
  const date = toDate(value);

  if (!isValidDate(date)) {
    return '-';
  }

  const now = Date.now();

  const diff = date.getTime() - now;

  const seconds = Math.floor(Math.abs(diff) / 1000);

  const future = diff > 0;

  if (seconds < 60) {
    return future ? 'In a few seconds' : 'Just now';
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return future ? `In ${minutes} min` : `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return future ? `In ${hours} hr` : `${hours} hr ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return future ? 'Tomorrow' : 'Yesterday';
  }

  if (days < 30) {
    return future ? `In ${days} days` : `${days} days ago`;
  }

  return formatDate(date);
}

/**
 * ============================================================================
 * Validation
 * ============================================================================
 */

export function isDateValid(value: string | Date): boolean {
  return isValidDate(toDate(value));
}
