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

  taskList: (params?: unknown) => ['tasks', 'list', params] as const,

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

  reminderStatistics: ['reminders', 'statistics'] as const,

  /**
   * ==========================================================================
   * Notifications (NestJS)
   * ==========================================================================
   */

  notifications: ['notifications'] as const,

  notification: (id: string) => ['notifications', id] as const,

  notificationSummary: ['notifications', 'summary'] as const,

  notificationStats: ['notifications', 'stats'] as const,

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

  taskAnalytics: ['analytics', 'tasks'] as const,

  taskStatusAnalytics: ['analytics', 'tasks', 'status'] as const,

  taskPriorityAnalytics: ['analytics', 'tasks', 'priority'] as const,

  productivityAnalytics: ['analytics', 'productivity'] as const,

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

  calendarEvents: ['calendar', 'events'] as const,

  holidays: ['calendar', 'holidays'] as const,

  /**
   * ==========================================================================
   * User Preferences
   * ==========================================================================
   */

  preferences: ['preferences'] as const,
} as const;
