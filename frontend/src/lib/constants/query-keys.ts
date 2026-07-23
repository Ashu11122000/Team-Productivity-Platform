/**
 * ============================================================================
 * File: lib/constants/query-keys.ts
 * ============================================================================
 *
 * React Query Keys
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Centralize all TanStack Query cache keys.
 * - Match FastAPI backend resources.
 * - Match NestJS backend resources.
 * - Prevent hard-coded cache keys.
 * ============================================================================
 */

export const QUERY_KEYS = {
  /**
   * ==========================================================================
   * Authentication (FastAPI)
   * ==========================================================================
   */

  auth: ['auth'] as const,

  currentUser: ['current-user'] as const,

  profile: ['profile'] as const,

  /**
   * ==========================================================================
   * Users (FastAPI)
   * ==========================================================================
   */

  users: ['users'] as const,

  user: (id: number | string) => ['users', id] as const,

  /**
   * ==========================================================================
   * Notes (FastAPI)
   * ==========================================================================
   */

  notes: ['notes'] as const,

  note: (id: number | string) => ['notes', id] as const,

  /**
   * ==========================================================================
   * Tasks (NestJS)
   * ==========================================================================
   */

  tasks: ['tasks'] as const,

  task: (id: string) => ['tasks', id] as const,

  /**
   * ==========================================================================
   * Categories (NestJS)
   * ==========================================================================
   */

  categories: ['categories'] as const,

  category: (id: string) => ['categories', id] as const,

  /**
   * ==========================================================================
   * Tags (NestJS)
   * ==========================================================================
   */

  tags: ['tags'] as const,

  tag: (id: string) => ['tags', id] as const,

  /**
   * ==========================================================================
   * Reminders (NestJS)
   * ==========================================================================
   */

  reminders: ['reminders'] as const,

  reminder: (id: string) => ['reminders', id] as const,

  reminderStatistics: ['reminder-statistics'] as const,

  /**
   * ==========================================================================
   * Notifications (NestJS)
   * ==========================================================================
   */

  notifications: ['notifications'] as const,

  notification: (id: string) => ['notifications', id] as const,

  notificationSummary: ['notification-summary'] as const,

  notificationStats: ['notification-stats'] as const,

  /**
   * ==========================================================================
   * Dashboard (NestJS)
   * ==========================================================================
   */

  dashboard: ['dashboard'] as const,

  /**
   * ==========================================================================
   * Analytics (NestJS)
   * ==========================================================================
   */

  analytics: ['analytics'] as const,

  taskAnalytics: ['task-analytics'] as const,

  taskStatusAnalytics: ['task-status-analytics'] as const,

  taskPriorityAnalytics: ['task-priority-analytics'] as const,

  productivityAnalytics: ['productivity-analytics'] as const,

  /**
   * ==========================================================================
   * Activity Logs (NestJS)
   * ==========================================================================
   */

  activityLogs: ['activity-logs'] as const,

  activityLog: (id: string) => ['activity-logs', id] as const,

  /**
   * ==========================================================================
   * Calendar (NestJS)
   * ==========================================================================
   */

  calendar: ['calendar'] as const,

  calendarEvents: ['calendar-events'] as const,

  holidays: ['holidays'] as const,

  /**
   * ==========================================================================
   * User Preferences
   * ==========================================================================
   */

  preferences: ['preferences'] as const,
} as const;
