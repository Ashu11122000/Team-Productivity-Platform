/**
 * ============================================================================
 * File: features/tasks/constants/task.constants.ts
 * ============================================================================
 *
 * Task Constants
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Centralize task-related constants.
 * - Configure React Query cache behavior.
 * - Store task labels and UI messages.
 * - Avoid duplicated task-related values.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Tasks are managed by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * ============================================================================
 */

/**
 * ============================================================================
 * React Query Cache Configuration
 * ============================================================================
 */

/**
 * Task collections change frequently.
 */
export const TASKS_STALE_TIME = 60 * 1000;

/**
 * Keep task cache available for 30 minutes.
 */
export const TASKS_GC_TIME = 30 * 60 * 1000;

/**
 * ============================================================================
 * Task Status Labels
 * ============================================================================
 */

export const TASK_STATUS_LABELS = {
  TODO: 'To Do',

  IN_PROGRESS: 'In Progress',

  COMPLETED: 'Completed',
} as const;

/**
 * ============================================================================
 * Task Priority Labels
 * ============================================================================
 */

export const TASK_PRIORITY_LABELS = {
  LOW: 'Low',

  MEDIUM: 'Medium',

  HIGH: 'High',
} as const;

/**
 * ============================================================================
 * Task Status Values
 * ============================================================================
 */

export const TASK_STATUS_VALUES = ['TODO', 'IN_PROGRESS', 'COMPLETED'] as const;

/**
 * ============================================================================
 * Task Priority Values
 * ============================================================================
 */

export const TASK_PRIORITY_VALUES = ['LOW', 'MEDIUM', 'HIGH'] as const;

/**
 * ============================================================================
 * Kanban Configuration
 * ============================================================================
 */

export const TASK_KANBAN_COLUMNS = ['TODO', 'IN_PROGRESS', 'COMPLETED'] as const;

/**
 * ============================================================================
 * Task Messages
 * ============================================================================
 */

export const TASK_MESSAGES = {
  FETCH_ERROR: 'Failed to load tasks.',

  CREATE_SUCCESS: 'Task created successfully.',

  CREATE_ERROR: 'Failed to create task.',

  UPDATE_SUCCESS: 'Task updated successfully.',

  UPDATE_ERROR: 'Failed to update task.',

  DELETE_SUCCESS: 'Task deleted successfully.',

  DELETE_ERROR: 'Failed to delete task.',

  STATUS_UPDATE_SUCCESS: 'Task status updated successfully.',

  STATUS_UPDATE_ERROR: 'Failed to update task status.',
} as const;
