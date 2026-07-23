/**
 * ============================================================================
 * File: features/activity-logs/utils/activity-log.utils.ts
 * ============================================================================
 *
 * Activity Log Utilities
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Format activity log data for UI rendering.
 * - Convert backend actions into readable labels.
 * - Provide helper functions for activity display.
 * ============================================================================
 */

/**
 * Convert activity action into readable text
 *
 * Example:
 *
 * TASK_CREATED
 * =>
 * "Created a task"
 */
export function formatActivityAction(action: string): string {
  const actions: Record<string, string> = {
    TASK_CREATED: 'Created a task',
    TASK_UPDATED: 'Updated a task',
    TASK_DELETED: 'Deleted a task',

    CATEGORY_CREATED: 'Created a category',
    CATEGORY_UPDATED: 'Updated a category',
    CATEGORY_DELETED: 'Deleted a category',

    TAG_CREATED: 'Created a tag',
    TAG_UPDATED: 'Updated a tag',
    TAG_DELETED: 'Deleted a tag',

    REMINDER_CREATED: 'Created a reminder',
    REMINDER_UPDATED: 'Updated a reminder',
    REMINDER_DELETED: 'Deleted a reminder',

    NOTIFICATION_READ: 'Read a notification',
  };

  return actions[action] ?? action;
}

/**
 * Extract entity type from activity action
 *
 * Example:
 *
 * TASK_CREATED
 * =>
 * TASK
 */
export function getActivityEntityType(action: string): string {
  return action.split('_')[0] ?? 'UNKNOWN';
}

/**
 * Format activity date
 *
 * Example:
 *
 * 2026-07-23T10:30:00Z
 * =>
 * Jul 23, 2026
 */
export function formatActivityDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Format activity date and time
 *
 * Example:
 *
 * Jul 23, 2026, 10:30 AM
 */
export function formatActivityDateTime(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * Check whether activity belongs to an entity type
 */
export function isActivityType(action: string, type: string): boolean {
  return action.startsWith(type);
}

/**
 * Get activity category
 *
 * Used for filters/tabs.
 */
export function getActivityCategory(
  action: string,
): 'TASK' | 'CATEGORY' | 'TAG' | 'REMINDER' | 'NOTIFICATION' | 'OTHER' {
  if (action.startsWith('TASK')) {
    return 'TASK';
  }

  if (action.startsWith('CATEGORY')) {
    return 'CATEGORY';
  }

  if (action.startsWith('TAG')) {
    return 'TAG';
  }

  if (action.startsWith('REMINDER')) {
    return 'REMINDER';
  }

  if (action.startsWith('NOTIFICATION')) {
    return 'NOTIFICATION';
  }

  return 'OTHER';
}

/**
 * Get activity icon name
 *
 * Components can map these values
 * to Lucide icons.
 */
export function getActivityIcon(action: string): string {
  const icons: Record<string, string> = {
    TASK_CREATED: 'PlusCircle',
    TASK_UPDATED: 'Edit',
    TASK_DELETED: 'Trash2',

    CATEGORY_CREATED: 'FolderPlus',
    CATEGORY_UPDATED: 'FolderEdit',
    CATEGORY_DELETED: 'FolderMinus',

    TAG_CREATED: 'Tag',
    TAG_UPDATED: 'Tag',
    TAG_DELETED: 'Tag',

    REMINDER_CREATED: 'BellPlus',
    REMINDER_UPDATED: 'Bell',
    REMINDER_DELETED: 'BellOff',
  };

  return icons[action] ?? 'Activity';
}

/**
 * Sort activities by newest first
 */
export function sortActivitiesByDate<T extends { createdAt: string }>(activities: T[]): T[] {
  return [...activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
