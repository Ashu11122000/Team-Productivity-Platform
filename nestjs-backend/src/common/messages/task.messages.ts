/**
 * ============================================================================
 * File: task.messages.ts
 * ============================================================================
 *
 * Task-related application messages.
 *
 * Responsibilities
 * ----------------
 * - Centralize task-related API messages.
 * - Standardize task responses.
 * - Avoid hardcoded strings.
 * - Support task lifecycle operations.
 *
 * Used By
 * -------
 * - Tasks Controller
 * - Tasks Service
 * - Activity Logs
 * - Notifications
 * - Dashboard Analytics
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
 * Task Success Messages
 * ============================================================================
 */
export const TaskSuccessMessages = {
  /**
   * Creation
   */
  CREATED: 'Task created successfully.',

  /**
   * Retrieval
   */
  FOUND: 'Task retrieved successfully.',

  LIST_FETCHED: 'Tasks retrieved successfully.',

  /**
   * Updates
   */
  UPDATED: 'Task updated successfully.',

  /**
   * Deletion
   */
  DELETED: 'Task deleted successfully.',

  /**
   * Restoration
   */
  RESTORED: 'Task restored successfully.',

  /**
   * Completion
   */
  COMPLETED: 'Task completed successfully.',

  REOPENED: 'Task reopened successfully.',

  /**
   * Assignment
   */
  ASSIGNED: 'Task assigned successfully.',

  UNASSIGNED: 'Task unassigned successfully.',

  /**
   * Status
   */
  STATUS_UPDATED: 'Task status updated successfully.',

  /**
   * Priority
   */
  PRIORITY_UPDATED: 'Task priority updated successfully.',
} as const;

/**
 * ============================================================================
 * Task Error Messages
 * ============================================================================
 */
export const TaskErrorMessages = {
  /**
   * Resource lookup
   */
  NOT_FOUND: 'Task not found.',

  INVALID_ID: 'Invalid task identifier.',

  /**
   * Duplicate
   */
  ALREADY_EXISTS: 'Task already exists.',

  /**
   * State errors
   */
  ALREADY_COMPLETED: 'Task is already completed.',

  ALREADY_DELETED: 'Task has already been deleted.',

  INVALID_STATUS: 'Invalid task status.',

  INVALID_PRIORITY: 'Invalid task priority.',

  INVALID_TRANSITION: 'Task status transition is not allowed.',

  /**
   * Ownership
   */
  ACCESS_DENIED: 'You do not have permission to access this task.',

  NOT_OWNER: 'You are not the owner of this task.',

  /**
   * Assignment
   */
  ASSIGNEE_NOT_FOUND: 'Assigned user was not found.',

  CANNOT_ASSIGN: 'Task cannot be assigned to this user.',

  /**
   * Operations
   */
  CREATE_FAILED: 'Unable to create task.',

  UPDATE_FAILED: 'Unable to update task.',

  DELETE_FAILED: 'Unable to delete task.',
} as const;

/**
 * ============================================================================
 * Task Validation Messages
 * ============================================================================
 */
export const TaskValidationMessages = {
  TITLE_REQUIRED: 'Task title is required.',

  TITLE_TOO_SHORT: 'Task title is too short.',

  TITLE_TOO_LONG: 'Task title is too long.',

  DESCRIPTION_TOO_LONG: 'Task description is too long.',

  INVALID_DUE_DATE: 'Invalid task due date.',

  DUE_DATE_IN_PAST: 'Task due date cannot be in the past.',

  INVALID_STATUS: 'Invalid task status value.',

  INVALID_PRIORITY: 'Invalid task priority value.',

  INVALID_CATEGORY: 'Invalid task category.',
} as const;

/**
 * ============================================================================
 * Task Status Messages
 * ============================================================================
 *
 * Used during status transitions.
 */
export const TaskStatusMessages = {
  TODO: 'Task is pending.',

  IN_PROGRESS: 'Task is currently in progress.',

  COMPLETED: 'Task has been completed.',

  CANCELLED: 'Task has been cancelled.',

  ARCHIVED: 'Task has been archived.',
} as const;

/**
 * ============================================================================
 * Task Permission Messages
 * ============================================================================
 */
export const TaskPermissionMessages = {
  CREATE_DENIED: 'You do not have permission to create tasks.',

  UPDATE_DENIED: 'You do not have permission to update this task.',

  DELETE_DENIED: 'You do not have permission to delete this task.',

  VIEW_DENIED: 'You do not have permission to view this task.',
} as const;

/**
 * ============================================================================
 * Task Integration Messages
 * ============================================================================
 *
 * Used by future integrations:
 * - Notifications
 * - Calendar
 * - Analytics
 */
export const TaskIntegrationMessages = {
  NOTIFICATION_FAILED: 'Unable to send task notification.',

  ANALYTICS_UPDATE_FAILED: 'Unable to update task analytics.',

  ACTIVITY_LOG_FAILED: 'Unable to create task activity log.',
} as const;
