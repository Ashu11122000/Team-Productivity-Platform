/**
 * ============================================================================
 * File: common.messages.ts
 * ============================================================================
 *
 * Common application messages.
 *
 * Responsibilities
 * ----------------
 * - Centralize generic user-facing messages.
 * - Standardize API responses.
 * - Avoid hardcoded strings.
 * - Provide reusable messages across modules.
 *
 * NOTE
 * ----
 * Module-specific messages should live in their own files:
 *
 * auth.messages.ts
 * task.messages.ts
 * user.messages.ts
 * etc.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - REST API responses
 * ============================================================================
 */

/**
 * ============================================================================
 * Common Success Messages
 * ============================================================================
 */
export const CommonSuccessMessages = {
  /**
   * Generic operation success.
   */
  SUCCESS: 'Operation completed successfully.',

  /**
   * Resource lifecycle messages.
   */
  CREATED: 'Resource created successfully.',

  UPDATED: 'Resource updated successfully.',

  DELETED: 'Resource deleted successfully.',

  RESTORED: 'Resource restored successfully.',

  FETCHED: 'Resource retrieved successfully.',

  PROCESSED: 'Request processed successfully.',
} as const;

/**
 * ============================================================================
 * Common Error Messages
 * ============================================================================
 */
export const CommonErrorMessages = {
  /**
   * Generic errors.
   */
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again later.',

  INTERNAL_SERVER_ERROR: 'Internal server error occurred.',

  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable.',

  REQUEST_FAILED: 'Request could not be completed.',

  OPERATION_FAILED: 'Operation failed.',

  /**
   * Resource errors.
   */
  NOT_FOUND: 'Requested resource was not found.',

  ALREADY_EXISTS: 'Resource already exists.',

  INVALID_ID: 'Invalid resource identifier.',

  /**
   * Request errors.
   */
  BAD_REQUEST: 'Invalid request.',

  VALIDATION_FAILED: 'Validation failed.',

  INVALID_INPUT: 'Invalid input provided.',

  MISSING_REQUIRED_FIELDS: 'Required fields are missing.',

  /**
   * Permission errors.
   */
  UNAUTHORIZED: 'Authentication is required.',

  FORBIDDEN: 'You do not have permission to perform this action.',

  ACCESS_DENIED: 'Access denied.',
} as const;

/**
 * ============================================================================
 * Common Database Messages
 * ============================================================================
 */
export const DatabaseMessages = {
  CONNECTION_FAILED: 'Unable to connect to the database.',

  QUERY_FAILED: 'Database operation failed.',

  DUPLICATE_ENTRY: 'A record with the same information already exists.',

  TRANSACTION_FAILED: 'Database transaction failed.',
} as const;

/**
 * ============================================================================
 * Common Validation Messages
 * ============================================================================
 */
export const ValidationMessages = {
  REQUIRED: 'This field is required.',

  INVALID_FORMAT: 'Invalid format.',

  INVALID_VALUE: 'Invalid value.',

  TOO_SHORT: 'Value is too short.',

  TOO_LONG: 'Value is too long.',

  INVALID_TYPE: 'Invalid data type.',

  INVALID_UUID: 'Invalid UUID format.',
} as const;

/**
 * ============================================================================
 * Common Pagination Messages
 * ============================================================================
 */
export const PaginationMessages = {
  INVALID_PAGE: 'Invalid page number.',

  INVALID_LIMIT: 'Invalid page size.',

  LIMIT_EXCEEDED: 'Requested page size exceeds the maximum allowed limit.',
} as const;

/**
 * ============================================================================
 * Common File Messages
 * ============================================================================
 */
export const FileMessages = {
  UPLOAD_SUCCESS: 'File uploaded successfully.',

  UPLOAD_FAILED: 'File upload failed.',

  INVALID_TYPE: 'Invalid file type.',

  TOO_LARGE: 'File size exceeds the allowed limit.',

  NOT_FOUND: 'File not found.',
} as const;

/**
 * ============================================================================
 * Common Integration Messages
 * ============================================================================
 */
export const IntegrationMessages = {
  SERVICE_UNAVAILABLE: 'External service is currently unavailable.',

  TIMEOUT: 'External service request timed out.',

  INVALID_RESPONSE: 'Invalid response received from external service.',
} as const;
