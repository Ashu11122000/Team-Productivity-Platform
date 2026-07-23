/**
 * ============================================================================
 * File: features/categories/utils/category.utils.ts
 * ============================================================================
 *
 * Category Utilities
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Format category data for UI rendering.
 * - Provide category helper functions.
 * - Keep business/display logic outside components.
 * ============================================================================
 */

import type { Category } from '../types/category.types';

/**
 * Format category name
 *
 * Example:
 *
 * "  Development  "
 * =>
 * "Development"
 */
export function formatCategoryName(name: string): string {
  return name.trim();
}

/**
 * Get category display label
 *
 * Used when category name is missing.
 */
export function getCategoryLabel(category: Category): string {
  return category.name || 'Unnamed Category';
}

/**
 * Get category description
 */
export function getCategoryDescription(category: Category): string {
  return category.description || 'No description available';
}

/**
 * Get category color
 *
 * Provides fallback color for UI.
 */
export function getCategoryColor(category: Category): string {
  return category.color || '#64748B';
}

/**
 * Sort categories alphabetically
 */
export function sortCategories(categories: Category[]): Category[] {
  return [...categories].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Search categories locally
 *
 * Useful for client-side filtering.
 */
export function searchCategories(categories: Category[], search: string): Category[] {
  const query = search.toLowerCase().trim();

  if (!query) {
    return categories;
  }

  return categories.filter((category) => category.name.toLowerCase().includes(query));
}

/**
 * Format category creation date
 */
export function formatCategoryDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Check whether category belongs to user
 */
export function isUserCategory(category: Category, userId: string): boolean {
  return category.userId === userId;
}

/**
 * Create category initials
 *
 * Example:
 *
 * "Work Tasks"
 * =>
 * "WT"
 */
export function getCategoryInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase())
    .join('')
    .slice(0, 2);
}
