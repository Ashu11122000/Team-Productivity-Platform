/**
 * ============================================================================
 * File: tag.messages.ts
 * ============================================================================
 *
 * Tag-related application messages.
 *
 * Responsibilities
 * ----------------
 * - Centralize tag-related API messages.
 * - Standardize tag responses.
 * - Avoid hardcoded strings.
 * - Support tag lifecycle operations.
 *
 * Used By
 * -------
 * - Tags Controller
 * - Tags Service
 * - Tasks Module
 * - Notes Module
 * - Search Module
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
 * Tag Success Messages
 * ============================================================================
 */
export const TagSuccessMessages = {
  /**
   * Creation
   */
  CREATED: 'Tag created successfully.',

  /**
   * Retrieval
   */
  FOUND: 'Tag retrieved successfully.',

  LIST_FETCHED: 'Tags retrieved successfully.',

  /**
   * Updates
   */
  UPDATED: 'Tag updated successfully.',

  /**
   * Deletion
   */
  DELETED: 'Tag deleted successfully.',

  /**
   * Association
   */
  ATTACHED: 'Tag attached successfully.',

  DETACHED: 'Tag removed successfully.',

  /**
   * Search
   */
  SEARCH_COMPLETED: 'Tag search completed successfully.',
} as const;

/**
 * ============================================================================
 * Tag Error Messages
 * ============================================================================
 */
export const TagErrorMessages = {
  /**
   * Resource lookup
   */
  NOT_FOUND: 'Tag not found.',

  INVALID_ID: 'Invalid tag identifier.',

  /**
   * Duplicate handling
   */
  ALREADY_EXISTS: 'Tag already exists.',

  NAME_ALREADY_EXISTS: 'A tag with this name already exists.',

  /**
   * Operations
   */
  CREATE_FAILED: 'Unable to create tag.',

  UPDATE_FAILED: 'Unable to update tag.',

  DELETE_FAILED: 'Unable to delete tag.',

  /**
   * Relationships
   */
  ALREADY_ATTACHED: 'Tag is already attached to this resource.',

  NOT_ATTACHED: 'Tag is not attached to this resource.',

  ASSOCIATION_FAILED: 'Unable to associate tag with resource.',

  /**
   * Permissions
   */
  ACCESS_DENIED: 'You do not have permission to access this tag.',

  UPDATE_DENIED: 'You do not have permission to update this tag.',

  DELETE_DENIED: 'You do not have permission to delete this tag.',
} as const;

/**
 * ============================================================================
 * Tag Validation Messages
 * ============================================================================
 */
export const TagValidationMessages = {
  NAME_REQUIRED: 'Tag name is required.',

  NAME_TOO_SHORT: 'Tag name is too short.',

  NAME_TOO_LONG: 'Tag name is too long.',

  INVALID_COLOR: 'Invalid tag color format.',

  INVALID_SLUG: 'Invalid tag slug format.',

  DUPLICATE_TAGS: 'Duplicate tags are not allowed.',
} as const;

/**
 * ============================================================================
 * Tag Permission Messages
 * ============================================================================
 */
export const TagPermissionMessages = {
  CREATE_DENIED: 'You do not have permission to create tags.',

  VIEW_DENIED: 'You do not have permission to view this tag.',

  UPDATE_DENIED: 'You do not have permission to update this tag.',

  DELETE_DENIED: 'You do not have permission to delete this tag.',
} as const;

/**
 * ============================================================================
 * Tag Integration Messages
 * ============================================================================
 *
 * Used by:
 * - Tasks
 * - Notes
 * - Analytics
 */
export const TagIntegrationMessages = {
  TASK_ASSOCIATION_FAILED: 'Unable to associate tag with task.',

  NOTE_ASSOCIATION_FAILED: 'Unable to associate tag with note.',

  ANALYTICS_UPDATE_FAILED: 'Unable to update tag analytics.',

  SEARCH_INDEX_FAILED: 'Unable to update tag search index.',
} as const;
