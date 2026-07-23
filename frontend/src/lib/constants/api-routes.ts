/**
 * ============================================================================
 * File: lib/constants/api-routes.ts
 * ============================================================================
 *
 * API Route Constants
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Centralize all API endpoints.
 * - Match FastAPI backend routes.
 * - Match NestJS backend routes.
 * - Prevent hard-coded URLs throughout the frontend.
 * ============================================================================
 */

/**
 * ============================================================================
 * FastAPI Routes
 * ============================================================================
 */

export const FASTAPI_ROUTES = {
  ROOT: '/',

  HEALTH: '/health',

  AUTH: {
    LOGIN: '/auth/login',

    REGISTER: '/auth/register',

    LOGOUT: '/auth/logout',

    REFRESH: '/auth/refresh',

    ME: '/auth/me',
  },

  USERS: {
    BASE: '/users',

    ME: '/users/me',

    BY_ID: (id: number | string) => `/users/${id}`,
  },

  NOTES: {
    BASE: '/notes',

    BY_ID: (id: number | string) => `/notes/${id}`,

    ADMIN_ALL: '/notes/admin/all',

    CONVERT_TO_TASK: (id: number | string) => `/notes/${id}/convert-to-task`,
  },
} as const;

/**
 * ============================================================================
 * NestJS Routes
 * ============================================================================
 */

export const NESTJS_ROUTES = {
  TASKS: {
    BASE: '/tasks',

    BY_ID: (id: string) => `/tasks/${id}`,
  },

  CATEGORIES: {
    BASE: '/categories',

    BY_ID: (id: string) => `/categories/${id}`,
  },

  TAGS: {
    BASE: '/tags',

    BY_ID: (id: string) => `/tags/${id}`,
  },

  NOTIFICATIONS: {
    BASE: '/notifications',

    BY_ID: (id: string) => `/notifications/${id}`,

    RESTORE: (id: string) => `/notifications/${id}/restore`,

    MARK_READ: (id: string) => `/notifications/${id}/read`,

    MARK_ALL_READ: '/notifications/read-all',

    SUMMARY: '/notifications/summary',

    STATS: '/notifications/stats',
  },

  REMINDERS: {
    BASE: '/reminders',

    BY_ID: (id: string) => `/reminders/${id}`,

    STATISTICS: '/reminders/statistics',
  },

  ACTIVITY_LOGS: {
    BASE: '/activity-logs',

    BY_ID: (id: string) => `/activity-logs/${id}`,
  },

  ANALYTICS: {
    BASE: '/analytics',

    PRODUCTIVITY: '/analytics/productivity',

    TASKS: '/analytics/tasks',
  },

  DASHBOARD: {
    BASE: '/dashboard',
  },

  CALENDAR: {
    BASE: '/calendar',

    HOLIDAYS: '/calendar/holidays',

    EVENTS: '/calendar/events',
  },
} as const;
