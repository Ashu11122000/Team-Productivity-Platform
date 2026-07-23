/**
 * ============================================================================
 * File: features/tasks/utils/task.utils.ts
 * ============================================================================
 *
 * Task Utilities
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Provide reusable task helper functions.
 * - Transform task data for UI consumption.
 * - Handle task-related calculations.
 * - Keep business logic outside components.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Pure utility functions only.
 * - No React hooks.
 * - No API calls.
 * - No state management.
 * ============================================================================
 */

import type { Task, TaskStatus } from '../types/task.types';

/**
 * ============================================================================
 * Task Group Type
 * ============================================================================
 */

export type TaskGroup = Record<TaskStatus, Task[]>;

/**
 * ============================================================================
 * Group Tasks By Status
 * ============================================================================
 *
 * Used for Kanban boards.
 */

export function groupTasksByStatus(tasks: readonly Task[]): TaskGroup {
  return {
    TODO: tasks.filter((task) => task.status === 'TODO'),

    IN_PROGRESS: tasks.filter((task) => task.status === 'IN_PROGRESS'),

    COMPLETED: tasks.filter((task) => task.status === 'COMPLETED'),
  };
}

/**
 * ============================================================================
 * Get Completed Tasks
 * ============================================================================
 */

export function getCompletedTasks(tasks: readonly Task[]): Task[] {
  return tasks.filter((task) => task.status === 'COMPLETED');
}

/**
 * ============================================================================
 * Get Active Tasks
 * ============================================================================
 */

export function getActiveTasks(tasks: readonly Task[]): Task[] {
  return tasks.filter((task) => task.status !== 'COMPLETED');
}

/**
 * ============================================================================
 * Calculate Completion Percentage
 * ============================================================================
 */

export function calculateTaskCompletion(tasks: readonly Task[]): number {
  if (tasks.length === 0) {
    return 0;
  }

  const completed = getCompletedTasks(tasks).length;

  return Number(((completed / tasks.length) * 100).toFixed(2));
}

/**
 * ============================================================================
 * Check Due Date
 * ============================================================================
 */

export function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate) {
    return false;
  }

  if (task.status === 'COMPLETED') {
    return false;
  }

  return new Date(task.dueDate).getTime() < Date.now();
}

/**
 * ============================================================================
 * Sort Tasks By Due Date
 * ============================================================================
 */

export function sortTasksByDueDate(tasks: readonly Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate) {
      return 1;
    }

    if (!b.dueDate) {
      return -1;
    }

    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

/**
 * ============================================================================
 * Search Tasks
 * ============================================================================
 */

export function searchTasks(tasks: readonly Task[], search: string): Task[] {
  const query = search.trim().toLowerCase();

  if (!query) {
    return [...tasks];
  }

  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(query) || task.description?.toLowerCase().includes(query),
  );
}

/**
 * ============================================================================
 * Format Task Date
 * ============================================================================
 */

export function formatTaskDate(date: string | null, locale = 'en-IN'): string {
  if (!date) {
    return 'No due date';
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  }).format(new Date(date));
}
