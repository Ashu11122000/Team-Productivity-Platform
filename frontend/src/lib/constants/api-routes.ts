/**
 * ============================================================================
 * FastAPI Endpoints
 * ============================================================================
 */

export const FASTAPI_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',

    REGISTER: '/auth/register',

    LOGOUT: '/auth/logout',

    REFRESH: '/auth/refresh',

    ME: '/auth/me',
  },

  USERS: {
    BASE: '/users',

    PROFILE: '/users/profile',
  },

  NOTES: {
    BASE: '/notes',
  },
} as const;

/**
 * ============================================================================
 * NestJS Endpoints
 * ============================================================================
 */

export const NESTJS_ROUTES = {
  TASKS: {
    BASE: '/tasks',
  },

  CATEGORIES: {
    BASE: '/categories',
  },

  NOTIFICATIONS: {
    BASE: '/notifications',
  },

  ANALYTICS: {
    BASE: '/analytics',
  },

  ACTIVITY_LOGS: {
    BASE: '/activity-logs',
  },

  HEALTH: '/health',
} as const;