/**
 * ============================================================================
 * File: features/activity-logs/constants/activity-log.constants.ts
 * ============================================================================
 *
 * Activity Log Constants
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Centralize activity event constants.
 * - Provide activity categories.
 * - Provide UI filter options.
 * ============================================================================
 */

/**
 * Activity Log Actions
 *
 * These values should match backend activity events.
 */
export const ACTIVITY_LOG_ACTIONS = {
  TASK_CREATED: 'TASK_CREATED',
  TASK_UPDATED: 'TASK_UPDATED',
  TASK_DELETED: 'TASK_DELETED',

  CATEGORY_CREATED: 'CATEGORY_CREATED',
  CATEGORY_UPDATED: 'CATEGORY_UPDATED',
  CATEGORY_DELETED: 'CATEGORY_DELETED',

  TAG_CREATED: 'TAG_CREATED',
  TAG_UPDATED: 'TAG_UPDATED',
  TAG_DELETED: 'TAG_DELETED',

  REMINDER_CREATED: 'REMINDER_CREATED',
  REMINDER_UPDATED: 'REMINDER_UPDATED',
  REMINDER_DELETED: 'REMINDER_DELETED',

  NOTIFICATION_CREATED: 'NOTIFICATION_CREATED',
  NOTIFICATION_READ: 'NOTIFICATION_READ',
} as const;

/**
 * Activity Entity Types
 */
export const ACTIVITY_ENTITY_TYPES = {
  TASK: 'TASK',

  CATEGORY: 'CATEGORY',

  TAG: 'TAG',

  REMINDER: 'REMINDER',

  NOTIFICATION: 'NOTIFICATION',
} as const;

/**
 * Activity Log Filter Options
 *
 * Used by activity-log-filters.tsx
 */
export const ACTIVITY_LOG_FILTERS = [
  {
    label: 'All',
    value: 'ALL',
  },

  {
    label: 'Tasks',
    value: ACTIVITY_ENTITY_TYPES.TASK,
  },

  {
    label: 'Categories',
    value: ACTIVITY_ENTITY_TYPES.CATEGORY,
  },

  {
    label: 'Tags',
    value: ACTIVITY_ENTITY_TYPES.TAG,
  },

  {
    label: 'Reminders',
    value: ACTIVITY_ENTITY_TYPES.REMINDER,
  },

  {
    label: 'Notifications',
    value: ACTIVITY_ENTITY_TYPES.NOTIFICATION,
  },
] as const;

/**
 * Default Activity Log Pagination
 */
export const ACTIVITY_LOG_DEFAULTS = {
  PAGE: 1,

  LIMIT: 20,
} as const;

/**
 * Activity Log Display Configuration
 *
 * Used for icons/badges/colors mapping.
 */
export const ACTIVITY_LOG_CONFIG = {
  TASK: {
    label: 'Task',
    icon: 'CheckSquare',
  },

  CATEGORY: {
    label: 'Category',
    icon: 'Folder',
  },

  TAG: {
    label: 'Tag',
    icon: 'Tag',
  },

  REMINDER: {
    label: 'Reminder',
    icon: 'Bell',
  },

  NOTIFICATION: {
    label: 'Notification',
    icon: 'BellRing',
  },
} as const;
