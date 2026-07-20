/**
 * ============================================================================
 * File: note.messages.ts
 * ============================================================================
 *
 * Note-related application messages.
 *
 * Responsibilities
 * ----------------
 * - Centralize note-related messages.
 * - Standardize note responses.
 * - Support FastAPI note integration.
 * - Support Note -> Task conversion workflows.
 *
 * Architecture Note
 * -----------------
 * FastAPI owns:
 * - Notes CRUD
 * - Note storage
 * - Note management
 *
 * NestJS uses notes for:
 * - Task conversion
 * - Activity tracking
 * - Dashboard references
 * - Integrations
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - FastAPI Integration
 * - PostgreSQL
 * ============================================================================
 */

/**
 * ============================================================================
 * Note Success Messages
 * ============================================================================
 */
export const NoteSuccessMessages = {
  /**
   * Retrieval
   */
  FOUND: 'Note retrieved successfully.',

  LIST_FETCHED: 'Notes retrieved successfully.',

  /**
   * References
   */
  ATTACHED: 'Note attached successfully.',

  DETACHED: 'Note detached successfully.',

  /**
   * Conversion
   */
  CONVERTED_TO_TASK: 'Note converted to task successfully.',

  TASK_CREATED_FROM_NOTE: 'Task created from note successfully.',

  /**
   * Synchronization
   */
  SYNC_COMPLETED: 'Note synchronization completed successfully.',
} as const;

/**
 * ============================================================================
 * Note Error Messages
 * ============================================================================
 */
export const NoteErrorMessages = {
  /**
   * Lookup
   */
  NOT_FOUND: 'Note not found.',

  INVALID_ID: 'Invalid note identifier.',

  /**
   * Operations
   */
  FETCH_FAILED: 'Unable to retrieve note.',

  SYNC_FAILED: 'Unable to synchronize note.',

  /**
   * Conversion
   */
  CONVERSION_FAILED: 'Unable to convert note into task.',

  ALREADY_CONVERTED: 'Note has already been converted into a task.',

  INVALID_CONVERSION: 'Note cannot be converted into a task.',

  /**
   * Permissions
   */
  ACCESS_DENIED: 'You do not have permission to access this note.',

  /**
   * External service
   */
  SERVICE_UNAVAILABLE: 'Note service is currently unavailable.',
} as const;

/**
 * ============================================================================
 * Note Validation Messages
 * ============================================================================
 */
export const NoteValidationMessages = {
  TITLE_REQUIRED: 'Note title is required.',

  TITLE_TOO_LONG: 'Note title is too long.',

  CONTENT_REQUIRED: 'Note content is required.',

  CONTENT_TOO_LONG: 'Note content is too long.',

  INVALID_NOTE_FORMAT: 'Invalid note format.',
} as const;

/**
 * ============================================================================
 * Note Conversion Messages
 * ============================================================================
 *
 * Used by Note -> Task conversion workflow.
 */
export const NoteConversionMessages = {
  STARTED: 'Note conversion started.',

  COMPLETED: 'Note conversion completed.',

  FAILED: 'Note conversion failed.',

  TASK_ALREADY_EXISTS: 'A task already exists for this note.',
} as const;

/**
 * ============================================================================
 * Note Integration Messages
 * ============================================================================
 *
 * Used when NestJS communicates with FastAPI.
 */
export const NoteIntegrationMessages = {
  FASTAPI_CONNECTION_FAILED: 'Unable to connect to note service.',

  FASTAPI_TIMEOUT: 'Note service request timed out.',

  FASTAPI_INVALID_RESPONSE: 'Invalid response received from note service.',

  FASTAPI_SYNC_FAILED: 'Failed to synchronize notes from FastAPI.',
} as const;

/**
 * ============================================================================
 * Note Activity Messages
 * ============================================================================
 *
 * Used by Activity Logs module.
 */
export const NoteActivityMessages = {
  NOTE_VIEWED: 'Note viewed.',

  NOTE_LINKED_TO_TASK: 'Note linked to task.',

  NOTE_CONVERTED_TO_TASK: 'Note converted into task.',
} as const;
