export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },

  NOTES: {
    BASE: '/notes',
  },

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
} as const;
