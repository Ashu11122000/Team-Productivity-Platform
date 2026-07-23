import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * ============================================================================
 * Class Name Utilities
 * ============================================================================
 */

/**
 * Merge Tailwind classes safely.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * ============================================================================
 * String Utilities
 * ============================================================================
 */

/**
 * Returns true if the value is null, undefined or an empty string.
 */
export function isEmpty(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim().length === 0)
  );
}

/**
 * Capitalize first letter.
 */
export function capitalize(value: string): string {
  if (!value) {
    return '';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * ============================================================================
 * Number Utilities
 * ============================================================================
 */

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * ============================================================================
 * Object Utilities
 * ============================================================================
 */

/**
 * Remove undefined properties.
 */
export function removeUndefined<T extends Record<string, unknown>>(object: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}

/**
 * ============================================================================
 * Array Utilities
 * ============================================================================
 */

/**
 * Remove duplicate items.
 */
export function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}
