export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },

  NOTES: '/notes',

  TASKS: '/tasks',

  CATEGORIES: '/categories',

  TAGS: '/tags',

  NOTIFICATIONS: '/notifications',

  ANALYTICS: '/analytics',
} as const;