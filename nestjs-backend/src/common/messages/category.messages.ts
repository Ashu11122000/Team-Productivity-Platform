/**
 * ============================================================================
 * File: category.messages.ts
 * ============================================================================
 *
 * Category-related application messages.
 *
 * Responsibilities
 * ----------------
 * - Centralize category-related API messages.
 * - Standardize category responses.
 * - Avoid hardcoded strings.
 * - Support category lifecycle operations.
 *
 * Used By
 * -------
 * - Categories Controller
 * - Categories Service
 * - Tasks Module
 * - Analytics Module
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM
 * - PostgreSQL
 * ============================================================================
 */

/**
 * ============================================================================
 * Category Success Messages
 * ============================================================================
 */
export const CategorySuccessMessages = {
  /**
   * Creation
   */
  CREATED: 'Category created successfully.',

  /**
   * Retrieval
   */
  FOUND: 'Category retrieved successfully.',

  LIST_FETCHED: 'Categories retrieved successfully.',

  /**
   * Updates
   */
  UPDATED: 'Category updated successfully.',

  /**
   * Deletion
   */
  DELETED: 'Category deleted successfully.',

  /**
   * Restoration
   */
  RESTORED: 'Category restored successfully.',

  /**
   * Task association
   */
  TASKS_FETCHED: 'Category tasks retrieved successfully.',
} as const;

/**
 * ============================================================================
 * Category Error Messages
 * ============================================================================
 */
export const CategoryErrorMessages = {
  /**
   * Resource lookup
   */
  NOT_FOUND: 'Category not found.',

  INVALID_ID: 'Invalid category identifier.',

  /**
   * Duplicate handling
   */
  ALREADY_EXISTS: 'Category already exists.',

  NAME_ALREADY_EXISTS: 'A category with this name already exists.',

  /**
   * Operations
   */
  CREATE_FAILED: 'Unable to create category.',

  UPDATE_FAILED: 'Unable to update category.',

  DELETE_FAILED: 'Unable to delete category.',

  /**
   * Relationships
   */
  HAS_ASSOCIATED_TASKS:
    'Category cannot be deleted because tasks are associated with it.',

  TASK_ASSOCIATION_FAILED: 'Unable to associate tasks with category.',

  /**
   * Permissions
   */
  ACCESS_DENIED: 'You do not have permission to access this category.',

  UPDATE_DENIED: 'You do not have permission to update this category.',

  DELETE_DENIED: 'You do not have permission to delete this category.',
} as const;

/**
 * ============================================================================
 * Category Validation Messages
 * ============================================================================
 */
export const CategoryValidationMessages = {
  NAME_REQUIRED: 'Category name is required.',

  NAME_TOO_SHORT: 'Category name is too short.',

  NAME_TOO_LONG: 'Category name is too long.',

  DESCRIPTION_TOO_LONG: 'Category description is too long.',

  INVALID_COLOR: 'Invalid category color format.',

  INVALID_ICON: 'Invalid category icon format.',
} as const;

/**
 * ============================================================================
 * Category Permission Messages
 * ============================================================================
 */
export const CategoryPermissionMessages = {
  CREATE_DENIED: 'You do not have permission to create categories.',

  VIEW_DENIED: 'You do not have permission to view this category.',

  UPDATE_DENIED: 'You do not have permission to update this category.',

  DELETE_DENIED: 'You do not have permission to delete this category.',
} as const;

/**
 * ============================================================================
 * Category Integration Messages
 * ============================================================================
 *
 * Used by future modules:
 * - Tasks
 * - Analytics
 * - Dashboard
 */
export const CategoryIntegrationMessages = {
  TASK_FILTER_FAILED: 'Unable to filter tasks by category.',

  ANALYTICS_UPDATE_FAILED: 'Unable to update category analytics.',

  STATISTICS_GENERATION_FAILED: 'Unable to generate category statistics.',
} as const;
