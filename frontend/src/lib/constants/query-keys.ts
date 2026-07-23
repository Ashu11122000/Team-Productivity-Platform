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

  noteList: (params?: unknown) => ['notes', 'list', params] as const,

  noteSearch: (query?: string) => ['notes', 'search', query] as const,

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

  categoryList: (params?: unknown) => ['categories', 'list', params] as const,

  /**
   * ==========================================================================
   * Tags (NestJS)
   * ==========================================================================
   */

  tags: ['tags'] as const,

  tag: (id: string) => ['tags', id] as const,

  tagList: (params?: unknown) => ['tags', 'list', params] as const,

  /**
   * ==========================================================================
   * Reminders (NestJS)
   * ==========================================================================
   */

  reminders: ['reminders'] as const,

  reminder: (id: string) => ['reminders', id] as const,

  reminderList: (params?: unknown) => ['reminders', 'list', params] as const,

  reminderStatistics: ['reminders', 'statistics'] as const,

  /**
   * ==========================================================================
   * Notifications (NestJS)
   * ==========================================================================
   */

  notifications: ['notifications'] as const,

  notification: (id: string) => ['notifications', id] as const,

  notificationList: (params?: unknown) => ['notifications', 'list', params] as const,

  notificationSummary: ['notifications', 'summary'] as const,

  notificationStats: ['notifications', 'stats'] as const,

  /**
   * ==========================================================================
   * Dashboard (NestJS)
   * ==========================================================================
   */

  dashboard: ['dashboard'] as const,

  dashboardOverview: ['dashboard', 'overview'] as const,

  dashboardStats: ['dashboard', 'stats'] as const,

  dashboardRecentActivity: ['dashboard', 'recent-activity'] as const,

  dashboardTaskSummary: ['dashboard', 'task-summary'] as const,

  /**
   * ==========================================================================
   * Analytics (NestJS)
   * ==========================================================================
   */

  analytics: ['analytics'] as const,

  analyticsOverview: ['analytics', 'overview'] as const,

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

  activityLogList: (params?: unknown) => ['activity-logs', 'list', params] as const,

  activityLogFilter: (filters?: unknown) => ['activity-logs', 'filter', filters] as const,

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
   * Settings / Preferences
   * ==========================================================================
   */

  settings: ['settings'] as const,

  userSettings: ['settings', 'user'] as const,

  appearanceSettings: ['settings', 'appearance'] as const,

  notificationSettings: ['settings', 'notifications'] as const,

  preferences: ['preferences'] as const,
} as const;
