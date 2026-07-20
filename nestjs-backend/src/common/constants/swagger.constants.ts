/**
 * ============================================================================
 * File: swagger.constants.ts
 * ============================================================================
 *
 * Swagger (OpenAPI) constants for the Team Productivity Platform.
 *
 * Responsibilities
 * ----------------
 * - Centralize Swagger tag names.
 * - Standardize operation summaries.
 * - Standardize descriptions.
 * - Eliminate magic strings.
 * - Provide reusable documentation constants.
 *
 * NOTE
 * ----
 * Runtime Swagger configuration belongs in:
 *
 * src/config/swagger.config.ts
 *
 * This file only contains immutable documentation constants.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - @nestjs/swagger
 * ============================================================================
 */

/**
 * ============================================================================
 * Swagger Tags
 * ============================================================================
 *
 * Used by:
 *
 * @ApiTags(SWAGGER_TAGS.TASKS)
 */
export const SWAGGER_TAGS = {
  AUTH: 'Authentication',

  USERS: 'Users',

  TASKS: 'Tasks',

  NOTES: 'Notes',

  CATEGORIES: 'Categories',

  TAGS: 'Tags',

  NOTIFICATIONS: 'Notifications',

  ANALYTICS: 'Analytics',

  DASHBOARD: 'Dashboard',

  CALENDAR: 'Calendar',

  REMINDERS: 'Reminders',

  HEALTH: 'Health',
} as const;

/**
 * ============================================================================
 * Swagger Security
 * ============================================================================
 */
export const SWAGGER_SECURITY = {
  JWT: 'JWT',
} as const;

/**
 * ============================================================================
 * Common Operation Summaries
 * ============================================================================
 */
export const SWAGGER_OPERATION = {
  CREATE: 'Create a new resource',

  GET_ALL: 'Retrieve all resources',

  GET_ONE: 'Retrieve a resource by ID',

  UPDATE: 'Update a resource',

  DELETE: 'Delete a resource',

  RESTORE: 'Restore a deleted resource',

  SEARCH: 'Search resources',

  HEALTH: 'Check API health status',
} as const;

/**
 * ============================================================================
 * Common Response Descriptions
 * ============================================================================
 */
export const SWAGGER_RESPONSE = {
  SUCCESS: 'Request completed successfully.',

  CREATED: 'Resource created successfully.',

  UPDATED: 'Resource updated successfully.',

  DELETED: 'Resource deleted successfully.',

  BAD_REQUEST: 'Invalid request.',

  UNAUTHORIZED: 'Authentication required.',

  FORBIDDEN: 'Access denied.',

  NOT_FOUND: 'Requested resource was not found.',

  CONFLICT: 'Resource already exists.',

  VALIDATION_ERROR: 'Validation failed.',

  INTERNAL_SERVER_ERROR: 'Internal server error.',
} as const;

/**
 * ============================================================================
 * Common Parameter Descriptions
 * ============================================================================
 */
export const SWAGGER_PARAMETER = {
  ID: 'Unique resource identifier.',

  PAGE: 'Page number.',

  LIMIT: 'Number of records per page.',

  SORT_BY: 'Field used for sorting.',

  SORT_ORDER: 'Sorting order (ASC or DESC).',

  SEARCH: 'Search keyword.',
} as const;

/**
 * ============================================================================
 * Authentication Descriptions
 * ============================================================================
 */
export const SWAGGER_AUTH = {
  DESCRIPTION:
    'Provide the JWT access token issued by the FastAPI authentication service.',
} as const;
